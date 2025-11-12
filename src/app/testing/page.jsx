"use client";

export default function JobCard() {
  return (
    <div className="max-w-2xl mx-auto border rounded-xl p-4 flex items-center justify-between shadow-sm bg-white">
      {/* Kiri */}
      <div className="flex items-start gap-3">
        {/* Status badge */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
              Active
            </span>
            <span className="text-gray-500 text-sm">
              started on <b>1 Oct 2025</b>
            </span>
          </div>

          {/* Job Info */}
          <div className="mt-2">
            <h2 className="text-lg font-semibold">Front End Developer</h2>
            <p className="text-gray-600 text-sm mt-1">
              Rp7.000.000 - Rp8.000.000
            </p>
          </div>
        </div>
      </div>

      {/* Kanan */}
      <button className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-md">
        Manage Job
      </button>
    </div>
  );
}
