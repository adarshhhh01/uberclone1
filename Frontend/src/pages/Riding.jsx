import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import RideTrackingMap from '../components/RideTrackingMap'
import { UserDataContext } from '../context/UserContext'
import { SocketContext } from '../context/SocketContext'

const Riding = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(UserDataContext)
  const { socket } = useContext(SocketContext)

  const rideData = useMemo(() => {
    if (location.state?.ride) {
      return location.state.ride
    }
    const storedRide = localStorage.getItem('activeUserRide')
    return storedRide ? JSON.parse(storedRide) : null
  }, [location.state?.ride])

  useEffect(() => {
    if (location.state?.ride) {
      localStorage.setItem('activeUserRide', JSON.stringify(location.state.ride))
    }
  }, [location.state?.ride])

  const [userLocation, setUserLocation] = useState(null)
  const [captainLocation, setCaptainLocation] = useState(null)

  const rideCaptainLocation = useMemo(() => {
    if (!rideData?.captain?.location?.coordinates) return null
    const [lng, lat] = rideData.captain.location.coordinates
    return { lat, lng }
  }, [rideData])

  const pickupLocation = rideData?.pickupCoordinates || null
  const destinationLocation = rideData?.destinationCoordinates || null

  useEffect(() => {
    if (!navigator.geolocation) return

    const watchId = navigator.geolocation.watchPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      () => {},
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  useEffect(() => {
    if (!user?._id) return
    socket.emit('join', { userType: 'user', userId: user._id })
  }, [socket, user?._id])

  useEffect(() => {
    const onCaptainLocationUpdated = data => {
      if (!data?.location) return
      if (rideData?._id && data.rideId && data.rideId !== rideData._id) return
      setCaptainLocation(data.location)
    }

    const onRideCancelled = data => {
      localStorage.removeItem('activeUserRide')
      navigate('/ride-cancelled', { state: { cancellation: data } })
    }

    socket.on('captain-location-updated', onCaptainLocationUpdated)
    socket.on('ride-cancelled', onRideCancelled)

    return () => {
      socket.off('captain-location-updated', onCaptainLocationUpdated)
      socket.off('ride-cancelled', onRideCancelled)
    }
  }, [socket, rideData?._id, navigate])

  const captainName = useMemo(() => {
    if (!rideData?.captain?.fullName) return 'Captain'
    const { firstName = '', lastName = '' } = rideData.captain.fullName
    return `${firstName} ${lastName}`.trim()
  }, [rideData])

  return (
    <div className='h-screen overflow-hidden bg-slate-100'>
      <div className='relative h-[58%]'>
        <RideTrackingMap
          userLocation={userLocation}
          captainLocation={captainLocation || rideCaptainLocation}
          pickupLocation={pickupLocation}
          destinationLocation={destinationLocation}
          pickupAddress={rideData?.pickup}
          destinationAddress={rideData?.destination}
        />
        <Link
          to='/home'
          className='absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow'
        >
          <i className='ri-home-4-line'></i>
        </Link>
      </div>

      <div className='h-[42%] rounded-t-3xl bg-white p-5 shadow-[0_-12px_30px_rgba(15,23,42,0.08)]'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.18em] text-slate-500'>
              On Trip
            </p>
            <h2 className='text-xl font-semibold text-slate-900'>{captainName}</h2>
          </div>
          <div className='rounded-xl bg-slate-100 px-3 py-2 text-right'>
            <p className='text-xs text-slate-500'>Vehicle</p>
            <p className='font-semibold text-slate-800'>
              {rideData?.captain?.vehicleDetails?.plate || '--'}
            </p>
          </div>
        </div>

        <div className='space-y-3 rounded-2xl border border-slate-200 p-4'>
          <div className='flex items-start gap-3'>
            <i className='ri-map-pin-user-fill mt-1 text-green-600'></i>
            <div>
              <p className='text-xs text-slate-500'>Pickup</p>
              <p className='text-sm text-slate-800'>{rideData?.pickup || '--'}</p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <i className='ri-map-pin-2-fill mt-1 text-blue-600'></i>
            <div>
              <p className='text-xs text-slate-500'>Destination</p>
              <p className='text-sm text-slate-800'>
                {rideData?.destination || '--'}
              </p>
            </div>
          </div>
          <div className='flex items-start gap-3'>
            <i className='ri-currency-line mt-1 text-slate-700'></i>
            <div>
              <p className='text-xs text-slate-500'>Fare</p>
              <p className='text-sm font-semibold text-slate-900'>
                Rs. {rideData?.fare ?? '--'}
              </p>
            </div>
          </div>
        </div>

        <button className='mt-4 w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white'>
          Make Payment
        </button>
      </div>
    </div>
  )
}

export default Riding
