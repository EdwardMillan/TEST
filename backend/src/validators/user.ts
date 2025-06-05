import { body } from "express-validator";

export const createUser = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("profilePictureURL")
    .optional()
    .isURL()
    .withMessage("profilePictureURL must be a valid URL."),
];
