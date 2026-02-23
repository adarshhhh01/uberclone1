import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { clearUserToken, getUserToken } from '../utils/authTokens'


const UserProtectWrapper = ({
    children
}) => {
    const token = getUserToken()
    const navigate = useNavigate()
    const { User, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)
    

    useEffect(() => {
        if (!token) {
            navigate('/user-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data.user)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                clearUserToken()
                navigate('/user-login')
            })
    }, [ token , navigate, setUser ])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper