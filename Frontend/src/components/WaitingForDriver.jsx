import React from 'react'

const WaitingForDriver = props => {
  const ride = props.ride || null

  return (
    <div>
      <h5
        className='absolute top-0 w-[93%] p-1 text-center'
        onClick={() => props.setWaitingForDriver(false)}
      >
        <i className='ri-arrow-down-wide-line text-3xl text-gray-200'></i>
      </h5>

      <div className='flex items-center justify-between'>
        <img
          className='h-10'
          src='https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg'
          alt=''
        />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>
            {ride?.captain?.fullName?.firstName || 'Driver Assigned'}
          </h2>
          <h4 className='-mb-1 -mt-1 text-lg font-semibold'>
            {ride?.captain?.vehicleDetails?.plate || '--'}
          </h4>
          <p className='text-sm text-gray-700'>
            {ride?.captain?.vehicleDetails?.vehicleType || '--'}
          </p>
        </div>
      </div>

      <div className='mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center'>
        <p className='text-xs uppercase tracking-[0.12em] text-emerald-700'>
          Share This OTP With Driver
        </p>
        <p className='mt-1 text-2xl font-bold tracking-[0.35em] text-emerald-800'>
          {ride?.otp || '------'}
        </p>
      </div>

      <div className='mt-5 flex flex-col items-center justify-between gap-2'>
        <div className='w-full'>
          <div className='flex items-center gap-5 border-b-2 p-3'>
            <i className='ri-map-pin-user-fill'></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='-mt-1 text-sm text-gray-600'>{ride?.pickup || '--'}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 border-b-2 p-3'>
            <i className='ri-map-pin-2-fill text-lg'></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='-mt-1 text-sm text-gray-600'>
                {ride?.destination || '--'}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className='ri-currency-line'></i>
            <div>
              <h3 className='text-lg font-medium'>Rs. {ride?.fare ?? '--'}</h3>
              <p className='-mt-1 text-sm text-gray-600'>Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver
