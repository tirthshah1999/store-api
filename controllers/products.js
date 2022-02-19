const Product = require("../models/product");

const getAllProductsStatic = async(req, res) => {
    // const products = await Product.find();
    // const products = await Product.find().sort("name -price")  // - means desc else asc
    // const products = await Product.find().select("name")  // means i want to see only name

    // means i want only 5 products and skip starting (1) so starting will be from 2nd product
    const products = await Product.find().sort("name").select("name price").limit(5).skip(1)  
    res.status(200).json({products});
}

const getAllProducts = async(req, res) => {
    // If user try to do property i.e. not exist like featured=true&page=4 Here page is not there so it will return an empty []. So to avoid this (Note: If you are using mongoose v6 you don't have to do this) If featured is there show filtered one else show them everything.. 
    const {featured, company, name, sort, fields, numericFilters} = req.query;
    const queryObj = {};

    if(featured){
        queryObj.featured = featured === "true" ? true : false;
    }

    if(company){
        queryObj.company = company;
    }

    if(name){
        // here if user types some value of that name it should be match and option: i means it is insenstive case (upper or lower just accept it)
        queryObj.name = {$regex: name, $options: 'i'}
    }

    // filters
    if(numericFilters){
        // convert it user friendly to mongoose
        const operatorMap = {
            '>': '$gt',
            '>=': '$gte',
            '=': '$eq',
            '<': '$lt',
            '<=': '$lte',
        };

        const regEx = /\b(<|>|>=|=|<|<=)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        
        // Passing this: {{URL}}/products?sort=name&fields=name,price&numericFilters=price<40,rating<5 
        // Getting this: price-$lt-40,rating-$lt-5
        console.log(filters);
        
        const options = ['price', 'rating'];   // as they are only numeric
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split("-");
            if(options.includes(field)){
                queryObj[field] = {[operator]: Number(value)};
            }
        })
    }

    // sort
    let result = Product.find(queryObj);
    if(sort){
        console.log(sort);
        const sortList = sort.split(",").join(" ");
        result = result.sort(sortList);
    }else{
        result = result.sort('createdAt');
    }

    // select
    if(fields){
        const fieldsList = fields.split(",").join(" ");
        result = result.select(fieldsList);
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({products, nbHits: products.length});
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}