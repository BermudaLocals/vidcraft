const puppeteer = require("puppeteer");

class ContentScraper {
  constructor() {
    this.sources = [
      { name: "reddit",  url: "https://www.reddit.com/r/all/top/?t=day", selector: ".Post" },
      { name: "news",    url: "https://news.google.com", selector: "article" }
    ];
  }

  async scrapeAll() {
    const results = [];
    for (const source of this.sources) {
      try { results.push(...(await this.scrapeSource(source))); }
      catch (e) { console.error(`Scrape error ${source.name}:`, e.message); }
    }
    return results;
  }

  async scrapeSource(source) {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
    const page    = await browser.newPage();
    await page.goto(source.url, { waitUntil: "networkidle2", timeout: 30000 });
    const content = await page.evaluate((sel) => {
      return Array.from(document.querySelectorAll(sel)).slice(0,10).map(el => ({
        title: el.querySelector("h1,h2,h3,.title")?.textContent?.trim() || "",
        text:  el.textContent?.substring(0,300).trim() || "",
        url:   el.querySelector("a")?.href || "",
        image: el.querySelector("img")?.src  || "",
        engagement: { likes: 0, shares: 0, comments: 0 }
      })).filter(i => i.title);
    }, source.selector);
    await browser.close();
    return content;
  }

  async scrapeCustomUrl(url) {
    const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--disable-setuid-sandbox"] });
    const page    = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
    const content = await page.evaluate(() => ({
      title:       document.querySelector("title")?.textContent || "",
      description: document.querySelector('meta[name="description"]')?.content || "",
      text:        document.body.textContent.substring(0,1000).trim(),
      images:      Array.from(document.querySelectorAll("img")).map(i => i.src).slice(0,5)
    }));
    await browser.close();
    return content;
  }
}

module.exports = ContentScraper;
