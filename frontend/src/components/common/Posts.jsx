import React from "react";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import URL from "../url/BackendUrl";


const Posts = ({ feedType,username,userId }) => {

    const getPostEndPoint = ()=>{
        switch(feedType){
            case "forYou" :
                return `${URL}/api/posts/all`;
            case "following" :
                return `${URL}/api/posts/following`;
            case "posts" :
                return `${URL}/api/posts/user/${username}`;
            case "likes" :
                return `${URL}/api/posts/likes/${userId}`;
            case "suggestedProfile" :
                return `${URL}/api/users/suggested`;
            default :
                return `${URL}/api/posts/all`
        }
    }
    const PostEndPoint = getPostEndPoint()

    const {data : posts, isLoading, refetch, isRefetching} = useQuery({
        queryKey : ["posts"],
        queryFn : async ()=>{
            try {
                const response = await fetch(PostEndPoint,{
                    method : "GET",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                })
                
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong! ")
                }
                return data
                
            } catch (error) {
                throw error
            }
        }
    })

    useEffect(() => {
		refetch();
	}, [feedType, refetch,username]);


    return (
        <>
        {(isLoading || isRefetching) && (
            <div className="flex flex-col justify-center">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        )}
        {!isLoading && !isRefetching && posts?.length === 0 && (
            <p className="text-center my-4">No posts in this tab. Switch 👻</p>
        )}
        {!isLoading && !isRefetching && posts && (
            <div>
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
            </div>
        )}
        </>
    );
};

export default Posts;
