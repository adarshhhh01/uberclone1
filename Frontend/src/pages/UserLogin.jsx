import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setUserToken } from '../utils/authTokens.js'

const UserLogin = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

  const { User, setUser } = React.useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async e => {
    e.preventDefault()

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/users/login`,
      userData
    )
    if (response.status === 200) {
      const data = response.data
       setUserToken(data.token)
      setUser(data.user)
      navigate('/home')
    }

    setemail('')
    setpassword('')
  }

  return (
    <div className='p-2 h-screen  flex flex-col justify-between '>
      <div className=''>
        <img
          className=' w-20 ml-8 mt-5  '
          src='https://imgs.search.brave.com/UR3PcUFSL2FoHAfjb2um5PkULCRNs5eMG8Ia3e-85m0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9sb2dv/aGlzdG9yeS5uZXQv/d3AtY29udGVudC91/cGxvYWRzLzIwMjMv/MDYvVWJlci1Mb2dv/LnBuZw'
          alt=''
        />
        <form
          onSubmit={e => submitHandler(e)}
          className='flex flex-col p-5 justify-between '
        >
          <h3 className='text-2xl font-bold'>Enter your Email</h3>
          <input
            type='email'
            placeholder='Enter your email'
            required
            value={email}
            onChange={e => setemail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-xl border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
          />
          <h3 className='text-2xl font-bold'>Enter your Password</h3>
          <input
            type='Password'
            placeholder='Enter your password'
            required
            value={password}
            onChange={e => setpassword(e.target.value)}
            minLength={6}
            className='bg-[#eeeeee] mb-7 rounded-xl border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
          />
          <button
            type='submit'
            className='bg-[#111111] text-white font-semibold mb-7 rounded-xl border-2 border-black p-2 mt-2 placeholder:text-black'
          >
            Login
          </button>
          <p className='text-center '>
            {' '}
            New Here?{' '}
            <Link
              to={'/user-signup'}
              className='text-center mb-3 text-blue-600'
            >
              {' '}
              Create new Accounts{' '}
            </Link>
          </p>
        </form>
      </div>

      <div className='flex ml-8 pb-7 mr-8 '>
        <Link
          to={'/captain-login'}
          className='bg-green-500 flex item-center  justify-center items-center w-full px-4 py-2 text-black font-semibold rounded-xl border-2 text-lg border-black placeholder:text-base'
        >
          Login as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin
