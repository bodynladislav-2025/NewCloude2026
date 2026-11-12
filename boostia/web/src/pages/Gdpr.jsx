import Seo from '../components/Seo'
import { Placeholder } from '../components/ui'
import Legal from './Legal'

export default function Gdpr() {
  return (
    <Legal title="Zásady zpracování osobních údajů">
      <Seo title="Ochrana osobních údajů · Boostia" path="/ochrana-osobnich-udaju" description="Jak Boostia zpracovává osobní údaje." />
      <h2>1. Správce</h2>
      <p>Správcem osobních údajů je Boostia s.r.o.<Placeholder>IČO, sídlo, e-mail pro ochranu údajů</Placeholder>.</p>
      <h2>2. Jaké údaje zpracováváme</h2>
      <ul><li>Jméno, e-mail, telefon, firma a pozice.</li><li>Odpovědi z formulářů a z kalkulačky.</li><li>Záznam o naší komunikaci.</li><li>Údaje o návštěvě webu (cookies), pokud k tomu dáte souhlas.</li></ul>
      <h2>3. Proč a na jakém základě</h2>
      <ul>
        <li>Příprava a vedení auditu a nabídky: kroky před uzavřením smlouvy.</li>
        <li>Plnění smlouvy.</li>
        <li>Zasílání obsahu, o který jste požádali: souhlas, který můžete kdykoli odvolat.</li>
        <li>Obchodní oslovení firemních kontaktů: oprávněný zájem. Můžete vznést námitku a další zprávy vám nepošleme.</li>
        <li>Měření návštěvnosti a reklamy: souhlas.</li>
      </ul>
      <h2>4. Jak dlouho údaje uchováváme</h2>
      <ul><li>Poptávky: 3 roky od posledního kontaktu.</li><li>Smluvní dokumentace: 10 let.</li><li>Newsletter: do odhlášení.</li></ul>
      <h2>5. Komu údaje předáváme</h2>
      <p>Využíváme zpracovatele: LeadConnector (CRM, e-maily, SMS), poskytovatele hostingu webu, Google (Analytics, Meet), Meta, LinkedIn, Microsoft (Clarity) a účetní kancelář. Část zpracovatelů sídlí mimo EU. Předání probíhá na základě standardních smluvních doložek nebo rámce EU–US Data Privacy Framework.</p>
      <h2>6. Vaše práva</h2>
      <p>Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost, právo vznést námitku a právo odvolat souhlas. Stížnost můžete podat u Úřadu pro ochranu osobních údajů (uoou.gov.cz).</p>
      <h2>7. Cookies</h2>
      <p>Nezbytné cookies používáme vždy. Analytické a marketingové jen s vaším souhlasem, který můžete kdykoli změnit odkazem „Nastavení cookies“ v patičce.</p>
      <h2>8. Data klientů při školení a implementaci</h2>
      <p>S daty z vašeho CRM a nabídek pracujeme jen ve vašich účtech a nástrojích. Neukládáme je u sebe. Na požádání uzavřeme zpracovatelskou smlouvu a dohodu o mlčenlivosti.</p>
    </Legal>
  )
}
