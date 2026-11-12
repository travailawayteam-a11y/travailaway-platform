"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const locations: Record<string, Record<string, string[]>> = {
  Africa: {
    "East Africa": ["Uganda", "Kenya", "Tanzania", "Rwanda", "Burundi", "Ethiopia", "South Sudan"],
    "West Africa": ["Ghana", "Nigeria", "Senegal", "The Gambia", "Sierra Leone", "Liberia", "Ivory Coast", "Benin", "Togo"],
    "North Africa": ["Egypt", "Morocco", "Tunisia", "Algeria", "Libya"],
    "Southern Africa": ["South Africa", "Namibia", "Botswana", "Zimbabwe", "Zambia", "Mozambique", "Malawi", "Lesotho", "Eswatini"],
    "Central Africa": ["Cameroon", "DR Congo", "Republic of the Congo", "Gabon", "Chad", "Central African Republic"],
  },
  Europe: {
    "Western Europe": ["France", "Germany", "Netherlands", "Belgium", "Austria", "Switzerland", "Luxembourg"],
    "Northern Europe": ["United Kingdom", "Ireland", "Sweden", "Norway", "Denmark", "Finland", "Iceland"],
    "Southern Europe": ["Spain", "Italy", "Portugal", "Greece", "Croatia", "Malta", "Cyprus"],
    "Eastern Europe": ["Poland", "Romania", "Hungary", "Czech Republic", "Slovakia", "Ukraine", "Bulgaria"],
  },
  Asia: {
    "East Asia": ["China", "Japan", "South Korea", "Mongolia", "Taiwan"],
    "South Asia": ["India", "Pakistan", "Bangladesh", "Nepal", "Sri Lanka", "Maldives", "Bhutan"],
    "Southeast Asia": ["Thailand", "Vietnam", "Indonesia", "Malaysia", "Philippines", "Cambodia", "Laos", "Singapore", "Myanmar"],
    "West Asia": ["United Arab Emirates", "Saudi Arabia", "Qatar", "Jordan", "Israel", "Turkey", "Oman", "Lebanon"],
    "Central Asia": ["Kazakhstan", "Uzbekistan", "Kyrgyzstan", "Tajikistan", "Turkmenistan"],
  },
  "North America": {
    "Northern America": ["United States", "Canada"],
    "Central America": ["Mexico", "Guatemala", "Belize", "Costa Rica", "Panama", "Honduras", "El Salvador", "Nicaragua"],
    Caribbean: ["Jamaica", "Bahamas", "Barbados", "Trinidad and Tobago", "Dominican Republic", "Cuba"],
  },
  "South America": {
    "South America": ["Brazil", "Argentina", "Chile", "Colombia", "Peru", "Ecuador", "Uruguay", "Paraguay", "Bolivia", "Venezuela", "Guyana", "Suriname"],
  },
  Oceania: {
    "Australia and Pacific": ["Australia", "New Zealand", "Fiji", "Papua New Guinea", "Samoa", "Vanuatu", "Tonga"],
  },
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

const labelClass = "mb-2 block text-sm font-semibold text-gray-800";

const MAX_PHOTOS = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PHOTO_SIDE = 1600;
const BUCKET = "opportunity-photos";

type Listing = {
  id: string;
  host_id: string;
  title: string;
  description: string;
  category: string;
  continent: string | null;
  region: string | null;
  country: string;
  city: string | null;
  accommodation: string | null;
  meals: string | null;
  hours_per_week: number | null;
  min_stay_weeks: number | null;
  max_stay_weeks: number | null;
  skills: string[] | null;
  benefits: string[] | null;
  images: string[] | null;
  status: string;
  rejection_reason: string | null;
  host_paused: boolean;
};

// A photo is either one already saved with the listing, or a new one the host just picked.
type PhotoItem = {
  key: string;
  url: string;
  file?: File;
};

const CATEGORIES = [
  ["Accommodation", "Accommodation"],
  ["Farming", "Farming"],
  ["Hospitality", "Hospitality"],
  ["Teaching", "Teaching"],
  ["Community", "Community projects"],
  ["Environment", "Environment"],
  ["Construction", "Construction"],
  ["Other", "Other"],
];

const ACCOMMODATION = ["Private room", "Shared room", "Dormitory", "Camping", "No accommodation"];
const MEALS = ["All meals provided", "Some meals provided", "No meals provided"];

// Stops the form from waiting forever if the connection is very slow.
function withTimeout<T>(promise: PromiseLike<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

// Shrinks big phone photos before uploading so they send quickly on mobile data.
async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82)
    );

    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

// Turns a public photo link back into its path inside the storage bucket.
function storagePathFromUrl(url: string): string | null {
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

export default function EditOpportunityPage() {
  const supabase = createClient();
  const params = useParams<{ id: string }>();
  const listingId = params?.id;

  const [loadingListing, setLoadingListing] = useState(true);
  const [listing, setListing] = useState<Listing | null>(null);
  const [loadError, setLoadError] = useState("");

  const [continent, setContinent] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [coverKey, setCoverKey] = useState("");
  const [removedUrls, setRemovedUrls] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);
  const photosRef = useRef<PhotoItem[]>([]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((item) => {
        if (item.file) URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  useEffect(() => {
    if (savedMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [savedMessage]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!listingId) return;

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (active) {
            setLoadError("Please log in to edit your opportunity.");
            setLoadingListing(false);
          }
          return;
        }

        const { data, error: queryError } = await supabase
          .from("listings")
          .select(
            "id, host_id, title, description, category, continent, region, country, city, accommodation, meals, hours_per_week, min_stay_weeks, max_stay_weeks, skills, benefits, images, status, rejection_reason, host_paused"
          )
          .eq("id", listingId)
          .eq("host_id", user.id)
          .maybeSingle();

        if (!active) return;

        if (queryError) {
          setLoadError("We could not load your opportunity. Please refresh the page.");
        } else if (!data) {
          setLoadError("We could not find this opportunity on your account.");
        } else {
          const found = data as Listing;
          setListing(found);
          setContinent(found.continent ?? "");
          setRegion(found.region ?? "");
          setCountry(found.country ?? "");
          const existing = (found.images ?? []).map((url, index) => ({
            key: `existing-${index}`,
            url,
          }));
          setPhotos(existing);
          setCoverKey(existing[0]?.key ?? "");
        }
      } catch {
        if (active) {
          setLoadError("We could not load your opportunity. Please check your connection and refresh.");
        }
      } finally {
        if (active) setLoadingListing(false);
      }
    }

    load();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  function handleAddPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`You can have up to ${MAX_PHOTOS} photos. Remove one first to add another.`);
      return;
    }

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPG, PNG and WebP images are allowed.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Each photo must be 5 MB or smaller.");
        return;
      }
    }

    setError("");

    const added: PhotoItem[] = files.map((file) => ({
      key: `new-${crypto.randomUUID()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setPhotos((current) => [...current, ...added]);
    setCoverKey((current) => current || added[0].key);
  }

  function handleRemovePhoto(key: string) {
    const target = photos.find((item) => item.key === key);
    if (!target) return;

    if (target.file) {
      URL.revokeObjectURL(target.url);
    } else {
      setRemovedUrls((current) => [...current, target.url]);
    }

    const remaining = photos.filter((item) => item.key !== key);
    setPhotos(remaining);

    if (coverKey === key) {
      setCoverKey(remaining[0]?.key ?? "");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!listing) return;

    const form = event.currentTarget;
    setError("");
    setSavedMessage("");

    if (!continent || !region || !country) {
      setError("Please select a continent, region and country.");
      return;
    }

    setSaving(true);

    const uploadedPaths: string[] = [];

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please log in again to save your changes.");
      }

      const formData = new FormData(form);

      const title = String(formData.get("title") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      const city = String(formData.get("city") ?? "").trim();
      const category = String(formData.get("category") ?? "");
      const accommodation = String(formData.get("accommodation") ?? "");
      const meals = String(formData.get("meals") ?? "");
      const hoursPerWeek = Number(formData.get("hours_per_week"));
      const minStay = Number(formData.get("min_stay_weeks"));
      const maxStay = Number(formData.get("max_stay_weeks"));

      if (!title || !description || !city) {
        throw new Error("Please complete the title, description and city fields.");
      }

      if (
        !Number.isFinite(hoursPerWeek) ||
        !Number.isFinite(minStay) ||
        !Number.isFinite(maxStay) ||
        hoursPerWeek < 0 ||
        minStay < 1 ||
        maxStay < minStay
      ) {
        throw new Error("Please check the working hours and minimum/maximum stay values.");
      }

      const skills = String(formData.get("skills") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const benefits = String(formData.get("benefits") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // Upload any new photos first.
      const finalUrls = new Map<string, string>();
      const newPhotos = photos.filter((item) => item.file);

      for (let index = 0; index < newPhotos.length; index++) {
        setProgress(`Uploading photo ${index + 1} of ${newPhotos.length}...`);

        const item = newPhotos[index];
        const original = item.file as File;
        const smaller = await shrinkPhoto(original);
        const isJpeg = smaller !== original;
        const baseName =
          original.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-") || "photo";
        const extension = isJpeg
          ? "jpg"
          : original.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${listing.id}/${crypto.randomUUID()}-${baseName}.${extension}`;

        const { error: uploadError } = await withTimeout(
          supabase.storage.from(BUCKET).upload(path, smaller, {
            cacheControl: "3600",
            upsert: false,
            contentType: isJpeg ? "image/jpeg" : original.type,
          }),
          90000,
          "A photo took too long to upload. Please check your internet connection and try again."
        );

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        uploadedPaths.push(path);
        finalUrls.set(item.key, supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
      }

      // Keep the host's chosen order, with the cover photo first.
      const ordered = photos.map((item) => (item.file ? finalUrls.get(item.key)! : item.url));
      const coverIndex = Math.max(0, photos.findIndex((item) => item.key === coverKey));
      const images = ordered.length
        ? [ordered[coverIndex], ...ordered.filter((_, index) => index !== coverIndex)]
        : [];

      setProgress("Saving your changes...");

      const update: Record<string, unknown> = {
        title,
        description,
        category,
        continent,
        region,
        country,
        city,
        accommodation,
        meals,
        hours_per_week: hoursPerWeek,
        min_stay_weeks: minStay,
        max_stay_weeks: maxStay,
        skills,
        benefits,
        images,
      };

      // A rejected listing goes back to review when the host saves their corrections.
      if (listing.status === "rejected") {
        update.status = "draft";
      }

      const { data: saved, error: updateError } = await withTimeout(
        supabase
          .from("listings")
          .update(update)
          .eq("id", listing.id)
          .eq("host_id", user.id)
          .select("status, rejection_reason, host_paused, images")
          .maybeSingle(),
        60000,
        "Saving took too long. Please check your internet connection and try again."
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (!saved) {
        throw new Error("Your changes could not be saved. Please refresh the page and try again.");
      }

      // Tidy up: remove photos the host took out (best effort).
      const pathsToRemove = removedUrls
        .map(storagePathFromUrl)
        .filter((path): path is string => Boolean(path) && path!.startsWith(`${user.id}/`));

      if (pathsToRemove.length > 0) {
        await supabase.storage.from(BUCKET).remove(pathsToRemove);
      }

      const nextStatus = String(saved.status);
      let message = "Your changes have been saved.";

      if (nextStatus === "draft") {
        message =
          listing.status === "published" || listing.status === "paused"
            ? "Your changes have been saved. Because you changed your listing, our team will review it again. It is hidden from Explore until it is approved."
            : "Your changes have been saved and your opportunity is waiting for review.";
      } else if (nextStatus === "published") {
        message = "Your changes have been saved. Your opportunity is live.";
      }

      const savedImages = (saved.images ?? images) as string[];
      setListing({
        ...listing,
        title,
        description,
        category,
        continent,
        region,
        country,
        city,
        accommodation,
        meals,
        hours_per_week: hoursPerWeek,
        min_stay_weeks: minStay,
        max_stay_weeks: maxStay,
        skills,
        benefits,
        images: savedImages,
        status: nextStatus,
        rejection_reason: saved.rejection_reason ?? null,
        host_paused: Boolean(saved.host_paused),
      });

      photos.forEach((item) => {
        if (item.file) URL.revokeObjectURL(item.url);
      });
      const refreshed = savedImages.map((url, index) => ({ key: `existing-${index}`, url }));
      setPhotos(refreshed);
      setCoverKey(refreshed[0]?.key ?? "");
      setRemovedUrls([]);
      setSavedMessage(message);
    } catch (err) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(BUCKET).remove(uploadedPaths);
      }

      setError(
        err instanceof Error ? err.message : "Something went wrong while saving your changes."
      );
    } finally {
      setProgress("");
      setSaving(false);
    }
  }

  const regions = continent ? Object.keys(locations[continent] ?? {}) : [];
  const countries = continent && region ? locations[continent]?.[region] ?? [] : [];

  if (loadingListing) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <p className="mx-auto max-w-3xl text-gray-600">Loading your opportunity...</p>
      </main>
    );
  }

  if (loadError || !listing) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="font-semibold text-gray-900">{loadError || "Opportunity not found."}</p>
          <Link
            href="/dashboard"
            className="mt-5 inline-block rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white hover:bg-emerald-800"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit your opportunity</h1>
          <p className="mt-2 text-gray-600">
            Travailaway allows each host to have one opportunity listing. You can update your
            existing listing whenever your opportunity changes.
          </p>
        </div>

        {listing.status === "rejected" && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Our team asked for some changes before this can go live.</p>
            <p className="mt-1">
              {listing.rejection_reason
                ? `Reason: ${listing.rejection_reason}`
                : "No reason was left. Please contact us if you need help."}
            </p>
            <p className="mt-2">
              Make your corrections below and save. Your opportunity will go back to review.
            </p>
          </div>
        )}

        {listing.status === "published" && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Your opportunity is live. If you change the details or photos, it goes back to review and
            is hidden from Explore until our team approves it.
          </div>
        )}

        {savedMessage && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-white p-4 text-sm font-medium text-emerald-800 shadow-sm"
          >
            <p>{savedMessage}</p>
            <Link href="/dashboard" className="mt-2 inline-block font-bold text-emerald-700 hover:underline">
              Go to my dashboard →
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          {error && (
            <div
              ref={errorRef}
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
            >
              {error}
            </div>
          )}

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Opportunity details</h2>

            <label className={labelClass}>Opportunity title *</label>
            <input name="title" required maxLength={120} defaultValue={listing.title} className={inputClass} />

            <label className={`${labelClass} mt-5`}>Description *</label>
            <textarea name="description" required rows={5} defaultValue={listing.description} className={inputClass} />

            <label className={`${labelClass} mt-5`}>Category *</label>
            <select name="category" required className={inputClass} defaultValue={listing.category}>
              {CATEGORIES.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
              {!CATEGORIES.some(([value]) => value === listing.category) && (
                <option value={listing.category}>{listing.category}</option>
              )}
            </select>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Location</h2>

            <label className={labelClass}>Continent *</label>
            <select
              value={continent}
              onChange={(event) => {
                setContinent(event.target.value);
                setRegion("");
                setCountry("");
              }}
              required
              className={inputClass}
            >
              <option value="">Select continent</option>
              {Object.keys(locations).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className={`${labelClass} mt-5`}>Region *</label>
            <select
              value={region}
              onChange={(event) => {
                setRegion(event.target.value);
                setCountry("");
              }}
              required
              disabled={!continent}
              className={inputClass}
            >
              <option value="">Select region</option>
              {regions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <label className={`${labelClass} mt-5`}>Country *</label>
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              required
              disabled={!region}
              className={inputClass}
            >
              <option value="">Select country</option>
              {countries.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <label className={`${labelClass} mt-5`}>City or town *</label>
            <input name="city" required defaultValue={listing.city ?? ""} className={inputClass} />
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Stay and accommodation</h2>

            <label className={labelClass}>Accommodation *</label>
            <select name="accommodation" required defaultValue={listing.accommodation ?? ""} className={inputClass}>
              <option value="" disabled>Select accommodation</option>
              {ACCOMMODATION.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <label className={`${labelClass} mt-5`}>Meals *</label>
            <select name="meals" required defaultValue={listing.meals ?? ""} className={inputClass}>
              <option value="" disabled>Select meal arrangement</option>
              {MEALS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Hours per week *</label>
                <input name="hours_per_week" type="number" min="0" max="60" required defaultValue={listing.hours_per_week ?? ""} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Minimum stay (weeks) *</label>
                <input name="min_stay_weeks" type="number" min="1" required defaultValue={listing.min_stay_weeks ?? ""} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Maximum stay (weeks) *</label>
                <input name="max_stay_weeks" type="number" min="1" required defaultValue={listing.max_stay_weeks ?? ""} className={inputClass} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Skills and benefits</h2>

            <label className={labelClass}>Skills needed</label>
            <input name="skills" defaultValue={(listing.skills ?? []).join(", ")} className={inputClass} placeholder="Gardening, cooking, teaching (separate with commas)" />

            <label className={`${labelClass} mt-5`}>Benefits for travellers</label>
            <input name="benefits" defaultValue={(listing.benefits ?? []).join(", ")} className={inputClass} placeholder="Free accommodation, meals, cultural exchange" />
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-gray-900">Photos of your place</h2>
            <p className="mb-5 text-sm text-gray-600">
              Up to 8 photos. JPG, PNG or WebP. Maximum 5 MB each. Your cover photo appears first.
            </p>

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((item, index) => (
                  <div key={item.key} className="overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={item.url}
                      alt={`Opportunity photo ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                    <div className="space-y-2 p-2">
                      <button
                        type="button"
                        onClick={() => setCoverKey(item.key)}
                        className={`w-full rounded-lg px-2 py-2 text-xs font-semibold ${
                          coverKey === item.key
                            ? "bg-emerald-700 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {coverKey === item.key ? "✓ Cover photo" : "Set as cover"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(item.key)}
                        className="w-full rounded-lg border border-red-200 px-2 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                You have no photos yet. Adding some helps travellers trust your listing.
              </p>
            )}

            {photos.length < MAX_PHOTOS && (
              <>
                <label className={`${labelClass} mt-5`}>Add photos</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleAddPhotos}
                  className="block w-full rounded-xl border border-gray-300 p-3 text-sm"
                />
              </>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Photos you remove are only deleted when you tap Save changes.
            </p>
          </section>

          {listing.status !== "rejected" && (
            <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
              If you change the details or photos of a live listing, our team reviews it again before
              the new version is shown. Saving without changes does not affect your listing.
            </p>
          )}

          {error && (
            <p className="text-center text-sm font-medium text-red-700">
              Something needs your attention. See the message at the top of the form.
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? progress || "Saving..."
              : listing.status === "rejected"
                ? "Save and resubmit for review"
                : "Save changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
