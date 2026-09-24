import { useEffect, useState } from 'react'
import Hero from '../components/home/Hero.jsx'
import Services from '../components/home/Services.jsx'
import FeaturedTrips from '../components/home/FeaturedTrips.jsx'
import ExclusiveOffers from '../components/home/ExclusiveOffers.jsx'
import WhyDiala from '../components/home/WhyDiala.jsx'
import BookingSteps from '../components/home/BookingSteps.jsx'
import Destinations from '../components/home/Destinations.jsx'
import HajjUmrahSection from '../components/home/HajjUmrahSection.jsx'
import Team from '../components/home/Team.jsx'
import InstagramSection from '../components/home/InstagramSection.jsx'
import ContactStrip from '../components/home/ContactStrip.jsx'
import { fetchTrips, fetchOffers } from '../lib/data'

export default function Home() {
  const [trips, setTrips] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'ديالا للسياحة والسفر | DIALA Tourism & Travel - طرطوس'
    Promise.allSettled([fetchTrips(), fetchOffers()])
      .then(([t, o]) => {
        setTrips(t.status === 'fulfilled' ? t.value : [])
        setOffers(o.status === 'fulfilled' ? o.value.filter((x) => x.offer_type === 'FLIGHT' && x.is_active) : [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-app pt-4">
      <Hero />
      <Services />
      <FeaturedTrips trips={trips} loading={loading} />
      <ExclusiveOffers offers={offers} />
      <Destinations />
      <HajjUmrahSection />
      <WhyDiala />
      <BookingSteps />
      <Team />
      <InstagramSection />
      <ContactStrip />
    </div>
  )
}
