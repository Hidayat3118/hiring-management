"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";

import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";

// ⚠️ Sesuaikan path useAuth dengan project kamu
import { useAuth } from "@/context/AuthContext";

export default function ManageCandidate() {
  const [jobName, setJobName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // ⚠️ Asumsi useAuth punya logout()
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

  // Kembali ke halaman sebelumnya
  const handleBackToJobList = () => {
    router.push("/admin/jobList");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 md:mt-8 md:flex-row md:items-start md:justify-between">
        <div>
          {/* Breadcrumb */}
          <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <button
              onClick={handleBackToJobList}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 shadow-sm transition hover:bg-gray-50"
            >
              Job List
            </button>
            <span>{`>`}</span>
            <span className="font-medium text-gray-700">Manage Candidate</span>
          </div>

          {/* Nama loker */}
          <h1 className="text-2xl font-semibold text-gray-800 md:text-3xl">
            {jobName || "Job Title"}
          </h1>
        </div>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <Avatar className="h-11 w-11 cursor-pointer transition group-hover:opacity-80">
                <AvatarImage
                  src={user?.photoURL || "https://github.com/shadcn.png"}
                  alt="Profile"
                />
                <AvatarFallback>
                  {user?.email ? user.email.charAt(0).toUpperCase() : "CN"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl border border-gray-100 p-2 shadow-lg"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <HiOutlineUserCircle size={24} className="text-gray-500" />
              </div>

              <div className="flex flex-col">
                <p className="max-w-[140px] truncate text-sm font-semibold text-gray-800">
                  {user?.email || "No Email"}
                </p>
                <p className="text-xs text-gray-500">
                  Role: <span className="font-medium text-cyan-600">Admin</span>
                </p>
              </div>
            </div>

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-50 focus:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoLogOutOutline size={18} />
              <span className="text-sm font-medium">
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm text-gray-700">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="p-4 w-10">
                  <input type="checkbox" className="accent-cyan-600" />
                </th>
                <th className="p-4 font-semibold">FULL NAME</th>
                <th className="p-4 font-semibold">EMAIL ADDRESS</th>
                <th className="p-4 font-semibold">PHONE NUMBER</th>
                <th className="p-4 font-semibold">DATE OF BIRTH</th>
                <th className="p-4 font-semibold">DOMICILE</th>
                <th className="p-4 font-semibold">GENDER</th>
                <th className="p-4 font-semibold">LINKEDIN LINK</th>
              </tr>
            </thead>
            <tbody>
              {/* nanti isi data Firestore di sini */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}