"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          email = window.prompt("Masukkan email kamu untuk verifikasi:");
        }

        try {
          await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
          toast.success("Login berhasil! Akun kamu telah dibuat");
          router.push("/jobList");
        } catch (error) {
          console.error(error);
          toast.error("Verifikasi gagal. Coba lagi nanti.");
        }
      } else {
        // Jika bukan link valid, arahkan ke register
        toast.error("gagal");
        console.log("gagal");
        router.push("/register");
      }
    };

    verifyEmailLink();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 animate-pulse text-sm">
          Memverifikasi akun kamu... 🔄
        </p>
      </div>
    </div>
  );
}
