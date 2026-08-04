const puppeteer = require('puppeteer');
const TurndownService = require('turndown');
const fs = require('fs');

(async () => {
    try {
        console.log('Launching Puppeteer...');
        // Let's try to just launch the internal chromium
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        console.log('Navigating to inspirattoodonto.com...');
        await page.goto('https://inspirattoodonto.com/', { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Remove unwanted elements
        await page.evaluate(() => {
            const elements = document.querySelectorAll('script, style, noscript, svg, nav, footer, iframe');
            elements.forEach(el => el.remove());
        });

        // Get the body HTML
        const bodyHTML = await page.evaluate(() => document.body.innerHTML);
        
        console.log('Converting to Markdown...');
        const turndownService = new TurndownService({ headingStyle: 'atx' });
        let markdown = turndownService.turndown(bodyHTML);
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        
        const finalContent = '# Copy: https://inspirattoodonto.com/\n\n' + markdown;
        fs.writeFileSync('/Users/sergin/Documents/Projetos Github/firecrawl-mcp-server/copys_lps/inspiratto_odonto.md', finalContent);
        console.log('Saved inspiratto_odonto.md');
        
        await browser.close();
    } catch (error) {
        console.error('Error fetching page with puppeteer', error);
        process.exit(1);
    }
})();
