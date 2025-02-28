import express from "express";
import flokkController from "../controllers/flokk.controller.js";
import multer from "multer";
import verifyJWT from "../middleware/verifyToken.js";

const router = express.Router();

// Konfigurer multer for filopplastning
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Lagre bilder i "uploads/"-mappen
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unikt filnavn
  },
});

const upload = multer({ storage });

// Ruter for CRUD-operasjoner
router.post("/", verifyJWT, upload.single("buemerke_bilde"), flokkController.createFlokk);
router.get("/", verifyJWT, flokkController.getAllFlokk);
router.get("/:id", verifyJWT, flokkController.getFlokk);
router.put("/:id", verifyJWT, flokkController.editFlokk);
router.delete("/:id", verifyJWT, flokkController.deleteFlokk);

export default router;
