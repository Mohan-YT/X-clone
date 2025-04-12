import React from "react";

import { Link } from "react-router-dom";
import { useState } from "react";
import {useMutation} from "@tanstack/react-query"
import toast from 'react-hot-toast';


import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";

import XSvg from "../../../components/svgs/X";
import URL from '../../../components/url/BackendUrl'
import { LoadingDot } from "../../../components/common/LoadingSpinner";

const SignUpPage = () => {

    const [showPassword, setShowPassword] = useState(true);

    const togglePassword = () => setShowPassword((prev) => !prev);


    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const {mutate : signUp ,isPending,isError,error} = useMutation({
        mutationFn : async ({email,username,fullName,password})=>{
            try {
                const response = await fetch(`${URL}/api/auth/signup`,{
                    method : "POST",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json",
                        "Accept" : "application/json"
                    },
                    body : JSON.stringify({email,username,fullName,password})
                })
                const data = await response.json()

                if(!response.ok){ 
                    throw new Error(data.error || "Something Went Wrong")
                }
                return data

            } catch (error) {
                console.log(error)
                throw error
            }   
        },
        onSuccess : ()=>{
            setFormData({
                email : "",
                username : "",
                fullName : "",
                password : ""
              })
            toast.success("User Created Successfully")
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault(); // page won't reload
        signUp(formData);
  
    };

    const handleInputChange = (e) => {
        const {name,value} = e.target

        setFormData((pre)=>({
            ...pre,
            [name]:value
        }));
    };


    return (
        <>
        <div className=" flex w-full h-screen px-8">
            <div className="flex-1 hidden md:flex items-center  justify-center">
                 <XSvg className="md:w-3/4 md-hidden fill-current text-text" />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <form
                    className="md:w-3/4  mx-auto md:mx-20 flex gap-4 flex-col"
                    onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col items-center justify-center">
                         <XSvg className="w-24 md:hidden fill-current text-text flex justify-center" />
                         <h1 className="text-4xl font-extrabold ">Join today.</h1>
                    </div>
                   
                    
                    <label className="input input-bordered rounded flex items-center gap-2 w-full">
                    <MdOutlineMail className="text-black"/>
                    <input
                        type="email"
                        className="grow  text-black font-medium placeholder-gray-500"
                        placeholder="Email"
                        name="email"
                        onChange={handleInputChange}
                        value={formData.email}/>
                    </label>

                    <div className="flex gap-4 flex-wrap">
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <FaUser className="text-black" />
                            <input
                            type="text"
                            className="grow  text-black font-medium placeholder-gray-500"
                            placeholder="Username"
                            name="username"
                            onChange={handleInputChange}
                            value={formData.username}
                            />
                        </label>
                        <label className="input input-bordered rounded flex items-center gap-2 flex-1">
                            <MdDriveFileRenameOutline size={22} className="text-black" />
                            <input
                            type="text"
                            className="grow  text-black font-medium placeholder-gray-500"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleInputChange}
                            value={formData.fullName}
                            />
                        </label>
                    </div>

                    <label className="input relative input-bordered rounded flex items-center gap-2 w-full">
                        <MdPassword className="text-black" />
                        <input
                            type={showPassword ? "password" : "text"}
                            className="grow  text-black font-medium placeholder-gray-500"
                            placeholder="Password"
                            name="password"
                            onChange={handleInputChange}
                            value={formData.password} />
                            {formData.password.length > 0 &&
                                (showPassword ? (
                                    <FaRegEye
                                    onClick={togglePassword}
                                    className="text-black cursor-pointer"
                                    size={20}
                                    />
                                ) : (
                                    <FaRegEyeSlash
                                    onClick={togglePassword}
                                    className="text-black cursor-pointer"
                                    size={20}
                                    />
                                ))
                            }


                    </label>

                    <button className="btn rounded-full btn-primary ">
                    {isPending ? <LoadingDot /> : "Sign up"}
                    </button>
                    {isError && <p className="text-red-500 text-center">{error.message}</p>}
                </form>

                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className=" text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="btn rounded-full btn-primary  btn-outline w-full">
                             Login
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
};

export default SignUpPage;
