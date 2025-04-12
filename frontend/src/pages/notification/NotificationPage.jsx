import React from "react";
import { Link } from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import toast from 'react-hot-toast'

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import URL from "../../components/url/BackendUrl";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

const NotificationPage = () => {

    const queryClient = useQueryClient()

    const {data : notifications, isLoading} = useQuery({
        queryKey : ["notifications"],
        queryFn : async ()=>{
            try {
                const response = await fetch(`${URL}/api/notifications`,{
                    method : "GET",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                }) 
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong!")
                }
                return data


            } catch (error) {
                throw error
            }
        }
    })

    const {mutate : deleteNotification} = useMutation({
        mutationFn : async()=>{
            try {
                const response = await fetch(`${URL}/api/notifications`,{
                    method : "DELETE",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    }
                }) 
                const data = await response.json()
                if(!response.ok){
                    throw new Error(data.error || "Something Went Wrong!")
                }
                return data


            } catch (error) {
                throw error
            }
        },
        onSuccess : ()=>{
            toast.success("Notification Deleted Successfully")
            queryClient.invalidateQueries({queryKey : ["notifications"]})
        },
        onError : (error)=>{
            toast.error(error.message)
        }
    })

    const deleteNotifications = ()=>{
        deleteNotification()
    }

    return (
        <>
        <div className="flex-1/2 md:border-l md:border-r md:border-border h-screen overflow-y-auto scrollbar-hide pb-[9vh] md:pb-auto">
            <div className="flex relative justify-between items-center p-4 border-b border-border">
                <p className="font-bold">Notifications</p>
                <div className="dropdown ">
                    <div className="dropdown relative">
                        <div tabIndex={0} role="button" className=" m-1">
                            <IoSettingsOutline className="w-4" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content absolute top-6 right-3  z-[1] menu p-1 shadow bg-bg border border-border text-text rounded-box w-45">
                            <li>
                                <Link onClick={deleteNotifications}>Delete all notifications</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {isLoading && (
            <div className="flex justify-center h-full items-center">
                <LoadingSpinner size="lg" />
            </div>
            )}

            {notifications?.length === 0 && (
            <div className="text-center p-4 font-bold">No notifications 🤔</div>
            )}

            {notifications?.map((notification) => (
            <div className="border-b border-borderB" key={notification._id}>
                <div className="flex gap-2 p-4">
                    {notification.type === "follow" && (
                        <FaUser className="w-7 h-7 text-primary" />
                    )}

                    {notification.type === "like" && (
                        <FaHeart className="w-7 h-7 text-red-500" />
                    )}

                    <Link to={`/profile/${notification.from.username}`}>
                        <div className="avatar">
                            <div className="w-8 rounded-full">
                                <img
                                src={
                                    notification.from.profileImg ||
                                    "/avatar-placeholder.png"
                                }
                                />
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <span className="font-bold">
                                @{notification.from.username}
                            </span>{" "}
                            {notification.type === "follow"
                                ? "followed you"
                                : "liked your post"
                            }
                        </div>
                    </Link>
                </div>
            </div>
            ))}
        </div>
        </>
    );
};

export default NotificationPage;
