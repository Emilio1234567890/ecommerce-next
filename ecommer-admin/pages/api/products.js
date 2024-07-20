import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Products";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await isAdminRequest(req, res);
  await mongooseConnect();
  if (method === "POST") {
    const { title, description, price, images, category, propreties } =
      req.body;
    const product = await Product.create({
      title,
      description,
      price,
      images,
      category,
      propreties,
    });
    res.json(product);
  }

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "PUT") {
    const { title, description, price, images, _id, category, propreties } =
      req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, propreties }
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
