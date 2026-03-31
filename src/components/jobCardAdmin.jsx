"use client";

import { useRouter } from "next/navigation";
import {
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineArrowRight,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/navigation";

export default function JobCard({
  id,
  gajiMinimum,
  gajiMaksimum,
  status,
  waktuBuat,
  namaJob,
  onDelete,
}) {
  const router = useRouter();

  const handleManage = () => {
    router.push(`/admin/manageJob/${id}`);
  };

  const handleEdit = () => {
    router.push(`/admin/jobList/edit/${id}`);
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
    <div className="group w-full rounded-2xl border border-slate-200 bg-white p-4 transition-all shadow-sm duration-300 hover:-translate-y-1 hover:shadow-lg md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex gap-3 md:gap-4">
          {/* ICON */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 shadow-sm md:h-14 md:w-14">
            <HiOutlineBriefcase size={22} className="md:size-6" />
          </div>

          {/* INFO */}
          <div className="flex-1">
            {/* STATUS + DATE */}
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize md:text-xs ${badgeClass}`}
              >
                {status}
              </span>

              <div className="flex items-center gap-1 text-xs text-slate-500 md:text-sm">
                <HiOutlineCalendarDays size={14} />
                <span>{waktuBuat}</span>
              </div>
            </div>

            {/* TITLE */}
            <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800 md:text-lg">
              {namaJob}
            </h2>

            {/* SALARY */}
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 md:text-sm">
              <HiOutlineCurrencyDollar size={16} className="text-cyan-600" />
              <p className="font-medium">
                Rp {gajiMinimum} - Rp {gajiMaksimum}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:flex-wrap md:justify-end">
          {/* Edit */}
  
            <button onClick={handleEdit}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300
             bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-300 hover:border-cyan-300
              hover:bg-cyan-50 hover:text-cyan-700 hover:shadow-sm active:scale-[0.98] sm:w-auto md:px-4 md:py-3 md:text-sm"
            >
              <HiOutlinePencilSquare size={17} />
              Edit
            </button>
      

          {/* Delete */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => {}}
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition-all duration-300 hover:border-red-200 hover:bg-red-100 hover:text-red-700 hover:shadow-sm active:scale-[0.98] sm:w-auto md:px-4 md:py-3 md:text-sm"
              >
                <HiOutlineTrash size={17} />
                Delete
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md rounded-2xl border border-red-100 p-0 overflow-hidden">
              {/* Top Accent */}

              <div className="p-6">
                <AlertDialogHeader className="space-y-4">
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
                    <HiOutlineTrash size={26} />
                  </div>

                  <div className="space-y-2">
                    <AlertDialogTitle className="text-left text-xl font-bold text-slate-800">
                      Delete Job Posting?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-left text-sm leading-relaxed text-slate-500">
                      Are you sure you want to delete{" "}
                      <span className="font-semibold text-slate-700">
                        "{namaJob}"
                      </span>
                      ? This action will permanently remove the job posting and
                      cannot be undone.
                    </AlertDialogDescription>
                  </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-6 flex-col gap-2 sm:flex-row sm:justify-end">
                  <AlertDialogCancel className="mt-0 rounded-xl border-slate-300 px-4 py-2.5 text-slate-700 hover:bg-slate-50 cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  {/* confirm delete */}
                  <AlertDialogAction
                    onClick={() => onDelete(id)}
                    className="rounded-xl bg-red-600 px-4 py-2.5 text-white hover:bg-red-700 focus:ring-red-300 cursor-pointer"
                  >
                    Yes, Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>

          {/* Manage */}
          <button
            onClick={handleManage}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-cyan-700 hover:shadow-md active:scale-[0.98] sm:w-auto md:px-5 md:py-3 md:text-sm"
          >
            Manage
            <HiOutlineArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
