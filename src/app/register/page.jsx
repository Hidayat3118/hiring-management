"use client";
import Image from "next/image";
import Link from "next/link";
import { IoKeyOutline } from "react-icons/io5";
// firebase
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const actionCodeSettings = {
    url: "https://yourapp.vercel.app", // bisa diarahkan ke mana pun (nanti diklik dari email)
    handleCodeInApp: true,
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      router.push(`/register/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
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
          <form onSubmit={handleRegister} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                // placeholder="contoh@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            {/* Button daftar dengan email */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors"
            >
              {loading ? "loading" : "Daftar dengan email"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-3/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">or</span>
              <div className="w-3/4 border-t border-gray-300"></div>
            </div>
            {/* button key */}
            <Link href="/register/password">
              <button
                type="button"
                className="w-full gap-3 mb-4 flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <IoKeyOutline className="font-bold" />
                <span className="text-gray-700 font-medium">
                  Masuk Dengan Kata Sandi
                </span>
              </button>
            </Link>

            {/* Google button */}
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="w-5 h-5 mr-2"
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

export default Register;
