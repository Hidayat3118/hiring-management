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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const RegisterForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    general: "",
  });

  // 🔹 Register dengan Email + Password
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ email: "", password: "", general: "" });

    // Validasi kosong
    if (!email || !password) {
      setError({
        email: !email ? "Email wajib diisi" : "",
        password: !password ? "Password wajib diisi" : "",
      });
      setLoading(false);
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError((prev) => ({ ...prev, email: "Format email tidak valid" }));
      setLoading(false);
      return;
    }

    try {
      // 🔸 Buat akun baru
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 🔸 Update profil (hanya avatar)
      await updateProfile(userCredential.user, {
        photoURL: `https://api.dicebear.com/8.x/identicon/svg?seed=${userCredential.user.uid}`,
      });

      // 💾 Simpan ke Firestore
      const userData = {
        email: email,
        role: "candidate",
        status: "verified",
        registeredAt: new Date(),
        createdAt: new Date(),
      };

      await setDoc(
        doc(db, "registeredEmails", email),
        userData,
        { merge: true }
      );

      console.log("✅ User berhasil terdaftar:", userData);

      toast.success("Registrasi berhasil!");
      router.push("/jobList");
    } catch (error) {
      console.error("Register error:", error.code, error.message);
      if (error.code === "auth/email-already-in-use") {
        setError((prev) => ({ ...prev, email: "Email sudah terdaftar" }));
      } else if (error.code === "auth/weak-password") {
        setError((prev) => ({
          ...prev,
          password: "Password terlalu lemah (min 6 karakter)",
        }));
      } else if (error.code === "auth/invalid-email") {
        setError((prev) => ({ ...prev, email: "Format email tidak valid" }));
      } else {
        setError((prev) => ({
          ...prev,
          general: "Terjadi kesalahan. Coba lagi nanti.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Register
  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 💾 Simpan ke Firestore
      const userData = {
        email: user.email,
        role: "candidate",
        status: "verified",
        photoURL: user.photoURL,
        registeredAt: new Date(),
      };

      await setDoc(
        doc(db, "registeredEmails", user.email),
        userData,
        { merge: true }
      );

      toast.success("Register Google sukses!");
      router.push("/jobList");
    } catch (error) {
      console.error("Gagal daftar dengan Google:", error.message);
      toast.error("Gagal masuk, coba lagi nanti.");
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

          {/* Form Register */}
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-gray-700 mb-1"
              >
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
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

            {/* Password */}
            <div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error.password}
              />
              {error.password && (
                <p className="text-red-500 text-xs mt-1">{error.password}</p>
              )}
            </div>

            {/* Button Daftar dengan Email + Password */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 rounded-lg transition-colors ${
                loading
                  ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              }`}
            >
              {loading ? "Memproses..." : "Daftar dengan Email"}
            </button>

            {/* Divider */}
            <div className="flex items-center justify-center my-4">
              <div className="w-1/4 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm mx-2">atau</span>
              <div className="w-1/4 border-t border-gray-300"></div>
            </div>

            {/* Kirim Link Email */}
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

            {/* Google Button */}
            <button
              onClick={handleGoogleRegister}
              type="button"
              disabled={loading}
              className="w-full flex items-center justify-center border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition disabled:opacity-50"
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

          {/* Error umum */}
          {error.general && (
            <p className="text-center text-red-500 text-sm mt-3">
              {error.general}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
