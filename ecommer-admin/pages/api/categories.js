import { Categorie } from "@/models/Categories";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await isAdminRequest(req, res);

  await mongooseConnect();
  if (method === "POST") {
    const { name, parentCategorie, propreties } = req.body;
    const categorie = await Categorie.create({
      name,
      parent: parentCategorie || undefined,
      propreties,
    });
    res.json(categorie);
  }

  if (method === "GET") {
    res.json(await Categorie.find().populate("parent"));
  }

  if (method === "PUT") {
    const { name, parentCategorie, propreties, _id } = req.body;
    const categorie = await Categorie.updateOne(
      { _id },
      { name, parent: parentCategorie, propreties }
    );
    res.json(categorie);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Categorie.deleteOne({ _id });
    res.json("ok");
  }
}
