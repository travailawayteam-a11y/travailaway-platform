
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const locations: Record<string, Record<string, string[]>> = {
  Africa: {
    "East Africa": "Burundi|Comoros|Djibouti|Eritrea|Ethiopia|Kenya|Madagascar|Malawi|Mauritius|Mozambique|Rwanda|Seychelles|Somalia|South Sudan|Tanzania|Uganda|Zambia|Zimbabwe".split("|"),
    "West Africa": "Benin|Burkina Faso|Cabo Verde|Côte d'Ivoire|Gambia|Ghana|Guinea|Guinea-Bissau|Liberia|Mali|Mauritania|Niger|Nigeria|Senegal|Sierra Leone|Togo".split("|"),
    "Central Africa": "Angola|Cameroon|Central African Republic|Chad|Democratic Republic of the Congo|Equatorial Guinea|Gabon|Republic of the Congo|São Tomé and Príncipe".split("|"),
    "North Africa": "Algeria|Egypt|Libya|Morocco|Sudan|Tunisia".split("|"),
    "Southern Africa": "Botswana|Eswatini|Lesotho|Namibia|South Africa".split("|"),
  },
  Europe: {
    "Northern Europe": "Denmark|Estonia|Finland|Iceland|Ireland|Latvia|Lithuania|Norway|Sweden|United Kingdom".split("|"),
    "Western Europe": "Austria|Belgium|France|Germany|Liechtenstein|Luxembourg|Monaco|Netherlands|Switzerland".split("|"),
    "Southern Europe": "Albania|Andorra|Bosnia and Herzegovina|Croatia|Greece|Italy|Malta|Montenegro|North Macedonia|Portugal|San Marino|Serbia|Slovenia|Spain|Vatican City".split("|"),
    "Eastern Europe": "Belarus|Bulgaria|Czechia|Hungary|Moldova|Poland|Romania|Russia|Slovakia|Ukraine".split("|"),
  },
  Asia: {
    "East Asia": "China|Japan|Mongolia|North Korea|South Korea".split("|"),
    "South Asia": "Afghanistan|Bangladesh|Bhutan|India|Maldives|Nepal|Pakistan|Sri Lanka".split("|"),
    "Southeast Asia": "Brunei|Cambodia|Indonesia|Laos|Malaysia|Myanmar|Philippines|Singapore|Thailand|Timor-Leste|Vietnam".split("|"),
    "Central Asia": "Kazakhstan|Kyrgyzstan|Tajikistan|Turkmenistan|Uzbekistan".split("|"),
    "West Asia": "Armenia|Azerbaijan|Bahrain|Cyprus|Georgia|Iran|Iraq|Israel|Jordan|Kuwait|Lebanon|Oman|Palestine|Qatar|Saudi Arabia|Syria|Turkey|United Arab Emirates|Yemen".split("|"),
  },
  "North America": {
    "Northern America": "Canada|United States|Mexico".split("|"),
    "Central America": "Belize|Costa Rica|El Salvador|Guatemala|Honduras|Nicaragua|Panama".split("|"),
    Caribbean: "Antigua and Barbuda|Bahamas|Barbados|Cuba|Dominica|Dominican Republic|Grenada|Haiti|Jamaica|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Trinidad and Tobago".split("|"),
  },
  "South America": {
    "South America": "Argentina|Bolivia|Brazil|Chile|Colombia|Ecuador|Guyana|Paraguay|Peru|Suriname|Uruguay|Venezuela".split("|"),
  },
  Oceania: {
    "Australia and New Zealand": "Australia|New Zealand".split("|"),
    Melanesia: "Fiji|Papua New Guinea|Solomon Islands|Vanuatu".split("|"),
    Micronesia: "Federated States of Micronesia|Kiribati|Marshall Islands|Nauru|Palau".split("|"),
    Polynesia: "Samoa|Tonga|Tuvalu".split("|"),
  },
};

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-emerald-600";

const labelClass = "mb-2 block text-sm font-semibold text-gray-700";

export default function NewOpportunityPage() {
  const router = useRouter();
  const supabase = createClient();

  const [continent, setContinent] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const regions = continent ? Object.keys(locations[continent]) : [];
  const countries =
    continent && region ? locations[continent][region] || [] : [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      if (user.user_metadata?.account_type !== "host") {
        setError("Only host accounts can publish opportunities.");
        return;
      }

      if (!continent || !region || !country) {
        setError("Please select your continent, region and country.");
        return;
      }

      const form = new FormData(event.currentTarget);

      const minStay = Number(form.get("min_stay"));
      const maxStay = Number(form.get("max_stay"));

      if (minStay && maxStay && maxStay < minStay) {
        setError("Maximum stay cannot be shorter than minimum stay.");
        return;
      }

      const { error: insertError } = await supabase
        .from("listings")
        .insert({
          host_id: user.id,
          title: String(form.get("title")).trim(),
          description: String(form.get("description")).trim(),
          category: String(form.get("category")),
          continent,
          region,
          country,
          city: String(form.get("city") || "").trim(),
          accommodation: String(form.get("accommodation") || ""),
          meals: String(form.get("meals") || ""),
          hours_per_week: Number(form.get("hours")) || null,
          min_stay_weeks: minStay || null,
          max_stay_weeks: maxStay || null,
          skills: String(form.get("skills") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          benefits: String(form.get("benefits") || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          images: String(form.get("images") || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          status: "published",
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          ← Back to dashboard
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-700">
            Travailaway Host
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Create an opportunity
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome travellers from anywhere in the world.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Opportunity details
            </h2>

            <label className={labelClass}>Opportunity title *</label>
            <input
              name="title"
              required
              maxLength={150}
              placeholder="e.g. Help at our family guesthouse"
              className={inputClass}
            />

            <label className={`${labelClass} mt-5`}>
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={6}
              placeholder="Tell travellers about the opportunity, the work and your place..."
              className={inputClass}
            />

            <label className={`${labelClass} mt-5`}>Category *</label>
            <select
              name="category"
              required
              className={inputClass}
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="Hospitality">Hospitality and tourism</option>
              <option value="Farming">Farming and gardening</option>
              <option value="Education">Teaching and education</option>
              <option value="Community">Community projects</option>
              <option value="Animals">Animal care</option>
              <option value="Construction">Construction and renovation</option>
              <option value="Environment">Environment and conservation</option>
              <option value="Arts">Arts and culture</option>
              <option value="Other">Other</option>
            </select>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Where is your opportunity?
            </h2>

            <label className={labelClass}>Continent *</label>
            <select
              required
              value={continent}
              className={inputClass}
              onChange={(event) => {
                setContinent(event.target.value);
                setRegion("");
                setCountry("");
              }}
            >
              <option value="">Select continent</option>
              {Object.keys(locations).map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className={`${labelClass} mt-5`}>Region *</label>
            <select
              required
              value={region}
              disabled={!continent}
              className={inputClass}
              onChange={(event) => {
                setRegion(event.target.value);
                setCountry("");
              }}
            >
              <option value="">Select region</option>
              {regions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className={`${labelClass} mt-5`}>Country *</label>
            <select
              required
              value={country}
              disabled={!region}
              className={inputClass}
              onChange={(event) => setCountry(event.target.value)}
            >
              <option value="">Select country</option>
              {countries.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <label className={`${labelClass} mt-5`}>City or town</label>
            <input
              name="city"
              placeholder="e.g. Masindi"
              className={inputClass}
            />
          </section>

          <section className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Stay and benefits
            </h2>

            <label className={labelClass}>Accommodation</label>
            <select
              name="accommodation"
              className={inputClass}
              defaultValue=""
            >
              <option value="">Select accommodation</option>
              <option value="Private room">Private room</option>
              <option value="Shared room">Shared room</option>
              <option value="Shared accommodation">Shared accommodation</option>
              <option value="Camping">Camping</option>
              <option value="No accommodation">No accommodation</option>
            </select>

            <label className={`${labelClass} mt-5`}>Meals</label>
            <select
              name="meals"
              className={inputClass}
              defaultValue=""
            >
              <option value="">Select meal arrangement</option>
              <option value="All meals provided">All meals provided</option>
              <option value="Some meals provided">Some meals provided</option>
              <option value="No meals provided">No meals provided</option>
            </select>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Hours per week</label>
                <input
                  name="hours"
                  type="number"
                  min="1"
                  max="60"
                  className={inputClass}
                  placeholder="25"
                />
              </div>
              <div>
                <label className={labelClass}>Minimum stay (weeks)</label>
                <input
                  name="min_stay"
                  type="number"
                  min="1"
                  className={inputClass}
                  placeholder="2"
                />
              </div>
              <div>
                <label className={labelClass}>Maximum stay (weeks)</label>
                <input
                  name="max_stay"
                  type="number"
                  min="1"
                  className={inputClass}
                  placeholder="12"
                />
              </div>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Skills and photos
            </h2>

            <label className={labelClass}>
              Skills wanted (separate with commas)
            </label>
            <input
              name="skills"
              placeholder="Gardening, cooking, painting"
              className={inputClass}
            />

            <label className={`${labelClass} mt-5`}>
              Benefits offered (separate with commas)
            </label>
            <input
              name="benefits"
              placeholder="Accommodation, meals, cultural exchange"
              className={inputClass}
            />

            <label className={`${labelClass} mt-5`}>
              Photo URLs (one URL per line)
            </label>
            <textarea
              name="images"
              rows={3}
              placeholder="Paste image links here, one per line"
              className={inputClass}
            />
            <p className="mt-2 text-xs text-gray-500">
              You can add photos later if you do not have image links yet.
            </p>
          </section>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish opportunity"}
          </button>

          <p className="text-center text-xs text-gray-500">
            Your opportunity will be visible to travellers after publishing.
          </p>
        </form>
      </div>
    </main>
  );
}
