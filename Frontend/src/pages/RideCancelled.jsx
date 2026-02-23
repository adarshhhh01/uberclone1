import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const RideCancelled = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isPaid, setIsPaid] = useState(false)

  const cancelData = useMemo(() => location.state?.cancellation || null, [location.state?.cancellation])

  useEffect(() => {
    if (!cancelData) {
      navigate('/home', { replace: true })
    }
  }, [cancelData, navigate])

  useEffect(() => {
    if (!isPaid) return
    const timer = setTimeout(() => {
      navigate('/home', { replace: true })
    }, 1800)

    return () => clearTimeout(timer)
  }, [isPaid, navigate])

  if (!cancelData) return null

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-100 p-5'>
      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
        {!isPaid ? (
          <>
            <h1 className='text-2xl font-bold text-slate-900'>Ride Cancelled</h1>
            <p className='mt-2 text-sm text-slate-600'>
              Captain cancelled the trip. Please pay only for covered distance.
            </p>

            <div className='mt-5 space-y-3 rounded-xl border border-slate-200 p-4'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-500'>Distance Covered</span>
                <span className='font-semibold text-slate-900'>
                  {cancelData.coveredDistanceKm || 0} km
                </span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-slate-500'>Payable Amount</span>
                <span className='text-lg font-bold text-emerald-700'>
                  Rs. {cancelData.cancellationCharge || 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPaid(true)}
              className='mt-5 w-full rounded-xl bg-emerald-600 p-3 font-semibold text-white'
            >
              Pay & Finish Trip
            </button>
          </>
        ) : (
          <div className='py-8 text-center'>
            <h2 className='text-2xl font-bold text-emerald-700'>Thank You For Trip</h2>
            <p className='mt-2 text-sm text-slate-600'>
              Payment received. Returning to home page...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideCancelled
