"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function NewOpportunityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [continent, setContinent] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);

  useEffect(() => {
    return () => {
      photoPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photoPreviews]);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (files.length > MAX_PHOTOS) {
      setError(`Please select no more than ${MAX_PHOTOS} photos.`);
      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setError("Only JPG, PNG and WebP images are allowed.");
        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Each photo must be 5 MB or smaller.");
        event.target.value = "";
        return;
      }
    }

    setError("");
    setPhotoPreviews(files.map((file) => URL.createObjectURL(file)));
    setSelectedPhotos(files);
    setCoverIndex(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError("");

    if (!continent || !region || !country) {
      setError("Please select a continent, region and country.");
      return;
    }

    if (selectedPhotos.length > MAX_PHOTOS) {
      setError(`You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setLoading(true);

    const uploadedPaths: string[] = [];

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Please sign in before creating an opportunity.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, account_type")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Your profile could not be found. Please complete your account setup.");
      }

      if (profile.account_type !== "host") {
        throw new Error("Only host accounts can publish opportunities.");
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

      const listingId = crypto.randomUUID();
      const uploadedUrls: string[] = [];

      for (let index = 0; index < selectedPhotos.length; index++) {
        const photo = selectedPhotos[index];
        const safeName = photo.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const path = `${user.id}/${listingId}/${crypto.randomUUID()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("opportunity-photos")
          .upload(path, photo, {
            cacheControl: "3600",
            upsert: false,
            contentType: photo.type,
          });

        if (uploadError) {
          throw new Error(`Photo upload failed: ${uploadError.message}`);
        }

        uploadedPaths.push(path);

        const { data: publicUrl } = supabase.storage
          .from("opportunity-photos")
          .getPublicUrl(path);

        uploadedUrls.push(publicUrl.publicUrl);
      }

      const orderedImages = uploadedUrls.length
        ? [
            uploadedUrls[coverIndex],
            ...uploadedUrls.filter((_, index) => index !== coverIndex),
          ]
        : [];

      const { error: insertError } = await supabase.from("listings").insert({
        id: listingId,
        host_id: user.id,
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
        images: orderedImages,
        // New opportunities wait for review by our team before they are listed.
        status: "draft",
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from("opportunity-photos").remove(uploadedPaths);
      }

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your opportunity."
      );
      setLoading(false);
    }
  }

  const regions = continent ? Object.keys(locations[continent] ?? {}) : [];
  const countries = continent && region ? locations[continent]?.[region] ?? [] : [];

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline">
          ← Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an opportunity</h1>
          <p className="mt-2 text-gray-600">
            Tell travellers about your place and the experience you are offering.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Opportunity details</h2>

            <label className={labelClass}>Opportunity title *</label>
            <input name="title" required maxLength={120} className={inputClass} placeholder="Help at our family eco-lodge" />

            <label className={`${labelClass} mt-5`}>Description *</label>
            <textarea name="description" required rows={5} className={inputClass} placeholder="Describe your place, the work involved and what travellers can expect." />

            <label className={`${labelClass} mt-5`}>Category *</label>
            <select name="category" required className={inputClass} defaultValue="">
              <option value="" disabled>Select a category</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Farming">Farming</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Teaching">Teaching</option>
              <option value="Community">Community projects</option>
              <option value="Environment">Environment</option>
              <option value="Construction">Construction</option>
              <option value="Other">Other</option>
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
            <input name="city" required className={inputClass} placeholder="Enter city or town" />
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Stay and accommodation</h2>

            <label className={labelClass}>Accommodation *</label>
            <select name="accommodation" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select accommodation</option>
              <option value="Private room">Private room</option>
              <option value="Shared room">Shared room</option>
              <option value="Dormitory">Dormitory</option>
              <option value="Camping">Camping</option>
              <option value="No accommodation">No accommodation</option>
            </select>

            <label className={`${labelClass} mt-5`}>Meals *</label>
            <select name="meals" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select meal arrangement</option>
              <option value="All meals provided">All meals provided</option>
              <option value="Some meals provided">Some meals provided</option>
              <option value="No meals provided">No meals provided</option>
            </select>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Hours per week *</label>
                <input name="hours_per_week" type="number" min="0" max="60" required className={inputClass} placeholder="20" />
              </div>
              <div>
                <label className={labelClass}>Minimum stay (weeks) *</label>
                <input name="min_stay_weeks" type="number" min="1" required className={inputClass} placeholder="2" />
              </div>
              <div>
                <label className={labelClass}>Maximum stay (weeks) *</label>
                <input name="max_stay_weeks" type="number" min="1" required className={inputClass} placeholder="12" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-lg font-bold text-gray-900">Skills and benefits</h2>

            <label className={labelClass}>Skills needed</label>
            <input name="skills" className={inputClass} placeholder="Gardening, cooking, teaching (separate with commas)" />

            <label className={`${labelClass} mt-5`}>Benefits for travellers</label>
            <input name="benefits" className={inputClass} placeholder="Free accommodation, meals, cultural exchange" />
          </section>

          <section>
            <h2 className="mb-2 text-lg font-bold text-gray-900">Photos of your place</h2>
            <p className="mb-5 text-sm text-gray-600">
              Upload up to 8 photos. JPG, PNG or WebP. Maximum 5 MB each.
              Your selected cover photo will appear first.
            </p>

            <label className={labelClass}>Choose photos</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoChange}
              className="block w-full rounded-xl border border-gray-300 p-3 text-sm"
            />

            {photoPreviews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photoPreviews.map((preview, index) => (
                  <div key={preview} className="overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={preview}
                      alt={`Opportunity photo ${index + 1}`}
                      className="h-36 w-full object-cover"
                    />
                    <div className="p-2">
                      <button
                        type="button"
                        onClick={() => setCoverIndex(index)}
                        className={`w-full rounded-lg px-2 py-2 text-xs font-semibold ${
                          coverIndex === index
                            ? "bg-emerald-700 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {coverIndex === index ? "✓ Cover photo" : "Set as cover"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-500">
              The first photo is the cover unless you choose another one.
            </p>
          </section>

          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
            Our team reviews every new opportunity before it is listed. You will
            see it on your dashboard as &ldquo;Awaiting review&rdquo; until it
            is approved.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting for review..." : "Submit for review"}
          </button>
        </form>
      </div>
    </main>
  );
}
