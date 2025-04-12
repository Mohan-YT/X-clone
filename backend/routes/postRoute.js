import express from 'express'
import protectRoute from '../middleware/protectRoute.js'
import { createCommant, createPost, deletePost, likeUnLikePost, getAllPosts, getLikedPosts, getFollowingPosts, getUserPosts } from '../controllers/postController.js'

const router = express.Router()

router.get("/all",protectRoute,getAllPosts)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.get("/user/:username",protectRoute,getUserPosts)

router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnLikePost)
router.post("/comment/:id",protectRoute , createCommant)

router.delete("/:id",protectRoute,deletePost)

export default router
