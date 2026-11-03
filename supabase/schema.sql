

-- =====================================================
-- TRAVAILAWAY DATABASE
-- Molongi Investments Company SMC Limited
-- =====================================================

create extension if not exists pgcrypto;

-- 1. USER PROFILES
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  account_type text not null default 'traveller'
    check (account_type in ('traveller', 'host')),
  avatar_url text,
  country text,
  city text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Automatically create a profile when someone registers.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    account_type
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when new.raw_user_meta_data ->> 'account_type' = 'host'
        then 'host'
      else 'traveller'
    end
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


-- 2. HOST OPPORTUNITIES
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  country text not null,
  city text,
  accommodation text,
  meals text,
  hours_per_week integer,
  min_stay_weeks integer,
  max_stay_weeks integer,
  skills text[] not null default '{}',
  benefits text[] not null default '{}',
  images text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- 3. TRAVELLER APPLICATIONS
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  traveller_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, traveller_id)
);


-- 4. SAVED OPPORTUNITIES
create table if not exists public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);


-- 5. CONVERSATIONS
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  traveller_id uuid not null references public.profiles(id) on delete cascade,
  host_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (listing_id, traveller_id, host_id),
  check (traveller_id <> host_id)
);


-- 6. MESSAGES
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);


-- 7. REVIEWS
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  check (reviewer_id <> reviewee_id)
);


-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists listings_host_id_idx
  on public.listings(host_id);

create index if not exists listings_country_idx
  on public.listings(country);

create index if not exists listings_status_idx
  on public.listings(status);

create index if not exists applications_listing_id_idx
  on public.applications(listing_id);

create index if not exists applications_traveller_id_idx
  on public.applications(traveller_id);

create index if not exists favourites_user_id_idx
  on public.favourites(user_id);

create index if not exists conversations_traveller_id_idx
  on public.conversations(traveller_id);

create index if not exists conversations_host_id_idx
  on public.conversations(host_id);

create index if not exists messages_conversation_id_idx
  on public.messages(conversation_id);

create index if not exists reviews_reviewee_id_idx
  on public.reviews(reviewee_id);


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.applications enable row level security;
alter table public.favourites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;


-- PROFILES: public profile information only
drop policy if exists "Public profiles are viewable" on public.profiles;
create policy "Public profiles are viewable"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);


-- LISTINGS: visitors see published opportunities;
-- hosts manage their own listings.
drop policy if exists "Published listings are public" on public.listings;
create policy "Published listings are public"
on public.listings for select
to anon, authenticated
using (
  status = 'published'
  or host_id = (select auth.uid())
);

drop policy if exists "Hosts create their own listings" on public.listings;
create policy "Hosts create their own listings"
on public.listings for insert
to authenticated
with check (
  host_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and account_type = 'host'
  )
);

drop policy if exists "Hosts update their own listings" on public.listings;
create policy "Hosts update their own listings"
on public.listings for update
to authenticated
using (host_id = (select auth.uid()))
with check (host_id = (select auth.uid()));

drop policy if exists "Hosts delete their own listings" on public.listings;
create policy "Hosts delete their own listings"
on public.listings for delete
to authenticated
using (host_id = (select auth.uid()));


-- APPLICATIONS: applicants and relevant hosts can view.
drop policy if exists "Applicants and hosts view applications" on public.applications;
create policy "Applicants and hosts view applications"
on public.applications for select
to authenticated
using (
  traveller_id = (select auth.uid())
  or exists (
    select 1 from public.listings
    where listings.id = applications.listing_id
      and listings.host_id = (select auth.uid())
  )
);

drop policy if exists "Travellers apply to published listings" on public.applications;
create policy "Travellers apply to published listings"
on public.applications for insert
to authenticated
with check (
  traveller_id = (select auth.uid())
  and exists (
    select 1 from public.listings
    where listings.id = applications.listing_id
      and listings.status = 'published'
  )
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and account_type = 'traveller'
  )
);

drop policy if exists "Applicants and hosts update applications" on public.applications;
create policy "Applicants and hosts update applications"
on public.applications for update
to authenticated
using (
  traveller_id = (select auth.uid())
  or exists (
    select 1 from public.listings
    where listings.id = applications.listing_id
      and listings.host_id = (select auth.uid())
  )
)
with check (
  traveller_id = (select auth.uid())
  or exists (
    select 1 from public.listings
    where listings.id = applications.listing_id
      and listings.host_id = (select auth.uid())
  )
);


-- FAVOURITES: each user manages their own saved listings.
drop policy if exists "Users view their favourites" on public.favourites;
create policy "Users view their favourites"
on public.favourites for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users save favourites" on public.favourites;
create policy "Users save favourites"
on public.favourites for insert
to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users remove favourites" on public.favourites;
create policy "Users remove favourites"
on public.favourites for delete
to authenticated
using (user_id = (select auth.uid()));


-- CONVERSATIONS: only the two participants can access.
drop policy if exists "Participants view conversations" on public.conversations;
create policy "Participants view conversations"
on public.conversations for select
to authenticated
using (
  traveller_id = (select auth.uid())
  or host_id = (select auth.uid())
);

drop policy if exists "Travellers start conversations" on public.conversations;
create policy "Travellers start conversations"
on public.conversations for insert
to authenticated
with check (
  traveller_id = (select auth.uid())
  and exists (
    select 1 from public.listings
    where listings.id = conversations.listing_id
      and listings.host_id = conversations.host_id
      and listings.status = 'published'
  )
);


-- MESSAGES: only conversation participants can read or send.
drop policy if exists "Participants view messages" on public.messages;
create policy "Participants view messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (
        conversations.traveller_id = (select auth.uid())
        or conversations.host_id = (select auth.uid())
      )
  )
);

drop policy if exists "Participants send messages" on public.messages;
create policy "Participants send messages"
on public.messages for insert
to authenticated
with check (
  sender_id = (select auth.uid())
  and exists (
    select 1 from public.conversations
    where conversations.id = messages.conversation_id
      and (
        conversations.traveller_id = (select auth.uid())
        or conversations.host_id = (select auth.uid())
      )
  )
);


-- REVIEWS: public can read; signed-in users can create
-- a review under their own identity.
drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
on public.reviews for select
to anon, authenticated
using (true);

drop policy if exists "Users create their own reviews" on public.reviews;
create policy "Users create their own reviews"
on public.reviews for insert
to authenticated
with check (
  reviewer_id = (select auth.uid())
);
