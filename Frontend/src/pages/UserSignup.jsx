import React, { useState} from 'react'
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import {UserDataContext} from '../context/UserContext.jsx';




const UserSignup = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const navigate = useNavigate();
  const {User, setUser} = React.useContext(UserDataContext);


  const submitHandler = async(e) => {



    e.preventDefault();
    const newUser = {
      fullName:{
        firstName: firstName,
         lastName: lastName,
        },
      email: email,
      password: password
    }
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/users/register`, newUser)
     if(response.status === 201){
       const data = response.data;
      localStorage.setItem('token', data.token)
      setUser(data.user)
      
      navigate('/home')
    }



    setFirstName('');
    setLastName('');
    setemail('');
    setpassword('');
  }
  return (
    <div>
      {" "}
      <div className="p-2 h-screen  flex flex-col justify-between ">
        <div className="">
          <img
            className=" w-20 ml-8 mt-5  "
            src="https://imgs.search.brave.com/UR3PcUFSL2FoHAfjb2um5PkULCRNs5eMG8Ia3e-85m0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sb2dv/aGlzdG9yeS5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjMv/MDYvVWJlci1Mb2dv/LnBuZw"
            alt=""
          />
          <form className="flex flex-col p-5 justify-between " onSubmit={submitHandler}>
            <h3 className="text-base flex  font-bold">Enter your name</h3>
            <div className='flex gap-3 mb-5'>

              <input
                type="text"
                placeholder="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
                />
              <input
                type="text"
                placeholder="Last name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
                />
              </div>
            <h3 className="text-base font-bold">Enter your Email</h3>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setemail(e.target.value)}  
              className="bg-[#eeeeee] mb-5 rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
            />
            <h3 className="text-base font-bold">Enter your Password</h3>
            <input
              type="Password"
              placeholder="Enter your password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="bg-[#eeeeee] mb-5 rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black"
            />
            <button
             
             
              type="submit"
              className="bg-[#111111] text-white font-semibold mb-7 rounded-lg border-2 border-black p-2 mt-2 placeholder:text-black"
            >
              Create a Account 
            </button>
            <p className="text-center ">
              {" "}
              Already have an account?{" "}
              <Link
                to={"/user-login"}
                className="text-center mb-3 text-blue-600">
                Login here{" "}
              </Link>
            </p>
          </form>
        </div>

        <div className="flex ml-8 pb-7 mr-8 ">
          <p className='text-xs leading-4'>
            The site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
            By clicking "Create a Account", you agree to our <Link to={"/user-login"} className='text-blue-600'>Terms of Service</Link> and <Link to={"/user-login"} className='text-blue-600'>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserSignup