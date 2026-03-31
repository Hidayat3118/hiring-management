"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
// firebase quary
import { collection, query, where, getDocs } from "firebase/firestore";
// UI Components
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { FiFileText, FiUpload, FiExternalLink } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Icons
import { HiOutlineUserCircle, HiOutlineSearch } from "react-icons/hi";
import {
  IoLogOutOutline,
  IoArrowBackOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { FiFilter, FiDownload } from "react-icons/fi";

// Auth
import { useAuth } from "@/context/AuthContext";

export default function ManageCandidate() {
  const [jobName, setJobName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const { user, userData, logout } = useAuth();

  const params = useParams();
  const router = useRouter();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Cek role admin
  useEffect(() => {
    if (!loading && (!user || userData?.role !== "admin")) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      router.push("/jobList");
    }
  }, [user, userData, loading, router]);

  // ambil data lowongan kerja berdasarkan jobId

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const q = query(
          collection(db, "applications"),
          where("jobId", "==", jobId),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCandidates(data);
      } catch (error) {
        console.error("Error ambil candidates:", error);
        toast.error("Gagal mengambil data pelamar");
      }
    };

    if (jobId) {
      fetchCandidates();
    }
  }, [jobId]);

  // Ambil data lowongan kerja
  useEffect(() => {
    const fetchJobName = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "lowonganKerja", jobId));

        if (jobDoc.exists()) {
          setJobName(jobDoc.data().namaLoker);
        } else {
          console.error("Job tidak ditemukan");
          toast.error("Lowongan kerja tidak ditemukan");
        }
      } catch (error) {
        console.error("Error ambil data job:", error);
        toast.error("Gagal mengambil data lowongan");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobName();
    } else {
      setLoading(false);
    }
  }, [jobId]);

  // Logout
  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);

      if (logout) {
        await logout();
      }

      toast.success("Berhasil logout");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal logout");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  // Kembali ke halaman job list
  const handleBackToJobList = () => {
    router.push("/admin/jobList");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 via-white to-cyan-50/40">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <button
                onClick={handleBackToJobList}
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 shadow-sm transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-md"
              >
                <IoArrowBackOutline size={16} />
                <span className="font-medium">Job List</span>
              </button>

              <span className="text-gray-400">/</span>

              <div className="inline-flex items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2 text-cyan-700">
                <IoPeopleOutline size={16} />
                <span className="font-medium">Manage Candidate</span>
              </div>
            </div>

            {/* Title Card */}
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-600">
                    Candidate Management
                  </p>
                  <h1 className="mt-1 text-   xl font-bold tracking-tight text-gray-800 md:text-2xl">
                    {jobName || "Job Title"}
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and manage all applicants for this position.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <Avatar className="h-11 w-11 transition group-hover:opacity-90">
                  <AvatarImage
                    src={user?.photoURL || "https://github.com/shadcn.png"}
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {user?.email ? user.email.charAt(0).toUpperCase() : "CN"}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden text-left md:block">
                  <p className="max-w-[160px] truncate text-sm font-semibold text-gray-800">
                    {user?.email || "No Email"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 rounded-2xl border border-gray-100 p-2 shadow-xl"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
                  <HiOutlineUserCircle size={24} className="text-gray-500" />
                </div>

                <div className="flex flex-col">
                  <p className="max-w-[180px] truncate text-sm font-semibold text-gray-800">
                    {user?.email || "No Email"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Role:{" "}
                    <span className="font-medium text-cyan-600">Admin</span>
                  </p>
                </div>
              </div>

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="mt-2 flex cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-red-600 transition hover:bg-red-50 focus:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IoLogOutOutline size={18} />
                <span className="text-sm font-medium">
                  {isLogoutLoading ? "Logging out..." : "Logout"}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-sm">
            <HiOutlineSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search candidate..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <FiFilter size={16} />
              Filter
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <FiDownload size={16} />
              Export
            </button>

            <div className="rounded-xl bg-cyan-50 px-4 py-2.5 text-sm font-medium text-cyan-700">
              Total Candidates:{" "}
              <span className="font-bold">{candidates.length}</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm text-gray-700">
              <thead className="bg-gradient-to-r from-gray-50 to-cyan-50/40 text-left text-gray-600">
                <tr>
                  <th className="w-10 p-4">
                    <input type="checkbox" className="accent-cyan-600" />
                  </th>
                  <th className="p-4 font-semibold">FULL NAME</th>
                  <th className="p-4 font-semibold">EMAIL ADDRESS</th>
                  <th className="p-4 font-semibold">PHONE NUMBER</th>
                  <th className="p-4 font-semibold">DATE OF BIRTH</th>
                  <th className="p-4 font-semibold">DOMICILE</th>
                  <th className="p-4 font-semibold">GENDER</th>
                  <th className="p-4 font-semibold">LINKEDIN LINK</th>
                  <th className="p-4 font-semibold">CV</th>
                </tr>
              </thead>

              {/* data dari candidat yang mendaftar */}
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4">
                      <div className="flex flex-col items-center justify-center px-4 py-8 text-center sm:px-6 sm:py-10">
                        <div className="mb-5 w-full max-w-[180px] sm:max-w-[200px]">
                          <Image
                            src="/serch.svg"
                            alt="No candidates yet"
                            width={400}
                            height={400}
                            className="h-auto w-full object-contain opacity-90"
                          />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-800 sm:text-xl">
                          No candidates yet
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                          Candidate data will appear here after applications are
                          submitted.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  candidates.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-4">
                        <input type="checkbox" />
                      </td>

                      <td className="p-4">{item.fullName}</td>
                      <td className="p-4">{item.email}</td>
                      <td className="p-4">{item.phone}</td>
                      <td className="p-4">{item.dob}</td>
                      <td className="p-4">{item.domicile}</td>
                      <td className="p-4">{item.pronoun}</td>

                      <td className="p-4">
                        <a
                          href={item.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.03] active:scale-[0.97]"
                        >
                          <FiExternalLink size={14} />
                          LinkedIn
                        </a>
                      </td>

                      <td className="">
                        {item.resumeUrl ? (
                          <a
                            href={item.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:scale-[1.03] active:scale-[0.97]"
                          >
                            <FiFileText size={14} />
                            View CV
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">No CV</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
