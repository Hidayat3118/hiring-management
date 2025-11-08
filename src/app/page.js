"use client";
import Image from "next/image";
import { IoKeyOutline } from "react-icons/io5";
import Link from "next/link";
import {
  sendSignInLinkToEmail,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: "" });
  const router = useRouter();

  const actionCodeSettings = {
    url: "http://localhost:3000/",
    handleCodeInApp: true,
  };

  // 📨 Kirim link login via email
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "" });

    // ✅ Validasi email
    if (!email) {
      setError({ email: "Email wajib diisi" });
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError({ email: "Format email tidak valid" });
      setLoading(false);
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      // ❌ Jika email belum terdaftar
      if (methods.length === 0) {
        setError({ email: "Email belum terdaftar di akun Rakamin Academy." });
        setLoading(false);
        return;
      }

      // ✅ Kirim link login
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error("Firebase error:", err.code, err.message);

      if (err.code === "auth/too-many-requests") {
        setError({
          email: "Terlalu banyak percobaan. Coba lagi nanti.",
        });
      } else if (err.code === "auth/network-request-failed") {
        setError({
          email: "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.",
        });
      } else {
        setError({
          email: "Terjadi kesalahan saat mengirim email. Coba lagi nanti.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Login dengan Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error) {
      console.error("Gagal login dengan Google:", error.message);
      setError({
        email: "Gagal masuk dengan Google. Coba lagi nanti.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
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
            Masuk ke Rakamin
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

          {/* ❌ Pesan error besar di atas input */}
          {error.email ===
            "Email belum terdaftar di akun Rakamin Academy." && (
            <div className="text-red-500 border border-red-300 rounded-md mb-3 text-xs py-1 text-center px-2">
              {error.email}{" "}
              <Link href="/register">
                <span className="text-red-500 font-semibold hover:text-red-700">
                  Daftar
                </span>
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSendLink} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Alamat email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>

            {/* Error kecil di bawah input */}
            {error.email &&
              error.email !==
                "Email belum terdaftar di akun Rakamin Academy." && (
                <p className="text-red-500 text-xs mt-1">{error.email}</p>
              )}

            {/* Button Kirim Link */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                loading
                  ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              }`}
            >
              {loading ? "Mengirim..." : "Kirim Link Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-1/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">atau</span>
              <div className="w-1/4 border-t border-gray-300"></div>
            </div>

            {/* Tombol Masuk dengan Password */}
            <Link href="/login/password">
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

            {/* Tombol Google */}
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
              disabled={loading}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="w-5 h-5 mr-2"
              />
              <span className="text-gray-700 font-medium">
                {loading ? "Memproses..." : "Masuk dengan Google"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
