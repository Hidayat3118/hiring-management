"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyClient() {
  const router = useRouter();
  const { userData, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (userData) {
      if (userData.role === "admin") router.push("/admin/jobList");
      else router.push("/jobList");
      return;
    }

    const verifyEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem("emailForSignIn");
        if (!email)
          email = window.prompt("Masukkan email kamu untuk verifikasi:");

        try {
          if (!email || email.trim() === "") {
            toast.error("Email tidak valid");
            router.push("/register");
            return;
          }

          await signInWithEmailLink(auth, email, window.location.href);

          const userData = {
            email,
            role: "candidate",
            status: "verified",
            verifiedAt: new Date(),
            registeredAt: new Date(),
          };

          await setDoc(doc(db, "registeredEmails", email), userData, {
            merge: true,
          });

          window.localStorage.removeItem("emailForSignIn");
          toast.success("Akun berhasil diverifikasi!");

          if (userData.role === "admin") router.push("/admin/jobList");
          else router.push("/jobList");
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
        <Spinner />
        <p className="text-gray-600 animate-pulse text-sm mt-2">
          Memverifikasi akun kamu...
        </p>
      </div>
    </div>
  );
}
