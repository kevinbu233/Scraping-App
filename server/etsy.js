const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  "Accept-Language": "en-US, en;q=0.5",
};

module.exports = async function scrapeEtsy(keywords, setting, showNumber) {
  let search_query = keywords.replace(" ", "+");
  const {order, priceMin, priceMax} = setting
  let order_query = ""
  let priceMin_query = ""
  let priceMax_query = ""
  if (order === "most_recent") {
      order_query = `&order=date_desc`
  }
  if (priceMin !== 0) {
      priceMin_query = `&min=${priceMin}`
  }
  if (priceMax !== 10000) {
      priceMax_query = `&max=${priceMax}`
  }
  const etsy_url = `https://www.etsy.com/ca/search?q=${search_query}${priceMin_query}${priceMax_query}${order_query}&ref=search_bar`;
  const response = await axios(etsy_url, { headers });

  const html = response.data;
  const $ = cheerio.load(html);

  const results = [];

  const search_area = $("div[data-search-results]");
  const products = search_area.find(
    'div[data-listing-id][data-page-type="search"]'
  );


  try {
    products.each((index, product)=> {
        const product_name = $(product)
        .find("div.v2-listing-card__info>h3")
        .text()
        .trim();
        const image = $(product).find("img").attr("src");
        const price = $(product).find("div.n-listing-card__price").text().trim();
        const product_url = $(product).find("a[href]").attr("href");
        const website = "Etsy"
        results.push({ product_name, image, price, website, product_url });
    })
  } catch (err) {
    console.error(err);
  }

  const num = Math.min(results.length, showNumber)
  console.log(showNumber, results.length, num)
  return results.slice(0,num)
};
