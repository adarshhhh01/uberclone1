import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext.jsx';
import axios from 'axios';
import { clearCaptainToken, getCaptainToken } from '../utils/authTokens'

const CaptainProtectedWrapper = ({ children }) => {

  const token = getCaptainToken()
  const { setCaptain } = React.useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    if (!token) {
      navigate('/captain-login');
      return;
    }

    const fetchCaptain = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          setCaptain(response.data.captain);
          setIsLoading(false);
        }

      } catch (err) {
        console.log("Error fetching captain profile:", err.response?.data || err.message);
        clearCaptainToken()
        navigate('/captain-login');
      }
    };

    fetchCaptain();

  }, [token, navigate, setCaptain]);

  if (isLoading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default CaptainProtectedWrapper;