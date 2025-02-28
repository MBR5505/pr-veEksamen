import mongoose from "mongoose";
const { Schema, model } = mongoose;

const beiteområdeSchema = new Schema({
  navn: {
    type: String,
    required: true,
  },
  fylke: {
    type: String,
    required: true,
  },
  flokker_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flokker",
      required: false,
    },
  ],
});

const Beiteområde = model("Beiteområde", beiteområdeSchema);

export default Beiteområde;