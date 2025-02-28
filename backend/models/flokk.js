import mongoose from "mongoose";
const { Schema, model } = mongoose;

const flokkSchema = new Schema({
  navn: {
    type: String,
    required: true,
  },
  serienummer: {
    type: String,
    required: true,
  },
  buemerke_navn: {
    type: String,
    required: true,
  },
  buemerke_bilde: {
    type: String,
    required: true,
  },
  eier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reinsdyr: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rein",
      required: false,
    },
  ],
  beiteområde_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beiteområde",
    required: false,
  }
});

const Flokk = model("Flokk", flokkSchema);

export default Flokk;