import React from 'react'

import Start from './pages/Start.jsx';
import Home from './pages/Home.jsx';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import CaptainLogin from './pages/CaptainLogin';
import CaptainSignup from './pages/CaptainSignup';
import { UserDataContext } from './context/UserContext.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProtectedWrapper from './pages/UserProtectedWrapper.jsx';
import UserLogout from './pages/UserLogout.jsx';
import CaptainLogout from './pages/CaptainLogout.jsx';
import CaptainHome from './pages/CaptainHome.jsx';
import CaptainProtectedWrapper from './pages/CaptainProtectedWrapper.jsx';
import Riding from './pages/Riding.jsx';
import CaptainRiding from './pages/CaptainRiding.jsx';
import RideCancelled from './pages/RideCancelled.jsx';



const App = () => {

  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<UserProtectedWrapper><Home /></UserProtectedWrapper>} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/riding" element={<Riding />} />
          <Route path="/ride-cancelled" element={<RideCancelled />} />
          <Route path="/captain-riding" element={<CaptainRiding />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/api/users/logout" element={<UserProtectedWrapper><UserLogout /></UserProtectedWrapper>} />
          <Route path="/api/captains/logout" element={<CaptainProtectedWrapper><CaptainLogout /></CaptainProtectedWrapper>} />
          <Route path="/captain-home" element={<CaptainProtectedWrapper><CaptainHome /></CaptainProtectedWrapper>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
