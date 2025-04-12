import Notification from "../models/notificationModel.js"
import {postModel} from "../models/postModel.js"
import { User } from "../models/userModel.js"
import cloudinary from "cloudinary"

export const createPost = async(req,res)=>{
    try {
        const {text} = req.body
        let {img} = req.body
        const userId = req.user._id.toString()

        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error : "User Not Found"})
        }

        if(!text && !img){
            return res.status(400).json({error : "Post must have text or image"})
        }

        if(img){
            const uploadedImage = await cloudinary.uploader.upload(img)
            img = uploadedImage.secure_url
        }
        const newPost = new postModel({
            user : userId,
            text,
            img
        })
        await newPost.save()
        
        res.status(200).json(newPost)

    } catch (error) {
        console.log(`Error in create post controller : ${error.message}`)
        resizeBy.status(500).json({error : "Internal Server Error"})
    }
}



export const deletePost = async(req,res)=>{
    try {
        const {id} = req.params;

        const post = await postModel.findById(id)
        if(!post){
            return res.status(404).json({error : "Post Not Found"})
        }
        
        //post.user is a id of post creater
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error : "you are not autherized to delete this post"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId)
        }
        await postModel.findByIdAndDelete(id)
        res.status(200).json({message : "Post Deleted Successfully"})

    } catch (error) {
        console.log(`Error in delete post controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



export const createCommant = async(req,res)=>{
    try {
        const {text} = req.body
        const postId = req.params.id
        const userId = req.user._id
        if(!text){
            return res.status(400).json({error : "Comment text is required"})
        }
        const post = await postModel.findById(postId)
        if(!post){
            return res.status(404).json({error : "Post Not Found"})
        }

        const comment = {
            user : userId,
            text
        }
        post.comments.push(comment)
        await post.save()

        //send notification
        const newNotification = new Notification({
                 type : "comment",
                 from : userId, // the one who liked or commented.
                 to : post.user  //the owner of the post 
             })
        await newNotification.save()

        res.status(200).json(post)

    } catch (error) {
        console.log(`Error in create comment controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



export const likeUnLikePost = async(req,res)=>{
    try {
        const userId = req.user._id
        const {id : postId} = req.params

        const post = await postModel.findById(postId)
        if(!post){
            return res.status(404).json({error : "Post Not Found"})
        }
        const userLikedPost = post.likes.includes(userId)
        if(userLikedPost){
            //unlike post
            await postModel.updateOne({_id : postId},{$pull :  {likes : userId}})
            await User.updateOne({_id : userId},{$pull : {likedPosts : postId}})
            const updatedLikes = post.likes.filter((id)=>id.toString() !== userId.toString() )
            res.status(200).json(updatedLikes)
        }else{
            //like post
            post.likes.push(userId)
            await User.updateOne({_id : userId},{$push : {likedPosts : postId}})
            await post.save()

            const notification = new Notification({
                from : userId,
                to : post.user,
                type : "like"
            })
            await notification.save()
            const updatedLikes = post.likes
            res.status(200).json(updatedLikes)
        }

    } catch (error) {
        console.log(`Error in like/unlike controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



export const getAllPosts = async(req,res)=>{
    try {
        const posts = await postModel
                                    .find()
                                    .sort({createdAt : -1}) //-1 --> reverse the posts based on createAt
                                    .populate({ 
                                                path : "user", //populate("user") --> "user" full data store in each posts
                                                select : "-password"
                                            }) 
                                    .populate({
                                        path : "comments.user",
                                        select : ["-password","-email","-following","-link","-followers","-bio"]
                                    }) 
        
        if(posts.length == 0){
            return res.status(200).json([])
        }
        res.status(200).json(posts)

    } catch (error) {
        console.log(`Error in create post controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}


export const getLikedPosts = async(req,res)=>{
    try {
        const userId = req.params.id
        const user = await User.findById(userId)
        if(!user){
           return res.status(404).json({error : "User Not Found"})
        }

        const LikedPosts = await postModel
                                        .find({_id : {$in : user.likedPosts}})
                                        .populate({
                                            path : "user",
                                            select : "-password"
                                        })
                                        .populate({
                                            path : "comments.user",
                                            select : ["-password","-email","-following","-link","-followers","-bio"]
                                        }) 
        res.status(200).json(LikedPosts)

    } catch (error) {
        console.log(`Error in getlikedposts controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}


export const getFollowingPosts = async(req,res)=>{
    try {
        const userId = req.user._id
        const user = await User.findById(userId)
        if(!user){
           return res.status(404).json({error : "User Not Found"})
        }

        const following = user.following
        const postByFollowing = await postModel
                                            .find({user : {$in : following}})
                                            .sort({createdAt : -1})
                                            .populate({
                                                path : "user",
                                                select : "-password"
                                            })
                                            .populate({
                                                path : "comments.user",
                                                select : ["-password","-email","-following","-link","-followers","-bio"]
                                            })
       
        res.status(200).json(postByFollowing)

    } catch (error) {
        console.log(`Error in getfollowingposts controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}



export const getUserPosts = async(req,res)=>{
    try {
        const {username} = req.params
        const user = await User.findOne({username})
        if(!user){
           return res.status(404).json({error : "User Not Found"})
        }

        const posts = await postModel
                                    .find({user : user._id})
                                    .sort({createdAt : -1})
                                    .populate({
                                        path : "user",
                                        select : "-password"
                                    })
                                    .populate({
                                        path : "comments.user",
                                        select : ["-password","-email","-following","-link","-followers","-bio"]
                                    })

       
        res.status(200).json(posts)

    } catch (error) {
        console.log(`Error in getusernameposts controller : ${error.message}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}