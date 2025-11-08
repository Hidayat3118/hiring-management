'use client';
import Image from "next/image";
import { IoKeyOutline } from "react-icons/io5";
import Link from "next/link";
import PasswordInput from "@/components/inputPassword";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      toast.success("Pendaftaran dengan Google berhasil!");
      // router.push("/");
    } catch (error) {
      console.error("gagal with google", error.message);
      toast.error("Gagal masuk dengan Google, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white  rounded-lg shadow-md w-full max-w-lg">
        {/* Logo */}
        <div className="flex justify-start">
          <Image
            src={"/rekamin.png"}
            width={150}
            height={100}
            alt="icon rekamin"
            quality={100}
          />
        </div>
        <div className="pb-8 pl-8 pr-8">
          {/* Title */}
          <h2 className="text-lg text-neutral-700 font-semibold text-left mb-2">
            Masuk dengan Rakamin
          </h2>
          <p className="text-left text-gray-600 text-sm mb-6">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-teal-400 hover:underline font-medium"
            >
              Daftar Menggunakan Email
            </Link>
          </p>

          {/* Form */}
          <form className="space-y-4">
            {/* email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Alamat email
              </label>
              <input
                type="email"
                id="email"
                // placeholder="contoh@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>
            {/* password */}
            <PasswordInput />

            <Link href="/forgotPassword">
              <p className="text-teal-400 text-sm mb-4 text-right">
                Lupa kata sandi?
              </p>
            </Link>

            {/* Button daftar dengan email */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Kirim Link
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-1/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">or</span>
              <div className="w-1/4 border-t border-gray-300"></div>
            </div>
            {/* button kkey */}
            <Link href="/">
              <button
                type="button"
                className="w-full gap-3 mb-4 flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <IoKeyOutline className="font-bold" />
                <span className="text-gray-700 font-medium">
                  Kirim link login melalui email
                </span>
              </button>
            </Link>

            {/* Google button */}
            <button onClick={handleGoogleLogin}
              type="button"
              className="w-full flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="w-4 h-4 mr-2"
              />
              <span className="text-gray-700 font-medium">
                Daftar dengan Google
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
