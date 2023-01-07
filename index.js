const express = require("express")
require("dotenv").config();
const app = express()
const scrap = require('./scrap')
const Product = require('./product.model')
const mongoose = require("mongoose");
const { DB_CONNECT, PORT } = process.env;


app.use(express.json())

//DATABASE CONNECTIONS STARTS
mongoose.connect(DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disonnected to MongoDB"));
db.on("reconnected", () => console.log("Reconnected to MongoDB"));
db.on("error", (err) => console.log(err));

app.get('/api/test', async (req, res) => {
    try {
        res.status(200).send("API IS RUNNING......")
    } catch (error) {
        console.log("errror", error)
        return res.status(400).send(error.message)
    }

});

//scrap endpoint
app.post('/api/scrap', async (req, res) => {
    try {
        console.log("req.body",req.body)
        let productDetails = await scrap(req.body.scrapUrl)
        console.log("product",productDetails)
        let product=await new Product(productDetails).save()
        res.status(200).send(product)
    } catch (error) {
        console.log("errror", error)
        return res.status(400).send(error.message)
    }
});

//app starts
app.listen(PORT || 3000, () => console.log(`Server started in ${PORT}`))