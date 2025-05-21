import { RequestHandler } from "express";
import User from "../models/user";
import mongoose from "mongoose";

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const { name, profilePictureURL } = req.body;
    const user = new User({ name, profilePictureURL });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};
