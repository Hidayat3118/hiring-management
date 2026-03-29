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
import {
  HiOutlineBriefcase,
  HiOutlineMapPin,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

export default function Page() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lowonganKerja, setLowonganKerja] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

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
      <div className="min-h-screen flex justify-center py-10 px-4 mt-8 md:mt-16">
        <div className="flex bg-white rounded-2xl shadow-md overflow-hidden w-full max-w-7xl">
          {/* kiri panel */}
          <div className="w-1/3 border-r overflow-y-auto p-4">
            {lowonganKerja.length > 0 ? (
              lowonganKerja.map((job) => (
                // kondisi pertama
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 cursor-pointer flex gap-3 items-start mb-4 ${
                    selectedJob?.id === job.id ? "border-cyan-400" : ""
                  }`}
                >
                  {/* logo */}
                  <div className=" rounded-md p-1 object-cover overflow-hidden border border-gray-300 flex items-center justify-center">
                    {" "}
                    <Image
                      src="/icon-rakamain.jfif"
                      alt="Company Logo"
                      width={50}
                      height={50}
                    />{" "}
                  </div>
                  {/* Job Info */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {job.namaLoker}
                    </h2>
                    {/* <p className="text-sm text-gray-500">
                      {job.namaPerusahaan || "Perusahaan Tidak Diketahui"}
                    </p> */}

                    <div className="mt-2 flex items-center text-gray-500 text-sm gap-1">
                      <IoLocationOutline />
                      {job.lokasi || "Lokasi tidak tersedia"}
                    </div>

                    <div className="mt-1 flex items-center text-gray-500 text-sm gap-1">
                      <HiOutlineBanknotes />
                      {job.gajiMinimum && job.gajiMaksimum
                        ? `Rp${job.gajiMinimum.toLocaleString()} - Rp${job.gajiMaksimum.toLocaleString()}`
                        : "Gaji tidak tersedia"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-8 font-bold">
                Belum ada lowongan tersedia
              </p>
            )}
          </div>

          {/* Right panel - Job detail */}
          <div className="w-2/3 p-8">
            {selectedJob ? (
              <div>
                {/* Header */}
                <div className="flex justify-between items-start  ">
                  {/* Left */}
                  <div className="flex items-start gap-4 ">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                      <Image
                        src="/icon-rakamain.jfif"
                        alt="Company Logo"
                        width={56}
                        height={56}
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-medium px-2.5 py-1 rounded-md">
                          <HiOutlineBriefcase size={14} />
                          {selectedJob.tipePekerjaan || "Full-Time"}
                        </span>
                      </div>

                      {/* Title */}
                      <h1 className="text-lg font-semibold text-gray-900 leading-snug">
                        {selectedJob.namaLoker}
                      </h1>

                      {/* Company + Location */}
                      <div className="flex flex-col gap-1 mt-1">
                        <p className="flex items-center gap-1 text-gray-500 text-sm">
                          <HiOutlineBuildingOffice2 size={16} />
                          Rakamain
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <Link href="/applyForm">
                    <button className="group flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2.5 text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Apply
                      <FiArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition"
                      />
                    </button>
                  </Link>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Job description */}
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  {selectedJob.deskripsiLoker ? (
                    <div className="space-y-3">
                      {selectedJob.deskripsiLoker
                        .split("\n")
                        .map((line, index) => (
                          <p key={index} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            <span className="text-sm text-gray-700 leading-relaxed">
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
              // kondisi kedua
              <div className="text-center text-gray-500 mt-20">
                <p>
                  Pilih salah satu lowongan di sebelah kiri untuk melihat detail
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
