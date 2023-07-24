require('dotenv').config()
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');


module.exports= async function scrapeFB(keywords, setting, showNumber) {
  const {order, priceMin, priceMax, sold} = setting
  let order_query = ""
  let priceMin_query = ""
  let priceMax_query = ""
  let sold_query = ""
  if (order === "last_7_days") {
      order_query = `&daysSinceListed=7`
  }
  if (order === "last_30_days") {
      order_query = "&daysSinceListed=30"
  }
  if (priceMin !== 0) {
      priceMin_query = `&minPrice=${priceMin}`
  }
  if (priceMax !== 10000) {
      priceMax_query = `&maxPrice=${priceMax}`
  }
  if (sold) {
    sold_query = "&availability=out%20of%20stock"
  }
  const browser = await puppeteer.launch({args: ['--disable-notifications', '--disable-geolocation']});
  const page = await browser.newPage();

  await page.goto('https://www.facebook.com'); 

  await page.type('input[id="email"]', process.env.FB_EMAIL); // Replace 'your_email' with your actual email address
  await page.type('input[id="pass"]', process.env.FB_PASSWORD); // Replace 'your_password' with your actual password
  await page.click('button[name="login"]'); // Click the login button

  await page.waitForNavigation();

  // Navigate to Facebook Marketplace
  await page.goto('https://www.facebook.com/marketplace');

  const inputSelector = 'input[type="search"]'; // CSS selector for the input element
  let search_query = keywords.replace(' ', '+')
  const inputElements = await page.$$(inputSelector);
  if (inputElements) {
    
    await inputElements[2].type(search_query);
    console.log('Input element found');
    // Perform actions on the input element
  } else {
    console.log('Input element not found');
  }
  
  await page.keyboard.press('Enter');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  const url = page.url();
  const filter_url = url + order_query + priceMin_query + priceMax_query + sold_query
  await page.goto(filter_url);
  await new Promise(resolve => setTimeout(resolve, 500));
  const htmlContent = await page.content();
  const $ = cheerio.load(htmlContent)

  const results = []
  

  const products =$('div[aria-label="Collection of Marketplace items"]')

  const products_deep = products.find('div>div>div>div>div>div')
  
  const product = products_deep.find('a[href][role="link"]')
  product.each((index, element)=> {
    const el = $(element)
    const product_url = `https://facebook.com${el.attr("href")}`
    const image = el.find('img').attr("src")
    const infos = el.find('div>div')
    const temp = []
    infos.each((index, info)=> {
      const i = $(info)
      temp.push(i.text())
    })
    const information = temp.filter(item => item !== '')
    console.log(information)
    const price = information[1]
    const product_name = information[2]
    const product_location = information[3]
    const website = "Facebook"
    results.push({product_name, image, price, website, product_url})
  })
  


  
  // Rest of your code
  await browser.close();
  const num = Math.min(results.length, showNumber)
  return results.slice(0,num)
}


