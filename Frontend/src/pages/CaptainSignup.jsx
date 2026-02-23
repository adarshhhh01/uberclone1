import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { setCaptainToken } from '../utils/authTokens'


const CaptainSignup = () => {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [color, setcolor] = useState('')
  const [plate, setplate] = useState('')
  const [vehicleType, setvehicleType] = useState('')
  const [capacity, setcapacity] = useState('')

  const navigate = useNavigate()
  const { setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async(e) => {
    e.preventDefault()
    const newCaptain = {
      fullName: { firstName: firstName, lastName: lastName },
      email: email,
      password: password,
      vehicleDetails: {
        color: color,
        plate: plate,
        vehicleType: vehicleType,
        capacity: capacity
      }
    }
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/captains/register`,
      newCaptain
    )
    if (response.status === 201) {
      const data = response.data
      setCaptainToken(data.token)
      setCaptain(data.captain)

      navigate('/captain-home')
    }

    setFirstName('')
    setLastName('')
    setemail('')
    setpassword('')
    setcolor('')
    setplate('')
    setvehicleType('')
    setcapacity('')
  }
  return (
    <div>
      {' '}
      <div className='p-2 h-screen  flex flex-col justify-between '>
        <div className=''>
          <img
            className=' w-20 ml-8 mt-5  '
            src='https://imgs.search.brave.com/mamt-vOw0r1F-u3ExNZasF1ssWgkl3v5yXHFRMP-L4M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvdWJlci9zbWFs/bC91YmVyX1BORzEu/cG5n'
            alt=''
          />
          <form
            className='flex flex-col p-5 justify-between '
            onSubmit={submitHandler}
          >
            <h3 className='text-base flex  font-bold'>
              Enter our captains name
            </h3>
            <div className='flex gap-3 mb-5'>
              <input
                type='text'
                placeholder='First name'
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className='bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
              />
              <input
                type='text'
                placeholder='Last name'
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className='bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
              />
            </div>
            <h3 className='text-base font-bold'>Enter our captains Email</h3>
            <input
              type='email'
              placeholder='Enter your email'
              required
              value={email}
              onChange={e => setemail(e.target.value)}
              className='bg-[#eeeeee] mb-5 rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
            />
            <h3 className='text-base font-bold'>Enter your Password</h3>
            <input
              type='Password'
              placeholder='Enter your password'
              required
              minLength={6}
              value={password}
              onChange={e => setpassword(e.target.value)}
              className='bg-[#eeeeee] mb-5 rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
            />
            <h3 className='text-base font-bold'>Enter Vehicle Details</h3>
            <div className='flex gap-3 mb-5 '>
              <input
                type='text'
                placeholder='Vehicle Color'
                required
                value={color}
                onChange={e => setcolor(e.target.value)}
                className='bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
              />
              <input
                type='text'
                placeholder='Vehicle Plate'
                required
                maxLength={10}
                
                value={plate}
                onChange={e => setplate(e.target.value)}
                className='bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
              />
              <select
                required
                value={vehicleType}
                onChange={e => setvehicleType(e.target.value)}
                className='bg-[#eeeeee] w-1/2 rounded-lg border-2 border-[#dddddd] p-2 mt-2 text-black'
              >
                <option value='' disabled>
                  Select Vehicle Type
                </option>
                <option value='auto'>Auto</option>
                <option value='car'>Car</option>
                <option value='moto'>Moto</option>
              </select>

              <input
                type='number'
                placeholder='Capacity'
                required
                value={capacity}
                onChange={e => setcapacity(e.target.value)}
                className='bg-[#eeeeee] w-1/2  rounded-lg border-2 border-[#dddddd] p-2 mt-2 placeholder:text-black'
              />
            </div>

            <button
              type='submit'
              className='bg-[#111111] text-white font-semibold mb-7 rounded-lg border-2 border-black p-2 mt-2 placeholder:text-black'
            >
              Create a Account
            </button>
            <p className='text-center '>
              {' '}
              Already have an account?{' '}
              <Link
                to={'/user-login'}
                className='text-center mb-3 text-blue-600'
              >
                Login here{' '}
              </Link>
            </p>
          </form>
        </div>

        <div className='flex ml-8 pb-7 mr-8 '>
          <p className='text-xs leading-4'>
            The site is protected by reCAPTCHA and the Google Privacy Policy and
            Terms of Service apply. By clicking "Create a Account", you agree to
            our{' '}
            <Link to={'/user-login'} className='text-blue-600'>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to={'/user-login'} className='text-blue-600'>
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup
