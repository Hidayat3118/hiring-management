"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailLink, isSignInWithEmailLink } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

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
          // ✅ Validasi email
          if (!email || email.trim() === "") {
            toast.error("Email tidak valid");
            router.push("/register");
            return;
          }

          await signInWithEmailLink(auth, email, window.location.href);

          // 💾 Simpan ke Firestore dengan role default "candidate"
          const userData = {
            email: email,
            role: "candidate", // 👈 Default role = candidate
            status: "verified",
            verifiedAt: new Date(),
            registeredAt: new Date(),
          };

          // ✅ Validasi semua field ada
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

          console.log("✅ Data user berhasil disimpan:", userData);

          window.localStorage.removeItem("emailForSignIn");
          toast.success("Akun berhasil diverifikasi!");

          // 🔀 PERUBAHAN: Cek role dan redirect ke halaman sesuai role
          if (userData.role === "admin") {
            router.push("/admin/jobList"); // 👈 Admin ke admin/jobList
          } else {
            router.push("/jobList"); // 👈 Candidate ke jobList biasa
          }
        } catch (error) {
          console.error("❌ Error verifikasi:", error);
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
          <Spinner/>
        </p>
      </div>
    </div>
  );
}