import { mongooseConnection } from "@/lib/mongoose";
import { Category } from "@/models/Category";
export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnection();
  if (method === "GET") {
    const categories = await Category.find();
    res.json(categories);
  }
  if (method === "POST") {
    //create category
    const { name } = req.body;
    const categoryDoc = await Category.create({ name });
    res.json({ CategoryDoc: categoryDoc });
  }
}
