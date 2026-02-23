import React from 'react'
import { Link } from 'react-router-dom';

const Start = () => {
  return (
    <div>
      <div className="bg-no-repeat bg-cover position-relative  bg-[url(https://i.pinimg.com/1200x/70/c9/2b/70c92ba91bf8374152636f4b01362770.jpg)] bg-center h-screen pt-8  flex justify-between flex-col w-full ">
        <img
          className=" w-30 ml-8 "
          src="https://i.pinimg.com/736x/2c/ea/3e/2cea3e7494f8f6f763216b708c21f4f2.jpg"
          alt=""
        />
        <div className="bg-white pb-7 text-black py-5 px-10">
          <h2 className="text-2xl font-bold">Welcome to the Uber Clone</h2>
          <Link to='user-login' className="flex item-center justify-center bg-black text-white py-2 px-4 items-center  rounded mt-5">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Start;