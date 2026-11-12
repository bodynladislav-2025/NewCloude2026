# Podklady pro nastavení LeadConnectoru

| Soubor | K čemu |
|---|---|
| `custom-fields.csv` | Seznam vlastních polí k založení (Settings → Custom Fields). Klíče odpovídají tomu, co posílá web. |
| `tagy.csv` | Seznam tagů. |
| `webhook-payloady.json` | Ukázky dat z webu pro každý Inbound Webhook. Vložte je jako testovací požadavek, ať jde namapovat pole. |

Pipelines, 17 workflows, kalendáře a dashboard jsou popsané v [`../09-leadconnector-a-spusteni.md`](../09-leadconnector-a-spusteni.md). Texty emailů a SMS v [`../07-emaily-a-sms.md`](../07-emaily-a-sms.md).

**Postup:** 1) založit pole a tagy, 2) vytvořit 4 workflow s triggerem Inbound Webhook (audit, kalkulačka, příprava, kontakt), 3) jejich URL vložit do `.env` webu, 4) poslat testovací formulář z webu a namapovat pole, 5) doplnit akce podle fáze 9.

Importní CSV LeadConnector pro vlastní pole přímo nenabízí, pole se zakládají ručně nebo přes API. CSV slouží jako kontrolní seznam.
