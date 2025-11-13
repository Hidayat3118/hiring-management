"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Spinner } from "@/components/ui/spinner";

export default function ManageCandidate() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id; // 👈 Ambil ID dari URL

  const [jobName, setJobName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobName = async () => {
      try {
        // 🔍 Ambil data loker dari Firestore berdasarkan ID
        const jobDoc = await getDoc(doc(db, "lowonganKerja", jobId));

        if (jobDoc.exists()) {
          setJobName(jobDoc.data().namaLoker); // 👈 Simpan nama loker
        } else {
          console.error("Job tidak ditemukan");
        }
      } catch (error) {
        console.error("Error ambil data job:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobName();
    }
  }, [jobId]);

  const handleBackToJobList = () => {
    router.push("/admin/jobList");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between mt-10">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <button
              onClick={handleBackToJobList}
              className="border border-gray-300 bg-white hover:bg-gray-50 px-3 py-1 rounded-md shadow-sm"
            >
              Job List
            </button>
            <span>{`>`}</span>
            <span className="font-medium text-gray-700">Manage Candidate</span>
          </div>

          {/* Header - tampilkan nama loker dari Firestore */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            {jobName || "Loading..."} {/* 👈 Tampilkan nama loker */}
          </h1>
        </div>
        {/* avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src="/default.png"
            height={100}
            width={100}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl overflow-hidden border border-gray-200 px-12">
        <table className="w-full text-sm text-gray-700">
          <thead className="text-gray-600 text-left">
            <tr className="mb-8">
              <th className="p-3 w-10">
                <input type="checkbox" className="accent-blue-600" />
              </th>
              <th className="p-3 font-semibold">FULL NAME</th>
              <th className="p-3 font-semibold">EMAIL ADDRESS</th>
              <th className="p-3 font-semibold">PHONE NUMBER</th>
              <th className="p-3 font-semibold">DATE OF BIRTH</th>
              <th className="p-3 font-semibold">DOMICILE</th>
              <th className="p-3 font-semibold">GENDER</th>
              <th className="p-3 font-semibold">LINKEDIN LINK</th>
            </tr>
          </thead>
          <tbody>
            {/* nanti ini diisi dari Firestore */}
            {/* contoh struktur:
                candidates.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3"><input type="checkbox" /></td>
                    <td className="p-3">{c.fullName}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3">{c.dob}</td>
                    <td className="p-3">{c.domicile}</td>
                    <td className="p-3">{c.gender}</td>
                    <td className="p-3 text-blue-600 underline">
                      <a href={c.linkedin} target="_blank" rel="noreferrer">
                        {c.linkedin}
                      </a>
                    </td>
                  </tr>
                ))
            */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
