import { Tag } from "../models/Tag.js";

// CREATE TAG
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    const tag = await Tag.create({ name });

    res.json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL TAGS
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json({ success: true, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE TAG
export const deleteTag = async (req, res) => {
  try {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Tag deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};