import Flokk from "../models/flokk.js";
import { customAlphabet } from "nanoid";

const flokkController = {
  getAllFlokk: async (req, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).send({ success: false, message: "Unauthorized" });
      }
      
      // Extract query parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const sort = req.query.sort || '-createdAt'; // Default sort by newest
      const skip = (page - 1) * limit;
      
      // Build query based on filters (can be expanded)
      const query = { eier_id: req.user.id };
      if (req.query.status) query.status = req.query.status;
      
      // Count total matches for pagination info
      const total = await Flokk.countDocuments(query);
      
      // Fetch data with selective population
      const flokker = await Flokk.find(query)
        .populate('eier_id', 'name email profileImage') // Only populate needed fields
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance
      
      // Always return 200 with pagination metadata
      res.status(200).send({
        success: true,
        message: flokker.length ? "Flokker retrieved" : "No flokker found",
        data: {
          flokker,
          pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error(`Error fetching flokker: ${error.message}`);
      res.status(500).send({ 
        success: false, 
        message: "Failed to retrieve flokker",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },
  
  createFlokk: async (req, res) => {
    try {
      const { navn, buemerke_navn, beiteområde_id } = req.body;
      const serienummer = customAlphabet("1234567890", 3)();
      const buemerke_bilde = req.file ? req.file.path : "";

      const flokk = new Flokk({
        navn,
        serienummer,
        buemerke_navn,
        buemerke_bilde,
        eier_id: req.user.id,
        beiteområde_id,
      });

      await flokk.save();
      
      // Update user's flokker array
      await req.app.locals.db.collection('users').updateOne(
        { _id: req.user.id },
        { $push: { flokker: flokk._id } }
      );
      
      res.status(201).send({ msg: "Flokk created", flokk });
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error", error: error.message });
    }
  },

  getFlokk: async (req, res) => {
    try {
      const { id } = req.params;
      const flokk = await Flokk.findById(id).populate("eier_id");
      res.status(200).send({ msg: "Flokk retrieved", flokk });
      // Verify ownership
      // if (flokk && flokk.eier_id._id.toString() === req.user.id.toString()) {
      //   res.status(200).send({ msg: "Flokk retrieved", flokk });
      // } else {
      //   res.status(404).send({ msg: "Flokk not found" });
      // }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error" });
    }
  },

  editFlokk: async (req, res) => {
    try {
      const { id } = req.params;
      const updateContent = req.body;
      
      // Verify ownership before update
      const existingFlokk = await Flokk.findById(id);
      if (!existingFlokk || existingFlokk.eier_id.toString() !== req.user.id.toString()) {
        return res.status(403).send({ msg: "Not authorized to edit this flokk" });
      }
      
      if (req.file) {
        updateContent.buemerke_bilde = req.file.path;
      }
      
      const flokk = await Flokk.findByIdAndUpdate(id, updateContent, { new: true });
      if (flokk) {
        res.status(200).send({ msg: "Flokk updated", flokk });
      } else {
        res.status(404).send({ msg: "Flokk not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error" });
    }
  },

  deleteFlokk: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Verify ownership before delete
      const existingFlokk = await Flokk.findById(id);
      if (!existingFlokk || existingFlokk.eier_id.toString() !== req.user.id.toString()) {
        return res.status(403).send({ msg: "Not authorized to delete this flokk" });
      }
      
      const flokk = await Flokk.findByIdAndDelete(id);
      if (flokk) {
        // Remove reference from user's flokker array
        await req.app.locals.db.collection('users').updateOne(
          { _id: req.user.id },
          { $pull: { flokker: flokk._id } }
        );
        
        res.status(200).send({ msg: "Flokk deleted", flokk });
      } else {
        res.status(404).send({ msg: "Flokk not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ msg: "Server error" });
    }
  },
};

export default flokkController;