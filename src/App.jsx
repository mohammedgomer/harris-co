import { useState, useEffect } from 'react'
import SolicitorBookingSystem from './booking-system'
import StaffDashboard from './staff-dashboard'

function App() {
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (route === '/staff' || route === '/staff/') {
    return <StaffDashboard />
  }

  return <SolicitorBookingSystem />
}

export default App
