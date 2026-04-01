"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import JobFormAdmin from "@/components/jobFormAdmin";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import JobCard from "@/components/jobCardAdmin";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { IoLogOutOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi2";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

export default function JobList() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [open, setOpen] = useState();
  const [lowonganKerja, setLowonganKerja] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // Cek role admin
  useEffect(() => {
    if (!loading && (!user || userData?.role !== "admin")) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      router.push("/jobList");
    }
  }, [user, userData, loading, router]);

  // nampilin lowongan kerja
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
            tanggalBuat: tanggalBuat,
          };
        });
        setLowonganKerja(data);
      } catch (error) {
        console.error("Gagal ambil data:", error);
      }
    };

    if (!loading && user && userData?.role === "admin") {
      fetchJobs();
    }
  }, [loading, user, userData]);

  const formatDate = (date) => {
    if (!date) return "-";
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLogoutLoading(true);
      await signOut(auth);
      toast.success("Logout berhasil!");
      router.push("/login/password");
    } catch (error) {
      console.error("Error logout:", error);
      toast.error("Gagal logout. Coba lagi nanti.");
    } finally {
      setIsLogoutLoading(false);
    }
  };

  // serch or filter lowongan perkerjaan
  const filteredJobs = lowonganKerja.filter((job) =>
    job.namaLoker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // function hapus loker
  const deleteLowongan = async (id) => {
    try {
      await deleteDoc(doc(db, "lowonganKerja", id));
      setLowonganKerja(prev => prev.filter(item => item.id !== id));
      toast.success("Lowongan berhasil di hapus");
    } catch (error) {
      console.error("gagal menghapus", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-16" />
      </div>
    );
  }

  // authorized
  if (!user || userData?.role !== "admin") {
    return null;
  }

  return (
    <main className="flex flex-col items-center px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-6 ">
        <h1 className="text-lg md:text-xl font-semibold text-gray-800">
          Job List
        </h1>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 cursor-pointer group rounded-full ">
              {/* Avatar */}
              <Avatar className="h-12 w-12 md:h-12 md:w-12 cursor-pointer hover:opacity-80 transition">
                <AvatarImage
                  src={"/"}
                  alt="Profile"
                />
                <AvatarFallback className="bg-yellow-500 text-green-800">
                  {user?.email ? user.email.charAt(0).toUpperCase() : "CN"}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl shadow-lg border border-gray-100 p-2"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <HiOutlineUserCircle size={24} className="text-gray-500" />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                  {user?.email}
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
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 transition"
            >
              <IoLogOutOutline size={18} />
              <span className="text-sm font-medium">
                {isLogoutLoading ? "Logging out..." : "Logout"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="w-full flex flex-col lg:flex-row gap-6 mb-10">
        {/* LEFT CONTENT */}
        <div className="flex-1">
          {/* SEARCH BAR */}
          <div className="relative mb-4 md:mb-6">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

            <input
              type="text"
              placeholder="Cari lowongan pekerjaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            />
          </div>

          {/* JOB LIST */}
          <div className="w-full">
            {filteredJobs && filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id}>
                    <JobCard
                      id={job.id}
                      gajiMaksimum={job.gajiMaksimum}
                      gajiMinimum={job.gajiMinimum}
                      status={job.status}
                      waktuBuat={formatDate(job.tanggalBuat)}
                      namaJob={job.namaLoker}
                      onDelete={deleteLowongan}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <section className="flex flex-col items-center justify-center text-center mt-12 px-4">
                <Image
                  src="/serch.svg"
                  alt="Empty state"
                  width={200}
                  height={200}
                  className="w-52 md:w-64 object-contain mb-6 opacity-90"
                />

                <h2 className="text-gray-800 font-semibold text-lg">
                  {searchQuery
                    ? "Lowongan tidak ditemukan"
                    : "Belum ada lowongan"}
                </h2>

                <p className="text-gray-500 text-sm max-w-md mt-2">
                  {searchQuery
                    ? "Coba gunakan kata kunci lain"
                    : "Buat lowongan baru untuk mulai merekrut kandidat terbaik."}
                </p>

                {!searchQuery && (
                  <button
                    onClick={() => setOpen(true)}
                    className="mt-5 bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-2 transition"
                  >
                    Create a new job
                  </button>
                )}
              </section>
            )}
          </div>
        </div>

        {/* RIGHT SIDE CARD */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="relative rounded-2xl overflow-hidden shadow-md h-48 lg:h-60 lg:sticky lg:top-24">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/mengajar.jpg')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 text-white p-5 flex flex-col justify-end h-full">
              <h3 className="font-semibold text-sm mb-1">
                Recruit the best candidates
              </h3>

              <p className="text-xs text-gray-200 mb-4">
                Create jobs, invite, and hire with ease
              </p>

              <button
                onClick={() => setOpen(true)}
                className="w-full bg-cyan-600 cursor-pointer hover:bg-cyan-700 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition"
              >
                Create a new job
              </button>
            </div>
          </div>
        </div>
      </div>

      <JobFormAdmin open={open} onOpenChange={setOpen} />
      
    </main>
  );
}
