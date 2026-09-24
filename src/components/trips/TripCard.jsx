import { Link } from 'react-router-dom'
import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { fmtDateRange, fmtPrice } from '../../lib/utils'
import { ImageFallback, Stars } from '../ui/misc.jsx'

/** بطاقة رحلة بنمط بطاقة المنتج في renad1 */
export default function TripCard({ trip }) {
  const lowSeats = (trip.available_seats ?? 0) > 0 && trip.available_seats <= 5

  return (
    <div className="card group relative overflow-hidden !rounded-3xl">
      <Link to={`/trips/${trip.id}`} className="block" aria-label={trip.title}>
        <div className="relative aspect-[4/3] overflow-hidden bg-chip">
          <ImageFallback
            src={trip.main_image_url}
            alt={trip.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-105"
          />

          {trip.destination && (
            <span className="absolute start-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-ink backdrop-blur">
              <MapPin className="h-3 w-3 text-plum" />
              {trip.destination}
            </span>
          )}
          {lowSeats && (
            <span className="absolute start-2.5 top-10 rounded-full bg-rose px-2.5 py-1 text-[10px] font-bold text-white">
              آخر {trip.available_seats} مقاعد
            </span>
          )}
        </div>

        <div className="p-3 text-center">
          <h3 className="truncate text-sm font-extrabold text-ink">{trip.title}</h3>
          <p className="mt-0.5 flex items-center justify-center gap-3 text-[11px] text-smoke">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {fmtDateRange(trip.start_date, trip.end_date)}
            </span>
            {trip.duration_days && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {trip.duration_days} يوم
              </span>
            )}
            {trip.available_seats > 0 && !lowSeats && (
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                {trip.available_seats}
              </span>
            )}
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-1.5">
            <Stars className="text-[11px]" />
            <span className="text-sm font-black text-plum">{fmtPrice(trip.price)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
