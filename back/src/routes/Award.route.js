import express from "express";
import { getAllAwards } from "../controllers/AwardsController.js";  

const awardRouter = express.Router();

awardRouter.get("/", getAllAwards);

export default awardRouter;
