-- =============================================================
-- DIALA Tourism & Travel — Row Level Security policies
-- =============================================================

alter table public.profiles         enable row level security;
alter table public.trips            enable row level security;
alter table public.trip_gallery     enable row level security;
alter table public.trip_itinerary   enable row level security;
alter table public.visas            enable row level security;
alter table public.offers           enable row level security;
alter table public.booking_requests enable row level security;
alter table public.flight_requests  enable row level security;
alter table public.visa_requests    enable row level security;
alter table public.contact_messages enable row level security;
alter table public.notifications    enable row level security;
alter table public.request_events   enable row level security;

-- ---------- profiles ----------
drop policy if exists p_profiles_select on public.profiles;
create policy p_profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());

drop policy if exists p_profiles_self_update on public.profiles;
create policy p_profiles_self_update on public.profiles for update to authenticated
  using (id = auth.uid() and not public.is_staff())
  with check (id = auth.uid() and role = 'customer');

drop policy if exists p_profiles_staff_update on public.profiles;
create policy p_profiles_staff_update on public.profiles for update to authenticated
  using (public.is_staff());

-- ---------- trips ----------
drop policy if exists p_trips_select on public.trips;
create policy p_trips_select on public.trips for select
  using (status = 'PUBLISHED' or public.is_staff());

drop policy if exists p_trips_insert on public.trips;
create policy p_trips_insert on public.trips for insert to authenticated
  with check (public.is_staff());

drop policy if exists p_trips_update on public.trips;
create policy p_trips_update on public.trips for update to authenticated
  using (public.is_staff());

drop policy if exists p_trips_delete on public.trips;
create policy p_trips_delete on public.trips for delete to authenticated
  using (public.is_staff());

-- ---------- trip_gallery / trip_itinerary ----------
drop policy if exists p_gallery_select on public.trip_gallery;
create policy p_gallery_select on public.trip_gallery for select
  using (
    public.is_staff()
    or exists (select 1 from public.trips t where t.id = trip_id and t.status = 'PUBLISHED')
  );

drop policy if exists p_gallery_write on public.trip_gallery;
create policy p_gallery_write on public.trip_gallery for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists p_itinerary_select on public.trip_itinerary;
create policy p_itinerary_select on public.trip_itinerary for select
  using (
    public.is_staff()
    or exists (select 1 from public.trips t where t.id = trip_id and t.status = 'PUBLISHED')
  );

drop policy if exists p_itinerary_write on public.trip_itinerary;
create policy p_itinerary_write on public.trip_itinerary for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- ---------- visas ----------
drop policy if exists p_visas_select on public.visas;
create policy p_visas_select on public.visas for select
  using (is_active or public.is_staff());

drop policy if exists p_visas_insert on public.visas;
create policy p_visas_insert on public.visas for insert to authenticated
  with check (public.is_staff());

drop policy if exists p_visas_update on public.visas;
create policy p_visas_update on public.visas for update to authenticated
  using (public.is_staff());

drop policy if exists p_visas_delete on public.visas;
create policy p_visas_delete on public.visas for delete to authenticated
  using (public.is_staff());

-- ---------- offers ----------
drop policy if exists p_offers_select on public.offers;
create policy p_offers_select on public.offers for select
  using (is_active or public.is_staff());

drop policy if exists p_offers_insert on public.offers;
create policy p_offers_insert on public.offers for insert to authenticated
  with check (public.is_staff());

drop policy if exists p_offers_update on public.offers;
create policy p_offers_update on public.offers for update to authenticated
  using (public.is_staff());

drop policy if exists p_offers_delete on public.offers;
create policy p_offers_delete on public.offers for delete to authenticated
  using (public.is_staff());

-- ---------- customer request tables (public insert, staff manage) ----------
drop policy if exists p_booking_insert on public.booking_requests;
create policy p_booking_insert on public.booking_requests for insert to anon, authenticated
  with check (true);
drop policy if exists p_booking_select on public.booking_requests;
create policy p_booking_select on public.booking_requests for select to authenticated
  using (public.is_staff());
drop policy if exists p_booking_update on public.booking_requests;
create policy p_booking_update on public.booking_requests for update to authenticated
  using (public.is_staff());
drop policy if exists p_booking_delete on public.booking_requests;
create policy p_booking_delete on public.booking_requests for delete to authenticated
  using (public.is_staff());

drop policy if exists p_flight_insert on public.flight_requests;
create policy p_flight_insert on public.flight_requests for insert to anon, authenticated
  with check (true);
drop policy if exists p_flight_select on public.flight_requests;
create policy p_flight_select on public.flight_requests for select to authenticated
  using (public.is_staff());
drop policy if exists p_flight_update on public.flight_requests;
create policy p_flight_update on public.flight_requests for update to authenticated
  using (public.is_staff());
drop policy if exists p_flight_delete on public.flight_requests;
create policy p_flight_delete on public.flight_requests for delete to authenticated
  using (public.is_staff());

drop policy if exists p_visa_req_insert on public.visa_requests;
create policy p_visa_req_insert on public.visa_requests for insert to anon, authenticated
  with check (true);
drop policy if exists p_visa_req_select on public.visa_requests;
create policy p_visa_req_select on public.visa_requests for select to authenticated
  using (public.is_staff());
drop policy if exists p_visa_req_update on public.visa_requests;
create policy p_visa_req_update on public.visa_requests for update to authenticated
  using (public.is_staff());
drop policy if exists p_visa_req_delete on public.visa_requests;
create policy p_visa_req_delete on public.visa_requests for delete to authenticated
  using (public.is_staff());

drop policy if exists p_contact_insert on public.contact_messages;
create policy p_contact_insert on public.contact_messages for insert to anon, authenticated
  with check (true);
drop policy if exists p_contact_select on public.contact_messages;
create policy p_contact_select on public.contact_messages for select to authenticated
  using (public.is_staff());
drop policy if exists p_contact_update on public.contact_messages;
create policy p_contact_update on public.contact_messages for update to authenticated
  using (public.is_staff());
drop policy if exists p_contact_delete on public.contact_messages;
create policy p_contact_delete on public.contact_messages for delete to authenticated
  using (public.is_staff());

-- ---------- notifications / request_events (staff only) ----------
drop policy if exists p_notif_select on public.notifications;
create policy p_notif_select on public.notifications for select to authenticated
  using (public.is_staff());
drop policy if exists p_notif_update on public.notifications;
create policy p_notif_update on public.notifications for update to authenticated
  using (public.is_staff());
drop policy if exists p_notif_delete on public.notifications;
create policy p_notif_delete on public.notifications for delete to authenticated
  using (public.is_staff());

drop policy if exists p_events_select on public.request_events;
create policy p_events_select on public.request_events for select to authenticated
  using (public.is_staff());
drop policy if exists p_events_insert on public.request_events;
create policy p_events_insert on public.request_events for insert to authenticated
  with check (public.is_staff());

-- ---------- storage: media bucket ----------
drop policy if exists p_media_public_read on storage.objects;
create policy p_media_public_read on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists p_media_staff_insert on storage.objects;
create policy p_media_staff_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff());

drop policy if exists p_media_staff_update on storage.objects;
create policy p_media_staff_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff());

drop policy if exists p_media_staff_delete on storage.objects;
create policy p_media_staff_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.is_staff());
