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

export default function Page() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 🔹 State untuk data lowongan dan yang dipilih
  const [lowonganKerja, setLowonganKerja] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  // 🔹 Cek auth login
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

  // 🔹 Ambil data dari Firestore
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
          {/* Left panel - Job list */}
          <div className="w-1/3 border-r overflow-y-auto p-4">
            {lowonganKerja.length > 0 ? (
              lowonganKerja.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 cursor-pointer flex gap-3 items-start mb-4 ${
                    selectedJob?.id === job.id
                      ? "border-cyan-400"
                      : ""
                  }`}
                >
                  {/* Logo */}
                  {/* Logo */}{" "}
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
                    <p className="text-sm text-gray-500">
                      {job.namaPerusahaan || "Perusahaan Tidak Diketahui"}
                    </p>

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
              <p className="text-center text-gray-500 mt-8">
                Belum ada lowongan tersedia
              </p>
            )}
          </div>

          {/* Right panel - Job detail */}
          <div className="w-2/3 p-8">
            {selectedJob ? (
              <>
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className=" rounded-md p-1 object-cover overflow-hidden border border-gray-300 flex items-center justify-center">
                      {" "}
                      <Image
                        src="/icon-rakamain.jfif"
                        alt="Company Logo"
                        width={50}
                        height={50}
                      />{" "}
                    </div>
                    <div className="">
                      <span className="inline-block  text-xs bg-green-700 text-white font-medium px-2 py-1 rounded mb-3">
                        {selectedJob.tipePekerjaan || "Full-Time"}
                      </span>
                      <h1 className="text-xl font-semibold text-gray-800 mb-1">
                        {selectedJob.namaLoker}
                      </h1>
                      <p className="text-gray-500 text-sm">
                        {selectedJob.namaPerusahaan ||
                          "Perusahaan tidak diketahui"}
                      </p>
                    </div>
                  </div>

                  <Link href="/applyForm">
                    <button className="bg-yellow-400 text-gray-900 px-6 py-2 text-sm cursor-pointer rounded-lg font-medium hover:bg-yellow-500 transition">
                      Apply
                    </button>
                  </Link>
                </div>

                <hr className="my-6 border-gray-200" />

                {/* Job description */}
                <div className="text-gray-700 text-sm leading-relaxed space-y-2">
                  {selectedJob.deskripsi ? (
                    <p>{selectedJob.deskripsi}</p>
                  ) : (
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Develop, test, and maintain responsive, high-performance
                        web applications using modern front-end technologies.
                      </li>
                      <li>
                        Collaborate with UI/UX designers to translate wireframes
                        and prototypes into functional code.
                      </li>
                      <li>
                        Ensure cross-browser compatibility and optimize
                        applications for maximum speed.
                      </li>
                      <li>
                        Troubleshoot and debug issues to improve usability.
                      </li>
                    </ul>
                  )}
                </div>
              </>
            ) : (
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
