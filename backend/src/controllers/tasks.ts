import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import TaskModel from "src/models/task";
import validationErrorParser from "src/util/validationErrorParser";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find().sort({ dateCreated: -1 });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

