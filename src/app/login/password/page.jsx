"use client";

import Image from "next/image";
import { IoKeyOutline } from "react-icons/io5";
import Link from "next/link";
import PasswordInput from "@/components/inputPassword";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase"; // 👈 TAMBAH db
import { doc, getDoc } from "firebase/firestore"; // 👈 TAMBAH INI

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
  });

  // 🔹 Login pakai Google
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔍 Ambil role dari Firestore
      const userDoc = await getDoc(doc(db, "registeredEmails", user.email));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ Google login berhasil, role:", userData.role);

        toast.success("Login dengan Google berhasil!");

        // 🔁 Redirect sesuai role
        if (userData.role === "admin") {
          router.push("/admin/jobList");
        } else {
          router.push("/jobList");
        }
      } else {
        toast.success("Login berhasil!");
        router.push("/jobList");
      }
    } catch (error) {
      console.error("Gagal login dengan Google:", error.message);
      toast.error("Gagal masuk dengan Google, coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login pakai email dan password
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "", password: "", general: "" });

    if (!email || !password) {
      setError({
        email: !email ? "Email wajib diisi" : "",
        password: !password ? "Password wajib diisi" : "",
      });
      setLoading(false);
      return;
    }

    try {
      // 🔸 Login dengan email + password
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 🔍 PERBAIKAN: Ambil userData dari Firestore
      const userDoc = await getDoc(doc(db, "registeredEmails", user.email));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ Email login berhasil, role:", userData.role);

        toast.success("Berhasil login!");

        // 🔁 Redirect sesuai role
        if (userData.role === "admin") {
          console.log("🔐 Redirect ke /admin/jobList");
          router.push("/admin/jobList"); // 👈 Admin ke admin/jobList
        } else {
          console.log("👤 Redirect ke /jobList");
          router.push("/jobList"); // 👈 Candidate ke jobList biasa
        }
      } else {
        // Data tidak ada di Firestore, redirect ke jobList
        console.log("⚠️ User data not found, redirect ke /jobList");
        toast.success("Berhasil login!");
        router.push("/jobList");
      }
    } catch (error) {
      console.error("Error saat login:", error.code, error.message);

      if (error.code === "auth/invalid-email") {
        setError((prev) => ({ ...prev, email: "Format email tidak valid" }));
      } else if (error.code === "auth/user-not-found") {
        setError((prev) => ({ ...prev, email: "Email tidak terdaftar" }));
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setError((prev) => ({ ...prev, password: "Password salah" }));
      } else {
        setError((prev) => ({
          ...prev,
          general: "Terjadi kesalahan, coba lagi nanti.",
        }));
      }
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
          <h2 className="text-lg text-neutral-700 font-semibold text-left mb-2">
            Masuk dengan Rakamin
          </h2>
          <p className="text-left text-gray-600 text-sm mb-6">
            Belum punya akun?{" "}
            <Link
              href="/register/password"
              className="text-teal-400 hover:underline font-medium"
            >
              Daftar Menggunakan Email
            </Link>
          </p>

          {/* Form Login */}
          <form className="space-y-4" onSubmit={handleLogin}>
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
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400 focus:outline-none ${
                  error.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {error.email && (
                <p className="text-red-500 text-xs mt-1">{error.email}</p>
              )}
            </div>

            {/* password */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error.password}
            />

            <Link href="/forgotPassword">
              <p className="text-teal-400 text-sm mb-4 text-right">
                Lupa kata sandi?
              </p>
            </Link>

            {/* Button Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-800 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk Sekarang"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-3/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">atau</span>
              <div className="w-3/4 border-t border-gray-300"></div>
            </div>

            {/* Button login via email link */}
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
            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={loading}
              className="w-full flex cursor-pointer items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google logo"
                className="w-4 h-4 mr-2"
              />
              <span className="text-gray-700 font-medium">
                Masuk dengan Google
              </span>
            </button>
          </form>

          {/* general error */}
          {error.general && (
            <p className="text-center text-red-500 text-sm mt-3">
              {error.general}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
