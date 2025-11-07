"use client"; // kalau kamu pakai Next.js App Router

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="relative w-full">
      <label
        htmlFor="password"
        className="block text-sm text-gray-700 mb-1"
      >
        Password
      </label>

      <input
        type={showPassword ? "text" : "password"}
        id="password"
        placeholder="Masukkan password"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none pr-10"
      />

      <button
        type="button"
        onClick={togglePassword}
        className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
}
