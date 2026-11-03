"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Compass,
  Globe2,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const logo =
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/brand-assets/1000296575-removebg-preview.png";

const slides = [
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/omar-ramadan-y_OLIOot4VU-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/elya-foll-u9ZSmQNuhuw-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/duy-pham-Cecb0_8Hx-o-unsplash%20(1).jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/chermiti-mohamed-CD2Y9kMmCIQ-unsplash.jpg",
  "https://sbgfaplqdxejirqfqfpn.supabase.co/storage/v1/object/public/homepage-images/alexander-schimmeck-MraFXV3v7Ts-unsplash.jpg",
];

const destinations = [
  {
    name: "Europe",
    detail: "Discover culture and new experiences",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900",
  },
  {
    name: "Africa",
    detail: "Connect with communities and nature",
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=900",
  },
  {
    name: "Asia",
    detail: "Experience traditions and hospitality",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=900",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-800">
