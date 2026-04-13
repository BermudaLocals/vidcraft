const router  = require("express").Router();
const auth    = require("../middleware/auth");
const Scraper = require("../services/scraper");
const scraper = new Scraper();

router.get("/trending", auth, async (req, res) => {
  try {
    const content = await scraper.scrapeAll();
    content.sort((a, b) => {
      const ea = (a.engagement?.likes||0)+(a.engagement?.shares||0)+(a.engagement?.comments||0);
      const eb = (b.engagement?.likes||0)+(b.engagement?.shares||0)+(b.engagement?.comments||0);
      return eb - ea;
    });
    res.json(content.slice(0, Number(req.query.limit) || 20));
  } catch { res.status(500).json({ message: "Server error" }); }
});

router.post("/scrape", auth, async (req, res) => {
  try {
    if (!req.body.url) return res.status(400).json({ message: "URL required" });
    res.json(await scraper.scrapeCustomUrl(req.body.url));
  } catch { res.status(500).json({ message: "Server error" }); }
});

module.exports = router;
