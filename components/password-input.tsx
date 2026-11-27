"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
};

// A password box with an eye button to show or hide what is typed.
export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
  required,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#176b50] focus:ring-2 focus:ring-[#176b50]/20"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-500 hover:text-[#176b50]"
      >
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
