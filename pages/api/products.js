import { mongooseConnection } from "@/lib/mongoose";
import { Product } from "@/models/Product";

// api/products
export default async function handle(req, res) {
  // res.json(req.method)
  const { method } = req;
  await mongooseConnection();
  if (method === "GET") {
    //get product by id
    if (req.query?.id) {
      res.json(await Product.findById({ _id: req.query.id }));
    } else {
      //get all  products
      const products = await Product.find();
      res.json(products);
    }
  }
  if (method === "POST") {
    // create product
    const { title, description, price, images, category, properties } =
      req.body;
    const newProduct = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(newProduct);
  }
  if (method === "PUT") {
    const { title, description, price, _id, images, category, properties } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
