import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import { getCaptainToken } from '../utils/authTokens'



const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)
    const [stats, setStats] = useState({
        hoursOnline: 0,
        totalDistanceKm: 0,
        totalRides: 0
    })

    useEffect(() => {
        if (!captain?._id) return

        const loadCaptainStats = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/api/captains/stats`,
                    {
                        headers: {
                            Authorization: `Bearer ${getCaptainToken()}`
                        }
                    }
                )
                setStats(response.data)
            } catch {
                setStats({
                    hoursOnline: 0,
                    totalDistanceKm: 0,
                    totalRides: 0
                })
            }
        }

        loadCaptainStats()
    }, [captain?._id])

    if (!captain) {
        return null
    }


    return (
        <div className='bg-white shadow-xl rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-2xl'>

            {/* Top Section */}
            <div className='flex items-center justify-between'>

                <div className='flex items-center gap-4'>
                    <img
                        className='h-14 w-14 rounded-full object-cover ring-2 ring-black'
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s"
                        alt="Captain"
                    />
                    <div>
                        <h4 className='text-xl font-semibold capitalize text-gray-800'>
                            {captain.fullName.firstName + " " + captain.fullName.lastName}
                        </h4>
                        <p className='text-sm text-gray-500'>Active Captain</p>
                    </div>
                </div>

                <div className='text-right'>
                    <h4 className='text-2xl font-bold text-green-600'>₹295.20</h4>
                    <p className='text-sm text-gray-500'>Today's Earnings</p>
                </div>

            </div>

            {/* Stats Section */}
            <div className='grid grid-cols-3 gap-4 mt-8'>

                <div className='bg-gray-50 p-4 rounded-xl text-center hover:bg-gray-100 transition'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-semibold text-gray-800'>{stats.hoursOnline} hrs</h5>
                    <p className='text-xs text-gray-500'>Hours Online</p>
                </div>

                <div className='bg-gray-50 p-4 rounded-xl text-center hover:bg-gray-100 transition'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-semibold text-gray-800'>{stats.totalDistanceKm} km</h5>
                    <p className='text-xs text-gray-500'>Distance Covered</p>
                </div>

                <div className='bg-gray-50 p-4 rounded-xl text-center hover:bg-gray-100 transition'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-semibold text-gray-800'>{stats.totalRides}</h5>
                    <p className='text-xs text-gray-500'>Total Rides</p>
                </div>

            </div>

        </div>
    )
}

export default CaptainDetails
