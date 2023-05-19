import { mongooseConnection } from "@/lib/mongoose";
import { Category } from "@/models/Category";
export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnection();
  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    res.json(categories);
  }
  if (method === "POST") {
    //create category
    const { name, parentCategory, properties } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties: properties,
    });
    res.json({ CategoryDoc: categoryDoc });
  }
  if (method === "PUT") {
    //update category
    const { name, parentCategory, properties, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    res.json({ CategoryDoc: categoryDoc });
  }
  if (method == "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
