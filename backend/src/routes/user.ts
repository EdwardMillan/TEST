import express from "express";
import { createUser } from "../controllers/user";
import { createUser as validateCreateUser } from "../validators/user";
import { getUser } from "../controllers/user";

const router = express.Router();

router.post("/", validateCreateUser, createUser);
router.get("/:id", getUser);

export default router;
