// Instead of creating product one by one- We have all products in products.json file

require("dotenv").config();

const connectDB = require('./db/connect');
const Product = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      await Product.deleteMany()   // if some product is present (just for safe purpose - optional)
      await Product.create(jsonProducts)
      console.log('Success!!!!')
      process.exit(0)
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
}

start();