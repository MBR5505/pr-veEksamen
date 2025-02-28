import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import reinRoutes from "./routes/rein.routes.js";
import flokkRoutes from "./routes/flokk.routes.js";

const app = express();

// Konfigurer CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Koble til MongoDB
mongoose.connect(process.env.DB_URL);

// Serve opplastede bilder
app.use("/uploads", express.static("uploads"));

// Bruk ruter
app.use("/api/auth", authRoutes);
app.use("/api/rein", reinRoutes);
app.use("/api/flokk", flokkRoutes);

app.get("/", (req, res) => {
  res.send("Serveren kjører!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server kjører på port ${process.env.PORT}`);
});
