"use client";
import { useSearchParams } from "next/navigation";
export default function CheckEmailPage() {
  const params = useSearchParams();
  const email = params.get("email");
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-10 text-center max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Periksa Email Anda
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Kami sudah mengirimkan link login ke{" "}
          <span className="font-medium text-gray-800">{email}</span> yang
          berlaku dalam <span className="font-semibold">30 menit</span>
        </p>

        {/* Gambar ilustrasi */}
        <div className="flex justify-center">
        
        </div>
      </div>
    </div>
  );
}
