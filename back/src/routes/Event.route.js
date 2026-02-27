import express from 'express';
import EventController from "../controllers/EventController.js";

const router = express.Router();

router.get("/", EventController.getAll);

router.get("/:id", EventController.getOne);


export default router;
