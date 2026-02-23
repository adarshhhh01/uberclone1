import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { setCaptainToken } from '../utils/authTokens.js';
 
const CaptainLogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
 
  const { Captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async(e) => {
    e.preventDefault();   

    const captainData = {
      email: email,
      password: password
    }
    
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/captains/login`,
      captainData
    )
    if (response.status === 200) {
      const data = response.data
      setCaptainToken(data.token)
      
      setCaptain(data.captain)
      navigate('/captain-home')
    }
    
    setemail('');
    setpassword('');  
  }

  return (
    <div className='p-2 h-screen  flex flex-col justify-between '>
      <div className=''>

      
      <img
        className=" w-20 ml-8 mt-5 mb-6 "
        src="https://imgs.search.brave.com/mamt-vOw0r1F-u3ExNZasF1ssWgkl3v5yXHFRMP-L4M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvdWJlci9zbWFs/bC91YmVyX1BORzEu/cG5n"
        alt=""
      />
      <form onSubmit={(e) => submitHandler(e)}
      className="flex flex-col p-5 justify-between ">
        <h3 className="text-2xl font-bold">Enter your Email</h3>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setemail(e.target.value)}
          className="bg-[#eeeeee] mb-7 rounded-xl border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
        />
        <h3 className="text-2xl font-bold">Enter your Password</h3>
        <input
          type="Password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          minLength={6}
          className="bg-[#eeeeee] mb-7 rounded-xl border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
        />
        <button
          type="submit"
          className="bg-[#111111] text-white font-semibold mb-7 rounded-xl border-2 border-black p-2 mt-2 placeholder:text-black"
        >
          Login
        </button>
        <p className='text-center text-shadow-lg text-lg '> Join a fleet? <Link to={'/captain-signup'} className='text-center te mb-3 text-blue-600'> Register as a Captain </Link></p>
      </form>
    </div>
    
      <div className='flex ml-8 pb-7 mr-8 '>
        <Link to={'/user-login'} className="bg-orange-400 flex item-center  justify-center items-center w-full px-4 py-2 text-black font-semibold rounded-xl border-2 text-lg border-black placeholder:text-base">
          Login as user
        </Link>
      </div>
    </div>
  );
}

export default CaptainLogin