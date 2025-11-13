"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext"; // 👈 TAMBAH import
import { Spinner } from "@/components/ui/spinner";

export default function VerifyPage() {
  const router = useRouter();
  const { userData, loading } = useAuth(); // 👈 Ambil dari context

  useEffect(() => {
    // Tunggu sampai context selesai loading
    if (loading) return;

    // Jika sudah login, redirect langsung
    if (userData) {
      if (userData.role === "admin") {
        router.push("/admin/jobList");
      } else {
        router.push("/jobList");
      }
      return;
    }

    const verifyEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          email = window.prompt("Masukkan email kamu untuk verifikasi:");
        }

        try {
          if (!email || email.trim() === "") {
            toast.error("Email tidak valid");
            router.push("/register");
            return;
          }

          await signInWithEmailLink(auth, email, window.location.href);

          const userData = {
            email: email,
            role: "candidate",
            status: "verified",
            verifiedAt: new Date(),
            registeredAt: new Date(),
          };

          if (
            !userData.email ||
            !userData.role ||
            !userData.status ||
            !userData.verifiedAt
          ) {
            toast.error("Data tidak lengkap. Coba lagi.");
            return;
          }

          await setDoc(
            doc(db, "registeredEmails", email),
            userData,
            { merge: true }
          );

          console.log("Data user berhasil disimpan:", userData);

          window.localStorage.removeItem("emailForSignIn");
          toast.success("Akun berhasil diverifikasi!");

          if (userData.role === "admin") {
            router.push("/admin/jobList");
          } else {
            router.push("/jobList");
          }
        } catch (error) {
          console.error("Error verifikasi:", error);
          toast.error("Verifikasi gagal. Coba lagi nanti.");
        }
      } else {
        toast.error("Link verifikasi tidak valid");
        router.push("/register");
      }
    };

    verifyEmailLink();
  }, [router, userData, loading]); 

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 animate-pulse text-sm">
          <Spinner/>
        </p>
      </div>
    </div>
  );
}