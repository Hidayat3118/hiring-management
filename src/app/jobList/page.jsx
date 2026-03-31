"use client";
import Image from "next/image";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineBanknotes } from "react-icons/hi2";
import Navbar from "@/components/navbar";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
import { HiOutlineBriefcase, HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lowonganKerja, setLowonganKerja] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // cek user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/register");
      } else {
        setUser(user);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Ambil lowongan kerja dari firebase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lowonganKerja"));
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          let tanggalBuat = null;
          if (docData.tanggalBuat?.seconds) {
            tanggalBuat = new Date(docData.tanggalBuat.seconds * 1000);
          }

          return {
            id: doc.id,
            ...docData,
            tanggalBuat,
          };
        });

        setLowonganKerja(data);

        // Set default job (pertama di list)
        if (data.length > 0) {
          setSelectedJob(data[0]);
        }
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    if (user) {
      fetchJobs();
    }
  }, [user]);

  // serch loker
  const filteredJobs = lowonganKerja.filter((job) =>
    job.namaLoker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // state loading
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen flex justify-center py-6 md:py-10 px-3 md:px-6 mt-8 md:mt-16">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-7xl">
          {/* LEFT PANEL */}
          <div
            className="md:w-1/3 w-full border-b md:border-b-0 md:border-r overflow-y-auto max-h-[400px] mt-8 md:mt-1
          md:max-h-[calc(100vh-150px)] p-3 md:p-4"
          >
            {/* serch input*/}
            <div className="relative mb-4 md:mb-6">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Cari lowongan pekerjaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2
                 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>

            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={` border rounded-xl hover:shadow-md transition p-4 cursor-pointer flex gap-3 items-start mb-3 ${
                      selectedJob?.id === job.id
                        ? "border-cyan-300 bg-cyan-50 ring-1 ring-cyan-200"
                        : "border-gray-300 "
                    }`}
                  >
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border flex items-center justify-center bg-gray-50">
                      <Image
                        src="/perusahaan.svg"
                        alt="Company Logo"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-800 text-sm md:text-base">
                        {job.namaLoker}
                      </h2>

                      <div className="mt-1 flex items-center text-gray-500 text-xs md:text-sm gap-1">
                        <IoLocationOutline />
                        {job.lokasi || "Lokasi tidak tersedia"}
                      </div>

                      <div className="mt-1 flex items-center text-gray-500 text-xs md:text-sm gap-1">
                        <HiOutlineBanknotes />
                        {job.gajiMinimum && job.gajiMaksimum
                          ? `Rp ${job.gajiMinimum.toLocaleString()} - Rp ${job.gajiMaksimum.toLocaleString()}`
                          : "Gaji tidak tersedia"}
                      </div>
                    </div>
                  </div>
              
              ))
            ) : (
              <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
                <HiOutlineDocumentText
                  size={40}
                  className="mb-3 text-gray-400"
                />
                <p className="font-semibold">
                  {searchQuery
                    ? "Lowongan tidak ditemukan"
                    : "Belum ada lowongan"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery
                    ? "Coba gunakan kata kunci lain"
                    : "Silakan tambahkan lowongan baru"}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="md:w-2/3 w-full p-4 md:p-8">
            {selectedJob ? (
              <div>
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border flex items-center justify-center bg-gray-50">
                      <Image
                        src="/perusahaan.svg"
                        alt="Company Logo"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-md">
                          <HiOutlineBriefcase size={14} />
                          {selectedJob.tipePekerjaan || "Full-Time"}
                        </span>
                      </div>

                      <h1 className="text-base md:text-lg font-semibold text-gray-900">
                        {selectedJob.namaLoker}
                      </h1>

                      <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <HiOutlineBuildingOffice2 size={16} />
                        PT Mencari Kerja Sejati
                      </p>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <Link href={`/applyForm/${selectedJob.id}`}>
                    <button
                      className="w-full md:w-auto flex font-bold justify-center items-center gap-2 cursor-pointer
                     bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-3 text-sm md:text-base  rounded-xl
                      shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Apply
                      <FiArrowRight className="transition group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* DESCRIPTION */}
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  {selectedJob.deskripsiLoker ? (
                    <div className="space-y-3">
                      {selectedJob.deskripsiLoker
                        .split("\n")
                        .filter((line) => line.trim() !== "")
                        .map((line, index) => (
                          <p key={index} className="flex items-start gap-2">
                            
                            <span className="text-sm text-gray-700">
                              {line}
                            </span>
                          </p>
                        ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-12 text-gray-500">
                      <HiOutlineDocumentText
                        size={48}
                        className="mb-3 text-gray-400"
                      />
                      <p className="font-semibold text-lg">
                        Deskripsi Pekerjaan Tidak Ada
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Belum ada informasi yang tersedia
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <p>Pilih salah satu lowongan di atas untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
