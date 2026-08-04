const { JSDOM } = require('jsdom');
const TurndownService = require('turndown');
const fs = require('fs');

const urls = [
    { url: 'https://l.hollywoododonto.com.br/protese', name: 'hollywood_odonto_protese' },
    { url: 'https://l.hollywoododonto.com.br/', name: 'hollywood_odonto' },
    { url: 'https://l.fisioepelve.com/', name: 'fisio_e_pelve' },
    { url: 'https://l.ecofisiopilates.com/', name: 'ecofisio_pilates' },
    { url: 'https://l.clinicavivermulher.com.br/fisioterapia-pelvica', name: 'viver_mulher_fisio_pelvica' },
    { url: 'https://www.neurodesenvolvimentodf.com.br/', name: 'neurodesenvolvimento_df' },
    { url: 'https://l.elloclinica.com.br/', name: 'ello_clinica' },
    { url: 'https://l.institutoortopediadf.com.br/especialista-em-coluna', name: 'instituto_ortopedia_coluna' },
    { url: 'https://www.examesbrasilia.com.br/focus', name: 'exames_brasilia_focus' },
    { url: 'https://l.clinicauros.com.br/fernandofroes', name: 'clinicauros_fernandofroes' },
    { url: 'https://l.inspirebrasilia.com.br/', name: 'inspire_brasilia' },
    { url: 'https://l.clinicauros.com.br/dr-marcos-paulo', name: 'clinicauros_marcos_paulo' }
];

const turndownService = new TurndownService({ headingStyle: 'atx' });

async function processUrls() {
    for (const item of urls) {
        try {
            console.log("Fetching", item.url);
            const response = await fetch(item.url);
            const html = await response.text();
            const dom = new JSDOM(html);
            
            // Remove scripts, styles and unwanted elements
            dom.window.document.querySelectorAll('script, style, noscript, svg, nav, footer').forEach(el => el.remove());
            
            let markdown = turndownService.turndown(dom.window.document.body);
            
            // Basic cleanup of consecutive blank lines
            markdown = markdown.replace(/\n{3,}/g, '\n\n');
            
            // Add a title to the doc
            const finalContent = `# Copy: ${item.url}\n\n${markdown}`;
            
            fs.writeFileSync(`./${item.name}.md`, finalContent);
            console.log("Saved", item.name);
        } catch (e) {
            console.error("Error on", item.url, e);
        }
    }
}
processUrls();
