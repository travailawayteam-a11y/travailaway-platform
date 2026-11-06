
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

type Listing = {
  id: string
  title: string
  description: string
  category: string
  country: string
  city: string
  accommodation: string | null
  meals: string | null
  images: string[] | null
  continent: string | null
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('destination') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadListings() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('listings')
        .select('id, title, description, category, country, city, accommodation, meals, images, continent')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error) {
        setError('We could not load opportunities right now. Please try again.')
      } else {
        setListings((data || []) as Listing[])
      }

      setLoading(false)
    }

    loadListings()
  }, [])

  const filteredListings = listings.filter((listing) => {
    const term = search.toLowerCase().trim()
    const matchesSearch = !term || [
      listing.title,
      listing.country,
      listing.city,
      listing.continent,
      listing.description,
    ].some((value) => value?.toLowerCase().includes(term))

    const matchesCategory = !category || listing.category === category

    return matchesSearch && matchesCategory
  })

  const categories = Array.from(
    new Set(listings.map((listing) => listing.category).filter(Boolean))
  )

  return (
    <main className="min-h-screen bg-[#f8faf7] text-[#183b2b]">
      <header className="border-b border-[#e5ebe5] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Travail<span className="text-[#6b9b68]">Away</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/" className="hover:text-[#6b9b68]">Home</Link>
            <Link href="/login" className="hover:text-[#6b9b68]">Log in</Link>
            <Link href="/register" className="rounded-full bg-[#244d37] px-5 py-2.5 text-white hover:bg-[#183b2b]">
              Join us
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#eaf2e8] px-5 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#668a61]">
          Discover · Connect · Experience
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          Find your next meaningful adventure
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-[#587060] md:text-lg">
          Explore opportunities around the world, meet welcoming hosts and
          experience life in a new way.
        </p>

        <div className="mx-auto mt-9 flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm md:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Where would you like to go?"
            className="min-w-0 flex-1 rounded-xl border border-[#e5ebe5] px-4 py-3 outline-none focus:border-[#6b9b68]"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-[#e5ebe5] bg-white px-4 py-3 outline-none focus:border-[#6b9b68]"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearch('')
              setCategory('')
            }}
            className="rounded-xl bg-[#244d37] px-6 py-3 font-semibold text-white hover:bg-[#183b2b]"
          >
            Clear filters
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#78917c]">TRAVAILAWAY MARKETPLACE</p>
            <h2 className="mt-1 text-2xl font-bold">Explore opportunities</h2>
          </div>
          <p className="text-sm text-[#718477]">
            {filteredListings.length} {filteredListings.length === 1 ? 'opportunity' : 'opportunities'} found
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <p className="text-[#668a61]">Finding opportunities for you...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#244d37] px-5 py-2 text-white"
            >
              Try again
            </button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd9ca] bg-white px-6 py-16 text-center">
            <div className="text-5xl">🌍</div>
            <h3 className="mt-5 text-xl font-bold">Your next adventure starts here</h3>
            <p className="mx-auto mt-3 max-w-lg text-[#718477]">
              {listings.length === 0
                ? 'There are no published opportunities yet. We are getting ready for our first hosts!'
                : 'No opportunities match those filters. Try another destination or category.'}
            </p>
            <button
              onClick={() => {
                setSearch('')
                setCategory('')
              }}
              className="mt-6 rounded-full bg-[#244d37] px-6 py-3 font-semibold text-white"
            >
              Explore all opportunities
            </button>
            <p className="mt-5 text-sm text-[#718477]">
              Are you a host?{' '}
              <Link href="/register?type=host" className="font-semibold text-[#47784b] underline">
                Share an opportunity
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <article
                key={listing.id}
                className="overflow-hidden rounded-2xl border border-[#e5ebe5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-52 bg-[#eaf2e8]">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">🌿</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#78917c]">
                    {listing.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold">{listing.title}</h3>
                  <p className="mt-2 text-sm text-[#718477]">
                    📍 {listing.city ? `${listing.city}, ` : ''}{listing.country}
                  </p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#587060]">
                    {listing.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs">
                    {listing.accommodation && (
                      <span className="rounded-full bg-[#edf4eb] px-3 py-1.5">
                        🏡 {listing.accommodation}
                      </span>
                    )}
                    {listing.meals && (
                      <span className="rounded-full bg-[#edf4eb] px-3 py-1.5">
                        🍽️ {listing.meals}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/opportunities/${listing.id}`}
                    className="mt-5 block rounded-full bg-[#244d37] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#183b2b]"
                  >
                    View opportunity
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[#e5ebe5] bg-white px-5 py-8 text-center text-sm text-[#718477]">
        © {new Date().getFullYear()} TravailAway. Discover the world through meaningful connections.
      </footer>
    </main>
  )
}
