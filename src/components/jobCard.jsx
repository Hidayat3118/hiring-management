"use client";

import { useRouter } from "next/navigation";
import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRight,
} from "react-icons/hi2";

export default function JobCard({
  id,
  gajiMinimum,
  gajiMaksimum,
  status,
  waktuBuat,
  namaJob,
}) {
  const router = useRouter();

  const handleManage = () => {
    router.push(`/admin/manageJob/${id}`);
  };

  const statusStyles = {
    active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border border-amber-200",
    closed: "bg-red-50 text-red-700 border border-red-200",
    inactive: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  const normalizedStatus = status?.toLowerCase();
  const badgeClass =
    statusStyles[normalizedStatus] ||
    "bg-cyan-50 text-cyan-700 border border-cyan-200";

  return (
    <div className="group w-full max-w-3xl rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Content */}
        <div className="flex items-start gap-4">
          {/* Icon Box */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 shadow-sm">
            <HiOutlineBriefcase size={26} />
          </div>

          {/* Main Info */}
          <div className="flex-1">
            {/* Top Row */}
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeClass}`}
              >
                {status}
              </span>

              <div className="flex items-center gap-1 text-sm text-slate-500">
                <HiOutlineCalendarDays size={16} />
                <span>{waktuBuat}</span>
              </div>
            </div>

            {/* Job Title */}
            <h2 className="text-lg font-bold text-slate-800 md:text-xl">
              {namaJob}
            </h2>

            {/* Salary */}
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <HiOutlineCurrencyDollar size={18} className="text-cyan-600" />
              <p className="font-medium">
                Rp {gajiMinimum} - Rp {gajiMaksimum}
              </p>
            </div>
          </div>
        </div>

        {/* Right Button */}
        <button
          onClick={handleManage}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-md active:scale-[0.98]"
        >
          Manage Job
          <HiOutlineArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}