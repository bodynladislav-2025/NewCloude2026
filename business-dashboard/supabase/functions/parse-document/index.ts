// Supabase Edge Function – Parsování dokumentů pomocí Claude API
// Deploy: supabase functions deploy parse-document
// Secret:  supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const CLAUDE_MODEL      = 'claude-sonnet-4-20250514';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (!ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ANTHROPIC_API_KEY není nastaven v Supabase secrets' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const { type, dataType, imageBase64, mimeType } = body;

    if (type !== 'screenshot' || !imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Nepodporovaný typ požadavku' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = getSystemPrompt(dataType);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type:       'base64',
                  media_type: mimeType || 'image/png',
                  data:        imageBase64,
                },
              },
              {
                type: 'text',
                text: 'Analyzuj tento screenshot z ERP systému K2 a extrahuj data do požadovaného JSON formátu. Odpověz POUZE validním JSON objektem bez jakéhokoliv dalšího textu.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API chyba: ${err}`);
    }

    const claudeData = await response.json();
    const text = claudeData.content?.[0]?.text || '{}';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Claude nevrátil validní JSON');

    const parsed = JSON.parse(jsonMatch[0]);

    // Normalize to { columns, rows } format
    let columns: string[] = [];
    let rows: Record<string, unknown>[] = [];

    if (Array.isArray(parsed)) {
      rows = parsed;
      columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    } else if (parsed.rows && Array.isArray(parsed.rows)) {
      rows = parsed.rows;
      columns = parsed.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
    } else {
      // Single object – wrap in array
      rows = [parsed];
      columns = Object.keys(parsed);
    }

    return new Response(
      JSON.stringify({ columns, rows }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});

function getSystemPrompt(dataType: string): string {
  const base = `Jsi expert na analýzu dat z ERP systému K2.
Odpovídáš POUZE validním JSON objektem ve formátu { "columns": [...], "rows": [...] }.
Sloupce a hodnoty mohou být česky nebo anglicky – zachovej originální názvy z K2.
Čísla v Kč vrátíš jako číslo (integer), bez mezer a symbolů měny.
Data ve formátu YYYY-MM-DD.`;

  switch (dataType) {
    case 'sales':
      return `${base}
Hledáš tato data: tržby/obrat obchodníků.
Sloupce by měly obsahovat: Obchodník (jméno), Tržby (Kč), Zakázky (počet), Tým/Oddělení (pokud existuje).
Příklad řádku: { "Obchodník": "Jan Novák", "Tržby": 1250000, "Zakázky": 12, "Tým": "Jih" }`;

    case 'opportunities':
      return `${base}
Hledáš data o obchodních příležitostech/pipeline.
Sloupce: Partner/Zákazník, Hodnota (Kč), Stav/Fáze, Datum vytvoření, Obchodník.
Příklad: { "Partner": "ABC s.r.o.", "Hodnota": 500000, "Stav": "Nabídka", "Datum": "2025-01-15", "Obchodník": "Jan Novák" }`;

    case 'invoices':
      return `${base}
Hledáš aging faktury (saldo pohledávek po splatnosti).
Rozděl do pásem: 0-30, 31-60, 61-90, 90+ dní po splatnosti.
Příklad: { "0-30": 150000, "31-60": 80000, "61-90": 30000, "90+": 10000 }
Nebo jako pole řádků s poli "Pásmo" a "Částka".`;

    default:
      return `${base}
Extrahuj všechna tabulková data z obrázku. Zachovej všechny sloupce a hodnoty.`;
  }
}
