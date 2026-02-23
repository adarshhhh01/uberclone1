import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import axios from 'axios'
import { getCaptainToken } from '../utils/authTokens'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import RideTrackingMap from '../components/RideTrackingMap'

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const finishRidePanelRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [rideData, setRideData] = useState(location.state?.ride || null)
  const [captainLocation, setCaptainLocation] = useState(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)

  useEffect(() => {
    const loadRide = async () => {
      if (location.state?.ride) {
        localStorage.setItem('ongoingRide', JSON.stringify(location.state.ride))
        setRideData(location.state.ride)
        return
      }

      const storedRide = localStorage.getItem('ongoingRide')
      if (storedRide) {
        setRideData(JSON.parse(storedRide))
        return
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/rides/current-ride`,
          {
            headers: {
              Authorization: `Bearer ${getCaptainToken()}`
            }
          }
        )
        setRideData(response.data)
        localStorage.setItem('ongoingRide', JSON.stringify(response.data))
      } catch {
        setRideData(null)
      }
    }

    loadRide()
  }, [location.state])

  const pickupLocation = rideData?.pickupCoordinates || null
  const destinationLocation = rideData?.destinationCoordinates || null

  useEffect(() => {
    if (!captain?._id) return

    socket.emit('join', {
      userId: captain._id,
      userType: 'captain'
    })

    if (!navigator.geolocation) return

    const sendLocation = position => {
      const nextLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      setCaptainLocation(nextLocation)
      socket.emit('update-location-captain', { location: nextLocation })
    }

    const onError = () => {}

    navigator.geolocation.getCurrentPosition(sendLocation, onError, {
      enableHighAccuracy: true,
      timeout: 10000
    })

    const watchId = navigator.geolocation.watchPosition(sendLocation, onError, {
      enableHighAccuracy: true
    })

    return () => navigator.geolocation.clearWatch(watchId)
  }, [socket, captain?._id])

  useGSAP(
    function () {
      if (finishRidePanel) {
        gsap.to(finishRidePanelRef.current, {
          transform: 'translateY(0)'
        })
      } else {
        gsap.to(finishRidePanelRef.current, {
          transform: 'translateY(100%)'
        })
      }
    },
    [finishRidePanel]
  )

  const cancelRide = async () => {
    if (!rideData?._id) return

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/cancel-ride`,
        {
          rideId: rideData._id,
          reason: 'Cancelled by captain'
        },
        {
          headers: {
            Authorization: `Bearer ${getCaptainToken()}`
          }
        }
      )

      localStorage.removeItem('ongoingRide')
      navigate('/captain-home')
    } catch (error) {
      console.error(error?.response?.data?.message || 'Unable to cancel ride')
    }
  }

  return (
    <div className='relative flex h-screen flex-col justify-end overflow-hidden'>
      <div className='fixed left-0 right-0 top-0 z-20 flex items-center justify-between p-5'>
        <img
          className='w-16'
          src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
          alt=''
        />
        <Link
          to='/captain-home'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-white shadow'
        >
          <i className='ri-home-4-line text-lg'></i>
        </Link>
      </div>

      <div className='fixed inset-0 z-0'>
        <RideTrackingMap
          captainLocation={captainLocation}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          pickupAddress={rideData?.pickup}
          destinationAddress={rideData?.destination}
        />
      </div>

      <div
        className='relative z-10 h-[22%] cursor-pointer rounded-t-3xl bg-amber-300 px-6 pt-10 shadow-[0_-15px_35px_rgba(15,23,42,0.18)]'
        onClick={() => {
          setFinishRidePanel(true)
        }}
      >
        <h5 className='absolute top-1 w-[90%] p-1 text-center'>
          <i className='ri-arrow-up-wide-line text-3xl text-amber-900'></i>
        </h5>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <p className='text-xs uppercase tracking-[0.15em] text-amber-800'>
              Active Ride
            </p>
            <h4 className='text-xl font-semibold text-slate-900'>
              {rideData ? 'Ride in progress' : 'Waiting for ride data'}
            </h4>
          </div>
          <button className='rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white'>
            Complete
          </button>
          <button
            onClick={cancelRide}
            className='rounded-lg bg-red-600 px-4 py-3 font-semibold text-white'
          >
            Cancel Ride
          </button>
        </div>
      </div>

      <div
        ref={finishRidePanelRef}
        className='fixed bottom-0 z-30 w-full translate-y-full bg-white px-3 pb-8 pt-12'
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  )
}

export default CaptainRiding
