"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdOutlineEmail } from "react-icons/md";
import Link from "next/link";
import PasswordInput from "@/components/inputPassword";
import { useState } from "react";
import { toast } from "sonner";
// firebase
import {
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
const RegisterForm = () => {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const handleGoogleRegister = async () => {
    try {
      // setLoading(true);
      await signInWithPopup(auth, provider);
      toast.success("Register Google sukses!");
      // router.push("/");
    } catch (error) {
      console.error("gagal with google", error.message);
      toast.error("gagal masuk coba lain waktu");
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
            Bergabung dengan Rakamin
          </h2>
          <p className="text-left text-gray-600 text-sm mb-6">
            Sudah punya akun?{" "}
            <Link
              href="/"
              className="text-teal-400 hover:underline font-medium"
            >
              Masuk
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
            {/* katasandi */}
            <PasswordInput />

            {/* Button daftar dengan email */}
            <button
              type="submit"
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Daftar dengan email
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-3/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">atau</span>
              <div className="w-3/4 border-t border-gray-300"></div>
            </div>

            {/* register email */}
            <Link href="/register">
              <button
                type="button"
                className="w-full gap-3 mb-4 flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <MdOutlineEmail className="font-bold" />
                <span className="text-gray-700 font-medium">
                  Kirim link melalui email
                </span>
              </button>
            </Link>
            {/* Google button */}
            <button
              onClick={handleGoogleRegister}
              type="button"
              className="w-full flex items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
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
};

export default RegisterForm;
