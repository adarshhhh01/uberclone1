import React,{useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { clearUserToken, getUserToken } from '../utils/authTokens'

const UserLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
     const token = getUserToken()

    axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      if (response.status === 200) {
        clearUserToken()
        navigate('/user-login');
      }
    })
    .catch((err) => {
      console.log("Logout error:", err.response?.data || err.message);
      clearUserToken()
      navigate('/user-login');
    });

  }, [navigate]);

  return <div>Logging out...</div>;
}

export default UserLogout