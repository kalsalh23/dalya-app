import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal.js'
import TripCard from '../trips/TripCard.jsx'
import { CardSkeletonGrid } from '../ui/Loader.jsx'
import { EmptyState, SectionRow } from '../ui/misc.jsx'
import { MapPinned } from 'lucide-react'

export default function FeaturedTrips({ trips, loading }) {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-8">
      <SectionRow
        title="رحلات مميزة"
        action={
          trips.length > 0 ? (
            <Link to="/trips" className="flex items-center gap-1 text-xs font-bold text-plum">
              كل الرحلات
            </Link>
          ) : null
        }
      />
      {loading ? (
        <CardSkeletonGrid count={4} />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="لا توجد رحلات منشورة حالياً"
          subtitle="تابعنا قريباً — نضيف رحلات وعروضاً جديدة باستمرار."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {trips.slice(0, 4).map((t, i) => (
            <div key={t.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <TripCard trip={t} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
