"use client";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import JobFormAdmin from "@/components/jobFormAdmin";
import { useState } from "react";
export default function JobList() {
  const [open, setOpen] = useState();
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Job List</h1>
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src="/create-job.jpg"
            height={100}
            width={100}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="w-full flex gap-6">
        {/* Search Bar */}
        <div className="w-full max-w-6xl mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by job details"
              className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
          </div>
        </div>

        {/* Side Ad / Card */}
        <div className="relative w-96 rounded-xl shadow-lg overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 bg-[url('/mengajar.jpg')] bg-cover bg-center"></div>

          {/* Overlay hitam transparan */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Konten */}
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

      {/* Empty State */}
      <section className="flex flex-col items-center justify-center text-center mt-10">
        <Image
          src="/serch.svg"
          alt="Create job"
          width={224}
          height={224}
          quality={100}
          sizes="(max-width: 768px) 50vw, 224px"
          className="w-72  object-contain mb-8"
        />

        <h2 className="text-gray-800 font-medium text-lg">
          No job openings available
        </h2>
        <p className="text-gray-500 text-sm max-w-md mt-1">
          Create a job opening now and start the candidate process.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-5 bg-amber-400 cursor-pointer hover:bg-amber-500 text-gray-800 font-medium py-2 px-5 rounded-md shadow-sm flex items-center gap-2 transition"
        >
          Create a new job
        </button>
      </section>
       <JobFormAdmin open={open} onOpenChange={setOpen} />
    </main>
  );
}
