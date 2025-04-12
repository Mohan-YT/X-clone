import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { followUnFollowUser, getProfile, getSuggestedusers, updateUser } from "../controllers/userController.js";

const router = express.Router()

router.get("/profile/:username",protectRoute, getProfile)
router.post("/follow/:id",protectRoute, followUnFollowUser)
router.get("/suggested",protectRoute, getSuggestedusers)
router.post("/update",protectRoute, updateUser)

export default router

