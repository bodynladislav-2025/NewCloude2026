import Seo from '../components/Seo'
import { Placeholder } from '../components/ui'
import Legal from './Legal'

export default function Podminky() {
  return (
    <Legal title="Obchodní podmínky">
      <Seo title="Obchodní podmínky · Boostia" path="/obchodni-podminky" description="Obchodní podmínky společnosti Boostia s.r.o." />
      <h2>1. Smluvní strany a předmět</h2>
      <p>Tyto podmínky upravují vztah mezi společností Boostia s.r.o.<Placeholder>IČO, sídlo</Placeholder> a objednatelem při poskytování školení, analýz, implementace AI agentů a jejich provozu.</p>
      <h2>2. Objednávka a vznik smlouvy</h2>
      <p>Smlouva vzniká podpisem písemné smlouvy nebo potvrzením objednávky.</p>
      <h2>3. Cena a platby</h2>
      <ul><li>Program AI Obchod 50: 50 % před zahájením, 50 % po 4. týdnu.</li><li>AI Start den: předem.</li><li>AI agenti: po milnících 40 % při startu, 40 % po předvedení na datech objednatele, 20 % po akceptaci.</li><li>Splatnost faktur 14 dní. Ceny jsou uvedeny bez DPH.</li></ul>
      <h2>4. Termíny, přesun a storno</h2>
      <p>Termín školení lze bezplatně přesunout nejpozději 7 dní předem.<Placeholder>storno podmínky</Placeholder></p>
      <h2>5. Garance</h2>
      <p><strong>První den na naše riziko.</strong> Pokud objednatel po prvním školicím dni oznámí, že v programu nechce pokračovat, smlouva končí a Boostia neúčtuje nic.</p>
      <p><strong>Doučení zdarma.</strong> Pokud vedoucí týmu objednatele do 14 dnů po skončení programu písemně oznámí, že tým s účastí alespoň 80 % hodin a splněnými týdenními úkoly nepoužívá AI v denní práci, pokračuje Boostia ve školení zdarma v rozsahu až 20 hodin.</p>
      <p>Výsledek programu se měří podle Metodiky měření, která je přílohou smlouvy.</p>
      <h2>6. Odstoupení při zamítnutí dotace</h2>
      <p>Pokud Úřad práce žádost objednatele o příspěvek zamítne, může objednatel od smlouvy odstoupit bez sankce do 5 pracovních dnů od doručení rozhodnutí.</p>
      <h2>7. Autorská práva</h2>
      <p>Materiály a Playbook smí objednatel užívat interně bez omezení. Nesmí je dále prodávat ani poskytovat třetím stranám.</p>
      <h2>8. Mlčenlivost a ochrana dat</h2>
      <p>Boostia zachovává mlčenlivost o všech informacích objednatele. S daty objednatele pracuje jen v jeho účtech a nástrojích.</p>
      <h2>9. Odpovědnost</h2>
      <p>Výstupy AI vždy kontroluje člověk. Boostia neodpovídá za rozhodnutí učiněná na základě nezkontrolovaných výstupů.</p>
      <h2>10. Implementace AI agentů</h2>
      <p>Akceptační kritéria se sjednávají předem písemně. Dokumentace a přístupy k dodanému řešení náleží objednateli.</p>
      <h2>11. Závěrečná ustanovení</h2>
      <p>Vztahy se řídí právem České republiky.<Placeholder>datum účinnosti</Placeholder></p>
    </Legal>
  )
}
