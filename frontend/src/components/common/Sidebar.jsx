import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link} from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import XSvg from "../svgs/X";
import URL from "../url/BackendUrl";
import toast from "react-hot-toast";
import authUserQuery from "./AuthUser";


const Sidebar = () => {
    const queryClient = useQueryClient()
    const { mutate: logout } = useMutation({
        mutationFn: async () => {
        try {
            const response = await fetch(`${URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            });

            const data = await response.json();
            if (!response.ok) {
            throw new Error(data.error || "Something Went Wrong");
            }
       
        } catch (error) {
            throw error;
        }
        },
        onSuccess: () => {
        toast.success("Logout Successfully");

        queryClient.invalidateQueries({
            queryKey : ["authUser"]
        }); // no longer valid
        },
        onError: () => {
        toast.error("Logout UnSuccessfull");

        },
    });

    const {data : authUser} = useQuery(authUserQuery)

    return (
        <div className=" w-full z-30  fixed md:relative md:flex md:w-[22vw] mx-1 md:mx-0  md:max-w-52">
            <div className="flex bg-bg justify-center item-end fixed bottom-0 left-0 z-10  md:sticky md:top-0 md:left-0 md:flex-col md:items-start md:justify-start border-t md:border-t-0   md:border-r border-border w-full">
                <Link to="/" className=" hidden  md:flex justify-center  mx-auto md:justify-start    ">
                     <XSvg className="px-2 w-12 h-12 md:w-15 md:h-15 rounded-full fill-current text-text hover:bg-skeleton" />
                </Link>

                <ul className="w-full h-[9vh]  md:h-auto flex justify-around items-center md:flex-col md:items-start gap-4 md:gap-3 md:mt-4 md:ps-1">
                    <li className="md:hidden z-20">
                        <Link to="/" className="flex justify-center z-10  ">
                            <XSvg className=" w-8 h-8 rounded-full fill-current text-text hover:bg-skeleton" />
                        </Link>
                    </li>

                    <li className="flex justify-center items-center md:justify-start">
                        <Link
                        to="/"
                        className="flex md:gap-3 items-center hover:bg-skeleton transition-all rounded-full duration-300 md:py-2 md:pt-3 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
                        >
                        <MdHomeFilled className="w-8 h-8" />
                        <span className="text-lg hidden md:block">Home</span>
                        </Link>
                    </li>

                    <li className="flex   md:justify-start">
                        <Link
                        to="/notifications"
                        className="flex gap-3 items-center hover:bg-skeleton transition-all rounded-full duration-300 md:py-2 md:pt-3 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
                        >
                        <IoNotifications className="w-7 h-7" />
                        <span className="text-lg hidden md:block">Notifications</span>
                        </Link>
                    </li>

                    <li className="flex md:justify-start">
                        <Link
                        to={`/profile/${authUser?.username}`}
                        className="flex gap-3 items-center hover:bg-skeleton transition-all rounded-full duration-300 md:py-2 md:pt-3 md:pl-2 md:pr-4 max-w-fit cursor-pointer"
                        >
                        <FaUser className="w-6 h-6" />
                        <span className="text-lg hidden md:block">Profile</span>
                        </Link>
                    </li>
                </ul>

                {authUser && (
                <Link
                to={`/profile/${authUser.username}`}
                className="hidden flex-wrap md:mt-auto  md:mb-10 md:flex gap-2 items-center justify-center transition-all duration-300 hover:bg-[#83828241] py-2 px-4 rounded-full"
                >
                    <div className="avatar hidden md:inline-flex">
                        <div className="w-8 rounded-full">
                             <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="profie img" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center md:items-start flex-1">
                        <div className="hidden md:block">
                            <p className='text-text font-bold text-sm w-20 truncate'>{authUser?.fullName}</p>
                            <p className='text-secondary text-sm'>@{authUser?.username}</p>
                        </div>
                        <BiLogOut
                        className=" hidden md:block w-5 h-5 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                        }}/>
                    </div>
                </Link>
            )}
            </div>
        </div>
    );
};

export default Sidebar;
