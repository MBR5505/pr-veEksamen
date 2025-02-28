import Rein from "../models/rein.js";
import Flokk from "../models/flokk.js";
import { customAlphabet } from "nanoid";
import multer from "multer";
import path from "path";

// Konfigurer multer for bildeopplasting
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage: storage });

const reinController = {
  getAllRein: async (req, res) => {
    try {
      const { flokkId } = req.query;
      let query = {};
      
      if (flokkId) {
        query.flokk_id = flokkId;
      }
      
      const reins = await Rein.find(query)
        .populate("flokk_id")
        .populate("eier_id")
        .populate("beiteområde_id");
        
      if (reins.length > 0) {
        res.status(200).send({ msg: "Reinsdyr hentet", reins });
      } else {
        res.status(404).send({ msg: "Ingen reinsdyr funnet" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },

  createRein: async (req, res) => {
    try {
      const { navn, fødselsdato, flokkId } = req.body;
      const serienummer = customAlphabet("1234567890", 6)();
      const bilde = req.file ? req.file.path : "/uploads/default-rein.jpg";

      // Finn flokken for å hente eier og beiteområde
      const flokk = await Flokk.findById(flokkId);
      if (!flokk) {
        return res.status(404).send({ msg: "Flokk ikke funnet" });
      }

      const rein = new Rein({
        navn,
        serienummer,
        fødselsdato,
        flokk_id: flokk._id,
        eier_id: flokk.eier_id,
        beiteområde_id: flokk.beiteområde_id,
        bilde
      });

      await rein.save();
      
      // Legg til reinsdyret i flokken
      flokk.reinsdyr = flokk.reinsdyr || [];
      flokk.reinsdyr.push(rein._id);
      await flokk.save();

      res.status(201).send({ msg: "Reinsdyr opprettet", rein });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil", error: error.message });
    }
  },

  getRein: async (req, res) => {
    try {
      const { id } = req.params;
      const rein = await Rein.findById(id)
        .populate("flokk_id")
        .populate("eier_id")
        .populate("beiteområde_id")
        .populate("tidligere_eiere.eier_id");
        
      if (rein) {
        res.status(200).send({ msg: "Reinsdyr hentet", rein });
      } else {
        res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },

  editRein: async (req, res) => {
    try {
      const { id } = req.params;
      const updateContent = req.body;
      
      if (req.file) {
        updateContent.bilde = req.file.path;
      }

      const rein = await Rein.findByIdAndUpdate(id, updateContent, { new: true });
      if (rein) {
        res.status(200).send({ msg: "Reinsdyr oppdatert", rein });
      } else {
        res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },

  deleteRein: async (req, res) => {
    try {
      const { id } = req.params;
      const rein = await Rein.findById(id);
      
      if (!rein) {
        return res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
      
      // Fjern reinsdyret fra flokken først
      const flokk = await Flokk.findById(rein.flokk_id);
      if (flokk) {
        flokk.reinsdyr = flokk.reinsdyr.filter(
          (reinId) => reinId.toString() !== id
        );
        await flokk.save();
      }
      
      await Rein.findByIdAndDelete(id);
      res.status(200).send({ msg: "Reinsdyr slettet" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },

  startTransaksjon: async (req, res) => {
    try {
      const { id } = req.params;
      const { kjøperId } = req.body;
      
      const rein = await Rein.findById(id);
      if (!rein) {
        return res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
      
      rein.under_transaksjon = true;
      rein.transaksjon_info = {
        kjøper_id: kjøperId,
        dato_startet: new Date(),
        status: 'pending'
      };
      
      await rein.save();
      res.status(200).send({ msg: "Transaksjon startet", rein });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },
  
  fullførTransaksjon: async (req, res) => {
    try {
      const { id } = req.params;
      const { nyFlokkId } = req.body;
      
      const rein = await Rein.findById(id);
      if (!rein) {
        return res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
      
      if (!rein.under_transaksjon) {
        return res.status(400).send({ msg: "Reinsdyret er ikke under transaksjon" });
      }
      
      // Legg til nåværende eier i tidligere_eiere
      rein.tidligere_eiere.push({
        eier_id: rein.eier_id,
        fra_dato: rein.createdAt, // Eller mer nøyaktig dato hvis tilgjengelig
        til_dato: new Date()
      });
      
      // Fjern fra gammel flokk
      const gammelFlokk = await Flokk.findById(rein.flokk_id);
      if (gammelFlokk) {
        gammelFlokk.reinsdyr = gammelFlokk.reinsdyr.filter(
          (reinId) => reinId.toString() !== id
        );
        await gammelFlokk.save();
      }
      
      // Legg til i ny flokk
      const nyFlokk = await Flokk.findById(nyFlokkId);
      if (!nyFlokk) {
        return res.status(404).send({ msg: "Ny flokk ikke funnet" });
      }
      
      nyFlokk.reinsdyr.push(rein._id);
      await nyFlokk.save();
      
      // Oppdater reinsdyr
      rein.eier_id = nyFlokk.eier_id;
      rein.flokk_id = nyFlokk._id;
      rein.beiteområde_id = nyFlokk.beiteområde_id;
      rein.under_transaksjon = false;
      rein.transaksjon_info.status = 'completed';
      
      await rein.save();
      res.status(200).send({ msg: "Transaksjon fullført", rein });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },
  
  avbrytTransaksjon: async (req, res) => {
    try {
      const { id } = req.params;
      
      const rein = await Rein.findById(id);
      if (!rein) {
        return res.status(404).send({ msg: "Reinsdyr ikke funnet" });
      }
      
      rein.under_transaksjon = false;
      rein.transaksjon_info.status = 'cancelled';
      
      await rein.save();
      res.status(200).send({ msg: "Transaksjon avbrutt", rein });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  },
  
  getReinsInTransaction: async (req, res) => {
    try {
      const reins = await Rein.find({ under_transaksjon: true })
        .populate("flokk_id")
        .populate("eier_id")
        .populate("beiteområde_id")
        .populate("transaksjon_info.kjøper_id");
      
      if (reins.length > 0) {
        res.status(200).send({ msg: "Reinsdyr under transaksjon hentet", reins });
      } else {
        res.status(404).send({ msg: "Ingen reinsdyr under transaksjon funnet" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Serverfeil" });
    }
  }
};

export default reinController;