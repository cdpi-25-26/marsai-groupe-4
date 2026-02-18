import express from 'express';
import EventController from "../controllers/EventController.js";

const router = express.Router();

router.get("/", EventController.getAll);

router.get("/:id", EventController.getOne);

router.post("/", EventController.create);

router.put("/:id", EventController.update);

router.delete("/:id", EventController.remove);

export default router;