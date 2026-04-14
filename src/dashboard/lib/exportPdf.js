import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

/**
 * Export the currently visible dashboard view to PDF (A4 landscape)
 * @param {string} elementId - ID of the element to capture
 * @param {string} [filename]
 */
export async function exportDashboardToPDF(elementId = 'dashboard-content', filename) {
  const today = new Date().toISOString().split('T')[0];
  const pdfFilename = filename || `dashboard-kvality-hovoru-${today}.pdf`;

  const element = document.getElementById(elementId);
  if (!element) {
    alert('Obsah dashboardu nebyl nalezen pro export.');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgAspect = canvas.width / canvas.height;
    const pdfAspect = pdfWidth / pdfHeight;

    let imgW = pdfWidth;
    let imgH = pdfWidth / imgAspect;

    if (imgH > pdfHeight) {
      // Multi-page
      const totalPages = Math.ceil(imgH / pdfHeight);
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();
        const srcY = page * (canvas.height / totalPages);
        const srcH = canvas.height / totalPages;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = srcH;
        const ctx = pageCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, srcY, canvas.width, srcH, 0, 0, canvas.width, srcH);
        const pageImg = pageCanvas.toDataURL('image/jpeg', 0.92);
        pdf.addImage(pageImg, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
    } else {
      pdf.addImage(imgData, 'JPEG', 0, 0, imgW, imgH);
    }

    pdf.save(pdfFilename);
  } catch (err) {
    console.error('PDF export error:', err);
    alert('Export PDF selhal: ' + err.message);
  }
}

/**
 * Generate a sample hodnoceni.xlsx template with 3 example rows
 */
export function downloadHodnoceniTemplate() {
  const headers = [
      'na_cislo', 'datum', 'obchodnik', 'zakaznik', 'typ_hovoru', 'segment',
      'essence', 'profesionalita', 'obchodni_dovednosti', 'zjistovani_potreb', 'closing',
      'nalada_zakaznika_start', 'nalada_zakaznika_end', 'riziko', 'hodnota_dealu',
      'upsell_mozny', 'upsell_realizovan', 'crosssell_mozny', 'crosssell_realizovan',
      'terminovany_prislib', 'soft_close', 'dotaz_konkurence', 'dotaz_rozhodovatel',
      'silne_stranky', 'oblasti_zlepseni', 'pochvala', 'doporuceni', 'poznamka_managera',
    ];

    const rows = [
      ['NA2603001', '10.01.2026', 'Hofmann', 'Alfa s.r.o.', 'Akvizice', 'SME',
        'Hovor ohledně nové zakázky na tisk katalogů. Zákazník projevil zájem.',
        4.2, 3.8, 4.0, 3.5, 3, 4, 'none', 45000,
        true, false, false, false, true, true, false, false,
        'Personalizace|Aktivní naslouchání', 'Closing|Práce s námitkami',
        'Výborný přístup k zákazníkovi.', 'Více se ptát na rozhodovací proces.',
        ''],
      ['NA2603002', '12.01.2026', 'Tarasyuk', 'Beta Group a.s.', 'Péče', 'Enterprise',
        'Follow-up na předchozí objednávku. Zákazník spokojen.',
        4.5, 4.2, 4.3, 4.0, 4, 5, 'none', 120000,
        true, true, false, false, true, false, true, true,
        'Proaktivní přístup|Znalost produktu', 'Upsell příležitosti',
        'Skvělá péče o zákazníka.', 'Nabídnout crosssell produkty.',
        ''],
      ['NA2603003', '15.01.2026', 'Smutná', 'Gamma Tech s.r.o.', 'Reklamace', 'Mid-market',
        'Zákazník reklamoval kvalitu tisku. Situace vyřešena, zákazník uklidněn.',
        3.5, 3.2, 3.8, 2.8, 2, 4, 'zákazník', 65000,
        false, false, false, false, false, false, false, false,
        'Empatie|Řešení problémů', 'Closing|Asertivita',
        'Dobré zvládnutí reklamace.', 'Pracovat na closing techniku.',
        'Sledovat spokojenost zákazníka'],
    ];

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hodnocení');
    XLSX.writeFile(wb, 'hodnoceni_vzor.xlsx');
}
