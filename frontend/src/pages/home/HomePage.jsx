import React, { useState } from 'react'
import Posts from "../../components/common/Posts";
import CreatePost from './CreatePost';

const HomePage = () => {

    const [feedType, setFeedType] = useState("forYou");

    return (
      <>
        <div className='flex-1 flx-col mr-auto w-full h-screen overflow-x-hidden scrollbar-hide pb-[9vh] md:pb-auto'>
            {/* Header */}
            <div className='flex w-full  border-b border-border'>
              <div
                className={"flex justify-center flex-1 p-3 hover:bg-skeleton transition duration-300 cursor-pointer relative"}
                onClick={() => setFeedType("forYou")}>
                For you
                {feedType === "forYou" && (
                  <div className='absolute bottom-0 w-12  h-1 rounded-full bg-primary'></div>
                )}
              </div>

              <div className='flex justify-center flex-1 p-3 hover:bg-skeleton   transition duration-300 cursor-pointer relative'
                onClick={() => setFeedType("following")}>
                Following
                {feedType === "following" && (
                  <div className='absolute bottom-0 w-12  h-1 rounded-full bg-primary'></div>
                )}
              </div>
            </div>

            <div className='w-full overflow-y-auto'>
                 {/*  CREATE POST INPUT */}
                  <CreatePost />

                  {/* POSTS */}
                  <Posts feedType={feedType} />
            </div>
         
        </div>
      </>
    )
}

export default HomePage