import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  uuid: {
    type: String,
    required: false,
  },
  kontaktSpråk: {
    type: String,
    required: true,
  },
  flokker: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flokker",
      required: false,
    },
  ],
});

userSchema.post("save", function () {});

const User = model("User", userSchema);

export default User;