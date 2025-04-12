import React, { useState } from 'react'

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import RightPanelSkeleton from '../skeletons/RightPanelSkeleton';
import URL from '../url/BackendUrl';
import { LoadingDot } from './LoadingSpinner';
import useFollow from '../../hooks/useFollow';


const RightPanel = () => {
    const [activeUserId,setActiveUserId] = useState()

    const {data : suggestedUsers, isLoading } = useQuery({
        queryKey : ["suggestedUsers"],
        queryFn : async()=>{
            try {
                const response = await fetch(`${URL}/api/users/suggested`,{
                    method : "GET",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                })
                const data = await response.json()

                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong")
                }
                return data
                
            } catch (error) {
                throw error
            }
        }
    })

    const {follow,isPending} = useFollow()

    const handleFollow = (userId)=>{
        setActiveUserId(userId)
        follow(userId , {
            onSettled : ()=> setActiveUserId(null)
        })
    };

    if(suggestedUsers?.length === 0){
        return (
            <div className='w-0 md:w-60'></div>
        )
    }

    return (
        <div className=' my-4 mx-2'>
                <div className='bg-bg p-4 rounded-md sticky top-2'>
                    <p className='font-bold'>Who to follow</p>
                    <div className='flex flex-col gap-4'>
                        {/* item */}
                        {isLoading && (
                            <>
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                                <RightPanelSkeleton />
                            </>
                        )}

                        {!isLoading &&
                            suggestedUsers?.map((user) => (
                                <Link
                                    to={`/profile/${user.username}`}
                                    className='flex items-center justify-between gap-4'
                                    key={user._id}
                                >
                                    <div className='flex gap-2 items-center'>
                                        <div className='avatar'>
                                            <div className='w-8 rounded-full'>
                                                <img src={user.profileImg || "/avatar-placeholder.png"} />
                                            </div>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className='font-semibold tracking-tight truncate w-28'>
                                                {user.fullName}
                                            </span>
                                            <span className='text-sm text-slate-500'>@{user.username}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleFollow(user._id);
                                            }}>
                                            {isPending && activeUserId === user._id  ? <LoadingDot size='sm' /> : "Follow"}
                                        </button>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
    )
}

export default RightPanel
