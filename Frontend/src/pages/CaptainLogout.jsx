import React,{useEffect} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import { clearCaptainToken, getCaptainToken } from '../utils/authTokens'

const CaptainLogout = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
    const token = getCaptainToken()

    axios.get(`${import.meta.env.VITE_BASE_URL}/api/captains/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      if (response.status === 200) {
        clearCaptainToken()
        navigate('/captain-login');
      }
    })
    .catch((err) => {
      console.log("Logout error:", err.response?.data || err.message);
      clearCaptainToken()
      navigate('/captain-login');
    });

  }, [navigate]);

  return <div>Logging out...</div>;
}

export default CaptainLogout