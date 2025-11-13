"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import Image from "next/image";
import JobFormAdmin from "@/components/jobFormAdmin";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import JobCard from "@/components/jobCard";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // 👈 TAMBAH import
import { Spinner } from "@/components/ui/spinner";

export default function JobList() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [open, setOpen] = useState();
  const [lowonganKerja, setLowonganKerja] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  // 🔐 Cek authorization
  useEffect(() => {
    if (!loading && (!user || userData?.role !== "admin")) {
      toast.error("Anda tidak memiliki akses ke halaman ini");
      router.push("/jobList");
    }
  }, [user, userData, loading, router]);

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

  // 🔓 Logout handler
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

  const filteredJobs = lowonganKerja.filter((job) =>
    job.namaLoker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 💫 Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-16"/>
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
      <header className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Job List</h1>

        {/* 🔹 Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src="/default.png"
                  height={100}
                  width={100}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* User Info di Menu */}
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-800">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Role:{" "}
                <span className="font-semibold text-cyan-600">Admin</span>
              </p>
            </div>

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
            >
              <IoLogOut className="mr-2" size={18} />
              {isLogoutLoading ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Search + Side Card */}
      <div className="w-full flex gap-6 mb-10">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by job name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
          </div>
        </div>

        {/* Side Ad / Card */}
        <div className="relative w-96 rounded-xl shadow-lg overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[url('/mengajar.jpg')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 text-white p-6 grid">
            <h3 className="font-medium text-sm mb-3">
              Recruit the best candidates
            </h3>
            <p className="text-xs text-gray-200 mb-6">
              Create jobs, invite, and hire with ease
            </p>
            <button
              onClick={() => setOpen(true)}
              className="w-full cursor-pointer bg-cyan-700 hover:bg-cyan-800 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2"
            >
              Create a new job
            </button>
          </div>
        </div>
      </div>

      {/* Card job */}
      <div className="w-full">
        {filteredJobs && filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="w-full mb-6">
              <JobCard
                id={job.id}
                gajiMaksimum={job.gajiMaksimum}
                gajiMinimum={job.gajiMinimum}
                status={job.status}
                waktuBuat={formatDate(job.tanggalBuat)}
                namaJob={job.namaLoker}
              />
            </div>
          ))
        ) : (
          <section className="flex flex-col items-center justify-center text-center mt-10">
            <Image
              src="/serch.svg"
              alt="Create job"
              width={224}
              height={224}
              quality={100}
              sizes="(max-width: 768px) 50vw, 224px"
              className="w-72 object-contain mb-8"
            />

            <h2 className="text-gray-800 font-medium text-lg">
              {searchQuery ? "No jobs found" : "No job openings available"}
            </h2>
            <p className="text-gray-500 text-sm max-w-md mt-1">
              {searchQuery
                ? `Try searching with different keywords`
                : "Create a job opening now and start the candidate process."}
            </p>

            {!searchQuery && (
              <button
                onClick={() => setOpen(true)}
                className="mt-5 bg-amber-400 cursor-pointer hover:bg-amber-500 text-gray-800 font-medium py-2 px-5 rounded-md shadow-sm flex items-center gap-2 transition"
              >
                Create a new job
              </button>
            )}
          </section>
        )}
      </div>

      <JobFormAdmin open={open} onOpenChange={setOpen} />
    </main>
  );
}
