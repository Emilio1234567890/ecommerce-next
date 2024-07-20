import mongoose, { Schema, model, models } from "mongoose";

const CategorieSchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Categorie" },
  propreties: [{ type: Object }],
});

export const Categorie =
  models?.Categorie || model("Categorie", CategorieSchema);
