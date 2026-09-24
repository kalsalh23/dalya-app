-- =============================================================
-- DIALA Tourism & Travel — Schema (tables, functions, triggers)
-- =============================================================
create extension if not exists pgcrypto;

-- ---------- Enums ----------
do $$ begin
  create type public.request_status as enum
    ('NEW','CONTACTED','IN_PROGRESS','CONFIRMED','COMPLETED','CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.request_type as enum
    ('TRIP_BOOKING','FLIGHT_BOOKING','VISA_REQUEST','GENERAL_INQUIRY');
exception when duplicate_object then null; end $$;

-- ---------- updated_at helper ----------
create or replace function public.fn_set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('admin','staff','customer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-create profile on signup (future customer accounts)
create or replace function public.fn_handle_new_user() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'customer'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.fn_handle_new_user();

-- ---------- staff helper ----------
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','staff')
  );
$$;

-- ---------- Trips ----------
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  main_image_url text,
  start_date date,
  end_date date,
  duration_days int,
  price numeric(12,2),
  available_seats int,
  short_description text,
  description text,
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  notes text,
  status text not null default 'PUBLISHED' check (status in ('PUBLISHED','DRAFT')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_gallery (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_itinerary (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number int not null,
  title text,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- Visas ----------
create table if not exists public.visas (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  flag text,
  visa_type text not null,
  processing_time text,
  requirements text[] not null default '{}',
  price numeric(12,2),
  notes text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Offers ----------
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  offer_type text not null default 'SEASONAL' check (offer_type in ('FLIGHT','TRIP','DISCOUNT','SEASONAL')),
  destination text,
  old_price numeric(12,2),
  new_price numeric(12,2),
  start_date date,
  end_date date,
  is_active boolean not null default true,
  trip_id uuid references public.trips(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Requests ----------
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  travelers int not null default 1,
  trip_id uuid references public.trips(id) on delete set null,
  notes text,
  status public.request_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flight_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  trip_type text not null default 'ONE_WAY' check (trip_type in ('ONE_WAY','ROUND_TRIP')),
  from_city text,
  to_city text,
  depart_date date,
  return_date date,
  passengers int not null default 1,
  cabin_class text not null default 'ECONOMY' check (cabin_class in ('ECONOMY','BUSINESS','FIRST')),
  notes text,
  status public.request_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visa_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  country text,
  visa_type text,
  persons int not null default 1,
  notes text,
  status public.request_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  message text,
  status public.request_status not null default 'NEW',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Notifications & events ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  title text not null,
  body text,
  request_type public.request_type,
  request_id uuid,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_type public.request_type not null,
  request_id uuid not null,
  old_status public.request_status,
  new_status public.request_status not null,
  note text,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- ---------- unified requests view ----------
create or replace view public.requests_unified as
  select 'TRIP_BOOKING'::public.request_type as request_type,
         b.id, b.customer_name, b.phone, b.status, b.created_at,
         jsonb_build_object('travelers', b.travelers, 'trip_id', b.trip_id, 'notes', b.notes) as details
  from public.booking_requests b
  union all
  select 'FLIGHT_BOOKING'::public.request_type,
         f.id, f.customer_name, f.phone, f.status, f.created_at,
         jsonb_build_object('trip_type', f.trip_type, 'from_city', f.from_city, 'to_city', f.to_city,
                            'depart_date', f.depart_date, 'return_date', f.return_date,
                            'passengers', f.passengers, 'cabin_class', f.cabin_class, 'notes', f.notes)
  from public.flight_requests f
  union all
  select 'VISA_REQUEST'::public.request_type,
         v.id, v.customer_name, v.phone, v.status, v.created_at,
         jsonb_build_object('country', v.country, 'visa_type', v.visa_type, 'persons', v.persons, 'notes', v.notes)
  from public.visa_requests v
  union all
  select 'GENERAL_INQUIRY'::public.request_type,
         c.id, c.name, c.phone, c.status, c.created_at,
         jsonb_build_object('message', c.message)
  from public.contact_messages c;

alter view public.requests_unified set (security_invoker = true);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','trips','visas','offers',
    'booking_requests','flight_requests','visa_requests','contact_messages'
  ]
  loop
    execute format('drop trigger if exists trg_%1$s_updated on public.%1$I', t);
    execute format('create trigger trg_%1$s_updated before update on public.%1$I
                    for each row execute function public.fn_set_updated_at()', t);
  end loop;
end $$;

-- ---------- notification: new request ----------
create or replace function public.fn_notify_new_request() returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_type  public.request_type;
  v_title text;
  v_body  text;
begin
  case TG_TABLE_NAME
    when 'booking_requests' then
      v_type := 'TRIP_BOOKING';
      v_title := 'طلب حجز رحلة جديد';
      v_body := 'العميل: ' || new.customer_name || ' | الهاتف: ' || coalesce(new.phone, '-');
    when 'flight_requests' then
      v_type := 'FLIGHT_BOOKING';
      v_title := 'طلب حجز تذكرة طيران جديد';
      v_body := 'العميل: ' || new.customer_name
              || ' | المسار: ' || coalesce(new.from_city, '-') || ' ← ' || coalesce(new.to_city, '-')
              || ' | الهاتف: ' || coalesce(new.phone, '-');
    when 'visa_requests' then
      v_type := 'VISA_REQUEST';
      v_title := 'طلب تأشيرة جديد';
      v_body := 'العميل: ' || new.customer_name
              || ' | الدولة: ' || coalesce(new.country, '-')
              || ' | الهاتف: ' || coalesce(new.phone, '-');
    else
      v_type := 'GENERAL_INQUIRY';
      v_title := 'رسالة تواصل جديدة';
      v_body := 'العميل: ' || new.name || ' | الهاتف: ' || coalesce(new.phone, '-');
  end case;

  insert into public.notifications (type, title, body, request_type, request_id)
  values ('NEW_REQUEST', v_title, v_body, v_type, new.id);
  return new;
end $$;

drop trigger if exists trg_notify_trip    on public.booking_requests;
drop trigger if exists trg_notify_flight  on public.flight_requests;
drop trigger if exists trg_notify_visa    on public.visa_requests;
drop trigger if exists trg_notify_contact on public.contact_messages;

create trigger trg_notify_trip    after insert on public.booking_requests  for each row execute function public.fn_notify_new_request();
create trigger trg_notify_flight  after insert on public.flight_requests   for each row execute function public.fn_notify_new_request();
create trigger trg_notify_visa    after insert on public.visa_requests     for each row execute function public.fn_notify_new_request();
create trigger trg_notify_contact after insert on public.contact_messages  for each row execute function public.fn_notify_new_request();

-- ---------- notification: status changed ----------
create or replace function public.fn_notify_status_change() returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.status is distinct from old.status then
    insert into public.notifications (type, title, body, request_type, request_id)
    values (
      'STATUS_CHANGED',
      'تحديث حالة طلب',
      'حالة الطلب رقم ' || left(new.id::text, 8) || ' تغيرت من ' || old.status::text || ' إلى ' || new.status::text,
      (case TG_TABLE_NAME
        when 'booking_requests' then 'TRIP_BOOKING'
        when 'flight_requests'  then 'FLIGHT_BOOKING'
        when 'visa_requests'    then 'VISA_REQUEST'
        else 'GENERAL_INQUIRY'
      end)::public.request_type,
      new.id
    );
  end if;
  return new;
end $$;

drop trigger if exists trg_status_trip    on public.booking_requests;
drop trigger if exists trg_status_flight  on public.flight_requests;
drop trigger if exists trg_status_visa    on public.visa_requests;
drop trigger if exists trg_status_contact on public.contact_messages;

create trigger trg_status_trip    after update on public.booking_requests  for each row execute function public.fn_notify_status_change();
create trigger trg_status_flight  after update on public.flight_requests   for each row execute function public.fn_notify_status_change();
create trigger trg_status_visa    after update on public.visa_requests     for each row execute function public.fn_notify_status_change();
create trigger trg_status_contact after update on public.contact_messages  for each row execute function public.fn_notify_status_change();

-- ---------- indexes ----------
create index if not exists idx_trips_status      on public.trips(status);
create index if not exists idx_gallery_trip      on public.trip_gallery(trip_id);
create index if not exists idx_itinerary_trip    on public.trip_itinerary(trip_id);
create index if not exists idx_notif_read        on public.notifications(is_read);
create index if not exists idx_notif_created     on public.notifications(created_at desc);
create index if not exists idx_booking_created   on public.booking_requests(created_at desc);
create index if not exists idx_flight_created    on public.flight_requests(created_at desc);
create index if not exists idx_visa_req_created  on public.visa_requests(created_at desc);

-- ---------- storage bucket ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- ---------- realtime ----------
do $$ begin alter publication supabase_realtime add table public.notifications;      exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.booking_requests;   exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.flight_requests;    exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.visa_requests;      exception when others then null; end $$;
do $$ begin alter publication supabase_realtime add table public.contact_messages;   exception when others then null; end $$;

-- ---------- grants ----------
grant select on public.requests_unified to authenticated;
grant execute on function public.is_staff() to anon, authenticated;
