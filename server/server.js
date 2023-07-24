

const PORT = process.env.PORT ?? 8001
const express = require('express')
const {v4: uuidv4} = require('uuid')
const cors = require('cors')
const app = express()
const pool = require("./db")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const scrapeEbay = require('./ebay.js')
const scrapeEtsy = require('./etsy.js')
const scrapeFB = require('./loginFB')
app.use(cors())
app.use(express.json())

app.get("/", (req, res)=> {
    res.send("hello")
})

app.get('/search', async (req, res)=> {
    const keywords = req.query.query
    const userEmail = req.query.userEmail
    const timeout = 5000

    try {
        const settings = await pool.query("SELECT * FROM settings WHERE user_email = $1", [userEmail])
        const info = settings.rows[0]

        const showNumber = info.show_num
        const search = []
        if (info.ebay) {
            const ebay_setting = {
                order: info.ebay_order,
                sold: info.ebay_sold,
                priceMin: info.ebay_min,
                priceMax: info.ebay_max
            }
            search.push(scrapeEbay(keywords, ebay_setting, showNumber))
        }
        if (info.facebook) {
            const facebook_setting = {
                order: info.facebook_order,
                sold: info.facebook_sold,
                priceMin: info.facebook_min,
                priceMax: info.facebook_max
            }
            search.push(scrapeFB(keywords, facebook_setting, showNumber))
        }
        if (info.etsy) {
            const etsy_setting = {
                order: info.etsy_order,
                priceMin: info.etsy_min,
                priceMax: info.etsy_max
            }
            search.push(scrapeEtsy(keywords, etsy_setting, showNumber))
        }

        const responses = await Promise.all(search);

        //   const data = await Promise.all(responses.map(response => response.json()));
        
        res.json(responses.flat())
    } catch(err) {
        console.error(err)
    }
})



//get all items
app.get('/items/:userEmail', async (req, res)=> {
    const userEmail = req.params.userEmail
    
    try {
        const items = await pool.query("SELECT * FROM saved_items WHERE user_email = $1", [userEmail])
        res.json(items.rows)
    } catch(err) {
        console.error(err)
    }
})

//get all settings
app.get('/settings/:userEmail', async (req, res)=> {
    const userEmail = req.params.userEmail
    
    try {
        const items = await pool.query("SELECT * FROM settings WHERE user_email = $1", [userEmail])
        res.json(items.rows[0])
    } catch(err) {
        console.error(err)
    }
})

// add a new item to my items
app.post('/myItems', async (req, res) => {
    const {user_email, product_name, price, product_url, website, image, date} =req.body
    const id = uuidv4()
    try {
        const newItem = await pool.query(`INSERT INTO saved_items (id, user_email, product_name, price, product_url, website, image, date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, user_email, product_name, price, product_url, website, image, date])
        res.json(newItem)
    } catch(err) {
        console.error(err)
    }
})

//edit a new todo
app.put('/properties/:userEmail', async (req, res) => {
    const user_email = req.params.userEmail // const {id} = req.params.id

    const {checked, properties, number} =req.body

    try {
        const editSetting = await pool.query(`UPDATE settings SET
        ebay=$1, ebay_order=$2, ebay_min=$3, ebay_max=$4, 
        facebook=$5, facebook_order=$6, facebook_min=$7, facebook_max=$8,
        etsy=$9, etsy_order=$10, etsy_min=$11, etsy_max=$12, show_num= $13, ebay_sold = $14, facebook_sold = $15 WHERE user_email = $16`,
        [checked.ebay, properties.ebay.order, properties.ebay.priceMin, properties.ebay.priceMax,
            checked.facebook, properties.facebook.order, properties.facebook.priceMin, properties.facebook.priceMax, 
            checked.etsy, properties.etsy.order, properties.etsy.priceMin, properties.etsy.priceMax, number, properties.ebay.sold, 
            properties.facebook.sold, user_email])
        res.json(editSetting)
    } catch(err) {
        console.error(err)
    }
})

//delete a new todo
app.delete('/items/:id', async (req, res) => {
    const id = req.params.id // const {id} = req.params.id
    const {user_email, title, progress, date} =req.body
    try {
        const deleteTodo = await pool.query(`DELETE FROM saved_items WHERE id = $1`,
        [id])
        res.json(deleteTodo)
    } catch(err) {
        console.error(err)
    }
})

// signup
app.post('/signup', async(req, res)=> {
    const {email, password} = req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const signUp = await pool.query('INSERT INTO users (email, hashed_password) VALUES ($1, $2)',
        [email, hashedPassword])
        const editSetting = await pool.query(`INSERT INTO settings (user_email, ebay, ebay_order, ebay_min, ebay_max, 
            facebook, facebook_order, facebook_min, facebook_max,
            etsy, etsy_order, etsy_min, etsy_max, show_num, ebay_sold, facebook_sold) VALUES ($1, $2, $3, $4, 
        $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [email, true, 'default', 0, 10000, true, 'default', 0, 10000, true, 'default', 0, 10000, 5, false, false])
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})

        res.json({email, token})
    } catch(err) {
        console.error(err)
        if (err) {
            res.json({detail: err.detail})
        }
    }
})


// login
app.post('/login', async(req, res)=> {
    const {email, password} = req.body
    try {
        const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
        
        if (!users.rows.length) return res.json({detail: 'User does not exist!'})
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({email}, 'secret', {expiresIn: '1hr'})
        
        if (success) {
            res.json({'email': users.rows[0].email, token})
        } else {
            res.json({detail: "Login failed"})
        }
    
    } catch(err) {
        console.error(err)
    }
})




app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`))