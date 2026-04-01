"use client";

import Navbar from "@/components/navbar";
import { HiSparkles } from "react-icons/hi";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import CardDashboard from "@/components/cardDashboard";

export default function LamaranPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil lamaran user
  const getMyApplications = async (uid) => {
    const q = query(
      collection(db, "applications"),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          setJobs([]);
          setLoading(false);
          return;
        }

        const apps = await getMyApplications(user.uid);

        const jobsData = await Promise.all(
          apps.map(async (app) => {
            const jobRef = doc(db, "lowonganKerja", app.jobId);
            const jobSnap = await getDoc(jobRef);

            if (!jobSnap.exists()) return null;

            return {
              applicationId: app.id,
              applicationStatus: app.status, // 🔥 FIX (biar gak ketimpa)
              appliedAt: app.appliedAt,
              ...jobSnap.data(), // data job
            };
          })
        );

        setJobs(jobsData.filter(Boolean));
      } catch (error) {
        console.error("Error fetch data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <Navbar />

      <div className="mx-auto max-w-5xl mt-20 md:mt-24">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl">
                Lamaran Anda
              </h1>

              <div className="mt-1 flex items-center gap-1 text-base text-cyan-600">
                <HiSparkles />
                <span>Aktif dipantau</span>
              </div>
            </div>
          </div>

          <p className="mt-3 max-w-xl text-xs text-gray-500 sm:text-sm">
            Lihat daftar pekerjaan yang sudah kamu lamar dan status terbarunya.
          </p>
        </div>

        {/* LIST */}
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">Belum ada lamaran</p>
        ) : (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <CardDashboard
                key={job.applicationId}
                namaJob={job.namaLoker}
                lokasi={job.lokasi}
                waktu={job.appliedAt?.toDate().toLocaleDateString("id-ID")}
                status={job.applicationStatus} // 🔥 pakai ini
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}