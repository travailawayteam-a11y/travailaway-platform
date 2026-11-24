"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const AVATAR_BUCKET = "avatars";

// Shrinks a photo to at most 480 pixels so it loads fast on a phone connection.
function shrinkPhoto(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 480 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("no canvas"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) resolve(blob);
          else reject(new Error("no blob"));
        },
        "image/jpeg",
        0.85
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    image.src = url;
  });
}

// Turns a public photo link back into its path inside the avatars folder.
function avatarPathFromUrl(url: string): string | null {
  const marker = `/${AVATAR_BUCKET}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
}

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [languages, setLanguages] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");
  const [accountType, setAccountType] = useState("traveller");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, country, city, bio, account_type, languages, skills, interests, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
      } else if (data) {
        setFullName(data.full_name || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setBio(data.bio || "");
        setLanguages(data.languages || "");
        setSkills(data.skills || "");
        setInterests(data.interests || "");
        setAvatarUrl(data.avatar_url || "");
        setAccountType(data.account_type || "traveller");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    const { error: saveError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        country: country.trim(),
        city: city.trim(),
        bio: bio.trim(),
        languages: languages.trim(),
        skills: skills.trim(),
        interests: interests.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("Your profile has been updated successfully!");
    }

    setSaving(false);
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !userId) return;

    setPhotoMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setPhotoMessage("Please choose a photo (JPG or PNG).");
      return;
    }

    setPhotoBusy(true);
    const supabase = createClient();
    try {
      const smaller = await shrinkPhoto(file);
      const path = `${userId}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, smaller, { contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const newUrl = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;

      const { error: saveError } = await supabase
        .from("profiles")
        .update({ avatar_url: newUrl, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (saveError) {
        await supabase.storage.from(AVATAR_BUCKET).remove([path]);
        throw saveError;
      }

      const oldPath = avatarUrl ? avatarPathFromUrl(avatarUrl) : null;
      if (oldPath && oldPath.startsWith(`${userId}/`)) {
        await supabase.storage.from(AVATAR_BUCKET).remove([oldPath]);
      }

      setAvatarUrl(newUrl);
      setPhotoMessage("Photo updated.");
    } catch {
      setPhotoMessage("We could not upload that photo. Please try another one.");
    }
    setPhotoBusy(false);
  }

  const isHost = accountType === "host";

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <p className="text-gray-600">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dashboard"
          className="font-bold text-[#176b50]"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-7 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-[#17231f]">
            {isHost ? "Your host profile" : "Your traveller profile"}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            {isHost
              ? "Help travellers get to know you and your place before they get in touch."
              : "Help hosts get to know you before they get in touch."}
          </p>

          <div className="mt-8 flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Your profile photo"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#e3f1e9] text-3xl font-bold text-[#176b50]">
                {(fullName.trim()[0] || "?").toUpperCase()}
              </div>
            )}
            <div>
              <label className="inline-block cursor-pointer rounded-full border border-[#176b50] px-5 py-2 text-sm font-bold text-[#176b50] hover:bg-[#e3f1e9]">
                {photoBusy ? "Uploading..." : avatarUrl ? "Change photo" : "Add a photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhoto}
                  disabled={photoBusy}
                  className="sr-only"
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                A clear photo of your face helps people trust you.
              </p>
              {photoMessage && (
                <p role="status" className="mt-1 text-sm font-semibold text-[#176b50]">
                  {photoMessage}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Account type
              </label>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 capitalize text-gray-600">
                {accountType}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="e.g. Uganda"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City or town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="Your city or town"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {isHost ? "About you and your place" : "About me"}
              </label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder={
                  isHost
                    ? "Tell travellers about the people in your household or project, your place and the local area, and what you hope to share and learn..."
                    : "Tell hosts about your interests, your skills, why you love to travel and what you hope to learn..."
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Languages you speak
              </label>
              <input
                type="text"
                maxLength={200}
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="e.g. English, Luganda, Swahili"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {isHost ? "What you can teach or share" : "Skills you can offer"}
              </label>
              <input
                type="text"
                maxLength={300}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="e.g. teaching, cooking, photography, farming"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Interests
              </label>
              <input
                type="text"
                maxLength={300}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#176b50]"
                placeholder="e.g. music, hiking, local food, wildlife"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {message && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <p>{message}</p>
                <Link
                  href={isHost ? "/opportunities/new" : "/explore"}
                  className="mt-2 inline-block font-semibold underline"
                >
                  {isHost
                    ? "Next: create your first opportunity →"
                    : "Next: explore opportunities →"}
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={saving || !userId}
              className="w-full rounded-lg bg-[#176b50] px-5 py-3 font-semibold text-white hover:bg-[#104c3a] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save my profile"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
