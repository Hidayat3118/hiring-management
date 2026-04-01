"use client";

import Image from "next/image";
import { FaMapMarkerAlt, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

// Function untuk warna status
const getStatusStyle = (status) => {
  switch (status) {
    case "submitted":
      return "bg-green-50 text-green-700 border-green-200";
    case "reviewed":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "accepted":
      return "bg-cyan-50 text-cyan-700 border-cyan-200";
      n;
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

// Component (SUDAH BENAR)
const CardDashboard = ({ namaJob, lokasi, waktu, status }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        {/* LEFT */}
        <div className="flex gap-3 sm:gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={"/perusahaan.svg"}
              width={60}
              height={60}
              alt="logo perusahaan"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              {namaJob}
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              PT Mencari Kerja Sejati
            </p>

            {/* Meta */}
            <div className="mt-3 flex flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:flex-wrap sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-gray-400 text-xs sm:text-sm" />
                <span>{lokasi}</span>
              </div>

              <div className="flex items-center gap-2">
                <FaRegCalendarAlt className="text-gray-400 text-xs sm:text-sm" />
                <span>Dilamar {waktu}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-row items-center justify-between gap-3 md:flex-col md:items-end">
          {/* Status */}
          <span
            className={`inline-flex items-center justify-center rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusStyle(
              status,
            )}`}
          >
            {status}
          </span>

          {/* Button */}
          <button className="inline-flex items-center gap-2 text-xs font-medium text-cyan-600 transition hover:text-cyan-700 sm:text-sm">
            Lihat Detail
            <HiOutlineExternalLink />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardDashboard;
