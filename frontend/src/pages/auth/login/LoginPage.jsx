import React from "react";

import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import XSvg from "../../../components/svgs/X";
import URL from "../../../components/url/BackendUrl";
import { LoadingDot } from "../../../components/common/LoadingSpinner";


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(true);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient()

  const {mutate : login , isPending , isError , error} = useMutation({
    mutationFn : async ({username , password})=>{
        try {
            const response = await fetch(`${URL}/api/auth/login`,{
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json",
                },
                body : JSON.stringify({username,password})
            })

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.error || "Something Went Wrong")
            }
            return data
        } catch (error) {
            throw error
        }
    },
    onSuccess : ()=>{
        setFormData({
            username : "",
            password : ""
          })
        toast.success("Login Success")
        queryClient.invalidateQueries({   // fetch fresh profile data
            queryKey : ["authUser"]
        })
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setFormData((pre)=>({
        ...pre,
        [name] : value
    }));
  };

  return (
    <>
        <div className=" flex w-full h-screen px-8">
            <div className="flex-1 hidden md:flex items-center  justify-center">
                 <XSvg className="md:w-3/4 md-hidden fill-current text-text" />
            </div>

            <div className="flex-1 w-full flex flex-col justify-center items-center">
                <form
                    className=" w-[90%]  lmd:w-[80%] llg:w-[70%]  mx-auto sm:mx-20 flex gap-3 flex-col"
                    onSubmit={handleSubmit}>
                    <div className="w-full flex flex-col mb-5 sm:mb-auto items-center justify-center">
                         <XSvg className="w-24 md:hidden fill-current text-text flex justify-center" />
                         <h1 className="text-4xl font-extrabold ">{"Let's"} go.</h1>
                    </div>
                   
                    
                    <label className="input input-bordered rounded flex items-center gap-2 w-full">
                    <FaUser className="text-black"/>
                    <input
                        type="text"
                        className="grow  text-black font-medium placeholder-gray-500"
                        placeholder="Username"
                        name="username"
                        onChange={handleInputChange}
                        value={formData.username}/>
                    </label>

              

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

                    <button className="btn rounded-full btn-primary  ">
                    {isPending ? <LoadingDot /> : "Login"}
                    </button>
                    {isError && <p className="text-red-500 text-center">{error.message}</p>}
                </form>

                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className=" text-lg text-center">{"Don't"} have an account?</p>
                    <Link to="/signup">
                        <button className="btn rounded-full btn-primary  btn-outline w-full">
                             SignUp
                        </button>
                    </Link>
                </div>
            </div>
        </div>
        </>
  );
};

export default LoginPage;
