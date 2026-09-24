import { supabase } from './supabase'

// ---------- عام (للزوار) ----------

export async function fetchTrips({ filters = {} } = {}) {
  let q = supabase.from('trips').select('*').eq('status', 'PUBLISHED').order('start_date', { ascending: true })
  if (filters.destination) q = q.eq('destination', filters.destination)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function fetchTripById(id) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_gallery(*), trip_itinerary(*)')
    .eq('id', id)
    .eq('status', 'PUBLISHED')
    .single()
  if (error) throw error
  return data
}

export async function fetchOffers({ onlyActive = true } = {}) {
  let q = supabase.from('offers').select('*').order('created_at', { ascending: false })
  if (onlyActive) q = q.eq('is_active', true)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

export async function fetchVisas({ onlyActive = true } = {}) {
  let q = supabase.from('visas').select('*').order('country')
  if (onlyActive) q = q.eq('is_active', true)
  const { data, error } = await q
  if (error) throw error
  return data || []
}

// ---------- إرسال الطلبات (عامة) ----------

export async function createTripBooking({ customer_name, phone, travelers, trip_id, notes }) {
  const { error } = await supabase
    .from('booking_requests')
    .insert({ customer_name, phone, travelers: Number(travelers) || 1, trip_id: trip_id || null, notes: notes || null })
  if (error) throw error
}

export async function createFlightBooking(payload) {
  const { error } = await supabase.from('flight_requests').insert({
    customer_name: payload.customer_name,
    phone: payload.phone,
    trip_type: payload.trip_type,
    from_city: payload.from_city,
    to_city: payload.to_city,
    depart_date: payload.depart_date || null,
    return_date: payload.trip_type === 'ROUND_TRIP' ? payload.return_date || null : null,
    passengers: Number(payload.passengers) || 1,
    cabin_class: payload.cabin_class,
    notes: payload.notes || null,
  })
  if (error) throw error
}

export async function createVisaRequest({ customer_name, phone, country, visa_type, persons, notes }) {
  const { error } = await supabase
    .from('visa_requests')
    .insert({ customer_name, phone, country, visa_type, persons: Number(persons) || 1, notes: notes || null })
  if (error) throw error
}

export async function createContactMessage({ name, phone, message }) {
  const { error } = await supabase.from('contact_messages').insert({ name, phone, message })
  if (error) throw error
}

// ---------- لوحة التحكم (للأدمن) ----------

const REQUEST_TABLES = {
  TRIP_BOOKING: 'booking_requests',
  FLIGHT_BOOKING: 'flight_requests',
  VISA_REQUEST: 'visa_requests',
  GENERAL_INQUIRY: 'contact_messages',
}

export function requestTable(type) {
  return REQUEST_TABLES[type]
}

export async function fetchUnifiedRequests({ search = '', type = '', status = '', ascending = false, from = 0, to = 19 } = {}) {
  let q = supabase
    .from('requests_unified')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending })
    .range(from, to)
  if (type) q = q.eq('request_type', type)
  if (status) q = q.eq('status', status)
  if (search) q = q.or(`customer_name.ilike.%${search}%,phone.ilike.%${search}%`)
  const { data, error, count } = await q
  if (error) throw error
  return { rows: data || [], count: count || 0 }
}

export async function fetchRequestByType(type, id) {
  const table = REQUEST_TABLES[type]
  if (!table) throw new Error('نوع طلب غير معروف')
  let q = supabase.from(table).select('*').eq('id', id)
  if (table === 'booking_requests') q = supabase.from(table).select('*, trips(title, destination, main_image_url)').eq('id', id)
  const { data, error } = await q.single()
  if (error) throw error
  return data
}

export async function updateRequestStatus(type, id, newStatus) {
  const table = REQUEST_TABLES[type]
  if (!table) throw new Error('نوع طلب غير معروف')
  const { data: old } = await supabase.from(table).select('status').eq('id', id).single()
  const { error } = await supabase.from(table).update({ status: newStatus }).eq('id', id)
  if (error) throw error
  await supabase.from('request_events').insert({
    request_type: type,
    request_id: id,
    old_status: old?.status || null,
    new_status: newStatus,
  })
}

export async function fetchRequestEvents(type, id) {
  const { data, error } = await supabase
    .from('request_events')
    .select('*')
    .eq('request_type', type)
    .eq('request_id', id)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

// ---- إدارة الرحلات ----

export async function adminFetchTrips() {
  const { data, error } = await supabase.from('trips').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function adminFetchTripFull(id) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, trip_gallery(*), trip_itinerary(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function adminSaveTrip({ trip, gallery, itinerary }, id = null) {
  let tripId = id
  if (id) {
    const { error } = await supabase.from('trips').update(trip).eq('id', id)
    if (error) throw error
  } else {
    const { data, error } = await supabase.from('trips').insert(trip).select('id').single()
    if (error) throw error
    tripId = data.id
  }
  await supabase.from('trip_gallery').delete().eq('trip_id', tripId)
  await supabase.from('trip_itinerary').delete().eq('trip_id', tripId)
  const galleryRows = (gallery || []).filter((g) => g.image_url).map((g, i) => ({ trip_id: tripId, image_url: g.image_url, sort_order: i }))
  if (galleryRows.length) {
    const { error } = await supabase.from('trip_gallery').insert(galleryRows)
    if (error) throw error
  }
  const itineraryRows = (itinerary || [])
    .filter((r) => r.title || r.description)
    .map((r, i) => ({ trip_id: tripId, day_number: Number(r.day_number) || i + 1, title: r.title || '', description: r.description || '' }))
    .sort((a, b) => a.day_number - b.day_number)
  if (itineraryRows.length) {
    const { error } = await supabase.from('trip_itinerary').insert(itineraryRows)
    if (error) throw error
  }
  return tripId
}

export async function adminDeleteTrip(id) {
  const { error } = await supabase.from('trips').delete().eq('id', id)
  if (error) throw error
}

export async function adminToggleTrip(trip) {
  const status = trip.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  const { error } = await supabase.from('trips').update({ status }).eq('id', trip.id)
  if (error) throw error
  return status
}

// ---- إدارة التأشيرات ----

export async function adminFetchVisas() {
  const { data, error } = await supabase.from('visas').select('*').order('country')
  if (error) throw error
  return data || []
}

export async function adminSaveVisa(visa, id = null) {
  if (id) {
    const { error } = await supabase.from('visas').update(visa).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('visas').insert(visa)
    if (error) throw error
  }
}

export async function adminDeleteVisa(id) {
  const { error } = await supabase.from('visas').delete().eq('id', id)
  if (error) throw error
}

// ---- إدارة العروض ----

export async function adminFetchOffers() {
  const { data, error } = await supabase.from('offers').select('*, trips(title)').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function adminSaveOffer(offer, id = null) {
  if (id) {
    const { error } = await supabase.from('offers').update(offer).eq('id', id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('offers').insert(offer)
    if (error) throw error
  }
}

export async function adminDeleteOffer(id) {
  const { error } = await supabase.from('offers').delete().eq('id', id)
  if (error) throw error
}

// ---- الإشعارات ----

export async function fetchNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)
  if (error) throw error
  return data || []
}

export async function markNotificationRead(id) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead() {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
  if (error) throw error
}
