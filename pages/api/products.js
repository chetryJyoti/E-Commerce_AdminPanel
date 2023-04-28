import { mongooseConnection } from "@/lib/mongoose";
import { Product } from "@/models/Product";

// api/products 
export default async function handle(req, res) {
    // res.json(req.method)
    const {method}=req;
    await mongooseConnection()
    if(method=="POST"){
        // create product
        const {title,description,price}=req.body; 
        const newProduct =await Product.create({
            title,description,price
        })
        res.json(newProduct)
    }
    if(method=="GET"){
        //get all  products
        const products = await Product.find({});
        res.json(products);
    }
}
