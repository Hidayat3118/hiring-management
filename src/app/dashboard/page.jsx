"use client";

import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRegCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaRegFileAlt,
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

const lamaran = [
  {
    id: 1,
    posisi: "Frontend Developer",
    perusahaan: "PT Maju Jaya",
    lokasi: "Jakarta",
    status: "Interview",
    tanggal: "12 Maret 2026",
  },
  {
    id: 2,
    posisi: "Backend Developer",
    perusahaan: "PT Teknologi Hebat",
    lokasi: "Bandung",
    status: "Applied",
    tanggal: "10 Maret 2026",
  },
  {
    id: 3,
    posisi: "UI/UX Designer",
    perusahaan: "Creative Studio",
    lokasi: "Surabaya",
    status: "Accepted",
    tanggal: "8 Maret 2026",
  },
  {
    id: 4,
    posisi: "Laravel Developer",
    perusahaan: "Digital Nusantara",
    lokasi: "Yogyakarta",
    status: "Rejected",
    tanggal: "5 Maret 2026",
  },
];

const getStatusConfig = (status) => {
  switch (status) {
    case "Applied":
      return {
        icon: <FaRegFileAlt className="text-amber-500" />,
        className: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "Interview":
      return {
        icon: <FaClock className="text-sky-500" />,
        className: "bg-sky-50 text-sky-700 border-sky-200",
      };
    case "Accepted":
      return {
        icon: <FaCheckCircle className="text-emerald-500" />,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "Rejected":
      return {
        icon: <FaTimesCircle className="text-rose-500" />,
        className: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        icon: <FaRegFileAlt className="text-gray-500" />,
        className: "bg-gray-50 text-gray-700 border-gray-200",
      };
  }
};

export default function LamaranPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Lamaran Saya
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Lihat daftar pekerjaan yang sudah kamu lamar dan status terbarunya.
          </p>
        </div>

        {/* List */}
        <div className="space-y-4">
          {lamaran.map((item) => {
            const status = getStatusConfig(item.status);

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Left */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <FaBriefcase className="text-lg" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {item.posisi}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.perusahaan}
                      </p>

                      <div className="mt-3 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>{item.lokasi}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <FaRegCalendarAlt className="text-gray-400" />
                          <span>{item.tanggal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                      {status.icon}
                      {item.status}
                    </span>

                    <button className="inline-flex items-center gap-2 text-sm font-medium text-cyan-600 transition hover:text-cyan-700">
                      Lihat Detail
                      <HiOutlineExternalLink className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}