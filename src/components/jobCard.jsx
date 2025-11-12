"use client";

export default function JobCard({ gajiMinimum, gajiMaksimum, status, waktuBuat, namaJob }) {
  return (
    <div className="max-w-4xl rounded-xl px-8 py-6 flex items-center justify-between shadow-md bg-neutral-100">
      {/* Kiri */}
      <div className="flex items-start gap-3">
        {/* Status badge */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-6 py-1 rounded-md">
              {status}
            </span>
            <span className="text-gray-500 text-sm">{waktuBuat}</span>
          </div>

          {/* Job Info */}
          <div className="mt-2">
            <h2 className="text-lg font-semibold">{namaJob}</h2>
            <p className="text-gray-600 text-sm mt-1">Rp.{gajiMinimum} - Rp.{gajiMaksimum}</p>
          </div>
        </div>
      </div>

      {/* Kanan */}
      <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-6 py-1 rounded-md">
        Manage Job
      </button>
    </div>
  );
}
