import { Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Layout from './components/layout/Layout.jsx'
import { Spinner } from './components/ui/Loader.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Trips = lazy(() => import('./pages/Trips.jsx'))
const TripDetails = lazy(() => import('./pages/TripDetails.jsx'))
const Flights = lazy(() => import('./pages/Flights.jsx'))
const Visas = lazy(() => import('./pages/Visas.jsx'))
const HajjUmrah = lazy(() => import('./pages/HajjUmrah.jsx'))
const Offers = lazy(() => import('./pages/Offers.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const AdminLogin = lazy(() => import('./pages/admin/Login.jsx'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'))
const Requests = lazy(() => import('./pages/admin/Requests.jsx'))
const RequestDetails = lazy(() => import('./pages/admin/RequestDetails.jsx'))
const AdminTrips = lazy(() => import('./pages/admin/Trips.jsx'))
const TripForm = lazy(() => import('./pages/admin/TripForm.jsx'))
const AdminVisas = lazy(() => import('./pages/admin/Visas.jsx'))
const AdminOffers = lazy(() => import('./pages/admin/Offers.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Spinner fullscreen />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/visas" element={<Visas />} />
            <Route path="/hajj-umrah" element={<HajjUmrah />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:type/:id" element={<RequestDetails />} />
            <Route path="trips" element={<AdminTrips />} />
            <Route path="trips/new" element={<TripForm />} />
            <Route path="trips/:id/edit" element={<TripForm />} />
            <Route path="visas" element={<AdminVisas />} />
            <Route path="offers" element={<AdminOffers />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}
