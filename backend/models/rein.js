import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reinSchema = new Schema({
  navn: {
    type: String,
    required: true,
  },
  serienummer: {
    type: String,
    required: true,
  },
  fødselsdato: {
    type: Date,
    required: true,
  },
  flokk_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flokk",
    required: true,
  },
  eier_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tidligere_eiere: [{
    eier_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fra_dato: Date,
    til_dato: Date
  }],
  beiteområde_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Beiteområde",
    required: true,
  },
  under_transaksjon: {
    type: Boolean,
    default: false
  },
  transaksjon_info: {
    kjøper_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    dato_startet: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  bilde: {
    type: String,
    default: "/uploads/default-rein.jpg"
  }
});

const Rein = model("Rein", reinSchema);

export default Rein;