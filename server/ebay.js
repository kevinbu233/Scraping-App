
const axios = require('axios')
const cheerio = require('cheerio')


// const amazon_url = `https://www.amazon.com/s?k=${search_query}&page=1`

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    'Accept-Language': 'en-US, en;q=0.5'
}


module.exports = async function scrape_ebay(keywords, setting, showNumber) {
    const search_query = keywords.replace(' ', '+')
    console.log(setting)
    const {order, priceMin, priceMax, sold} = setting
    let order_query = "&_sop=12"
    let priceMin_query = ""
    let priceMax_query = ""
    let sold_query = ""
    if (order === "ending_soonest") {
        order_query = "&_sop=1"
    }
    if (order === "newly_listed") {
        order_query = "&_sop=10"
    }
    if (priceMin !== 0) {
        priceMin_query = `&_udlo=${priceMin}`
    }
    if (priceMax !== 10000) {
        priceMax_query = `&_udhi=${priceMax}`
    }
    if (sold) {
        sold_query = "&rt=nc&LH_Sold=1&LH_Complete=1"
    }
    const ebay_url = `https://www.ebay.ca/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=${search_query}&_sacat=10${order_query}${priceMin_query}${priceMax_query}${sold_query}`
    const results = []
    const response = await axios(ebay_url, {headers})
    const html = response.data
    const $ = cheerio.load(html)

    const search_area =$('ul.srp-results').first()
    const products = search_area.find('li.s-item')
    
    try {
        products.each((index, product)=> {
        const product_name = $(product).find('div.s-item__title').text()
        const image = $(product).find('img').attr("src")
        const price = $(product).find('span.s-item__price').text()
        const product_url = $(product).find("a.s-item__link").attr('href')
        const website = "Ebay"
        results.push({product_name, image, price, website, product_url})
        })
        
    } catch(err) {
        console.error(err)
    }

    const num = Math.min(results.length, showNumber)
  return results.slice(0,num)
}


    