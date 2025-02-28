import express from "express";
import reinController from "../controllers/rein.controller.js";

const router = express.Router();

router.get("/", reinController.getAllRein);
router.post("/", reinController.createRein);

router.get("/:id", reinController.getRein);
router.put("/:id", reinController.editRein);
router.delete("/:id", reinController.deleteRein);

export default router;