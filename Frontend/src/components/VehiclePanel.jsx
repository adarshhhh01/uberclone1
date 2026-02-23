import React from 'react'

const VehiclePanel = (props) => {

  return (
    <div>

      {/* Close Button */}
      <h4
        className='p-3 text-center w-[93%] text-3xl text-gray-300 absolute top-0'
        onClick={() => {
          props.setVehiclePanel(false)
        }}
      >
        <i className='ri-arrow-down-wide-line'></i>
      </h4>

      <div className='text-2xl font-semibold mb-6 mt-8'>
        <h1>Choose a Vehicle</h1>
      </div>

      {/* CAR */}
      <div
        onClick={() => {
          
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
          props.selectVehicle('car')
        }}
        className='bg-gray-100 flex border-2 border-white items-center justify-between gap-2 mb-3 active:border-black px-5 rounded-lg py-3 cursor-pointer'
      >
        <div>
          <h4 className='font-medium'>Car</h4>
          <p className='text-sm text-gray-600'>Affordable & comfortable</p>
        </div>
        <h2 className='text-xl font-semibold'>₹{props.fare.car}</h2>
      </div>

      {/* MOTO */}
      <div
        onClick={() => {
          props.selectVehicle('moto')
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
        }}
        className='bg-gray-100 flex border-2 border-white items-center justify-between gap-2 mb-3 active:border-black px-5 rounded-lg py-3 cursor-pointer'
      >
        <div>
          <h4 className='font-medium'>Moto</h4>
          <p className='text-sm text-gray-600'>Fast & budget friendly</p>
        </div>
        <h2 className='text-xl font-semibold'>₹{props.fare.moto}</h2>
      </div>

      {/* AUTO */}
      <div
        onClick={() => {
          props.selectVehicle('auto')
          props.setConfirmRidePanel(true)
          props.setVehiclePanel(false)
        }}
        className='bg-gray-100 flex border-2 border-white items-center justify-between gap-2 mb-3 active:border-black px-5 rounded-lg py-3 cursor-pointer'
      >
        <div>
          <h4 className='font-medium'>Auto</h4>
          <p className='text-sm text-gray-600'>Compact & economical</p>
        </div>
        <h2 className='text-xl font-semibold'>₹{props.fare.auto}</h2>
      </div>

    </div>
  )
}

export default VehiclePanel
