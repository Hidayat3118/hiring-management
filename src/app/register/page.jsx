"use client";
import Image from "next/image";
import Link from "next/link";
import {
  sendSignInLinkToEmail,
  signInWithPopup,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState({ email: "" });

  const actionCodeSettings = {
    url: "http://localhost:3000/verify", // setelah klik link email
    handleCodeInApp: true,
  };
  // handle register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "" });

    // Validasi email
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
      // Cek apakah email sudah terdaftar
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError({
          email: "Email ini sudah terdaftar di akun Rakamin Academy.",
        });
        setLoading(false);
        return;
      }

      // Kirim link ke email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("Link verifikasi dikirim ke email kamu!");
      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      // console.error("Firebase error:", err.code, err.message);

      // 🎯 Menangani jenis error berbeda
      if (err.code === "auth/quota-exceeded") {
        toast.error(
          "Kouta pengiriman email Firebase sudah habis hari ini. Coba lagi besok"
        );
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Terlalu banyak percobaan. Coba lagi nanti.");
      } else if (err.code === "auth/network-request-failed") {
        toast.error(
          "Tidak dapat terhubung ke server. Periksa koneksi internet kamu."
        );
      } else {
        toast.error("Terjadi kesalahan saat mengirim email. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
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
      <div className="bg-white rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-start">
          <Image
            src="/rekamin.png"
            width={150}
            height={100}
            alt="icon rekamin"
            quality={100}
          />
        </div>

        <div className="pb-8 pl-8 pr-8">
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

          {error.email ===
            "Email ini sudah terdaftar di akun Rakamin Academy." && (
            <div className="text-red-500 border border-red-300 rounded-md mb-3 text-xs py-1 text-center px-2">
              {error.email}{" "}
              <Link href="/">
                <span className="text-red-500 font-semibold hover:text-red-700">
                  Masuk
                </span>
              </Link>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Alamat email
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              />
            </div>
            {/* Error validasi (email kosong / format salah) muncul di bawah input */}
            {error.email &&
              error.email !==
                "Email ini sudah terdaftar di akun Rakamin Academy." && (
                <p className="text-red-500 text-xs mt-1">{error.email}</p>
              )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                loading
                  ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              }`}
            >
              {loading ? "Mengirim..." : "Daftar dengan email"}
            </button>

            <div className="flex items-center justify-center my-4">
              <div className="w-3/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">atau</span>
              <div className="w-3/4 border-t border-gray-300"></div>
            </div>

            <button
              onClick={handleGoogleRegister}
              type="button"
              className="w-full cursor-pointer flex items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition"
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

export default Register;
