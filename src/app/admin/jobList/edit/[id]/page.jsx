"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Spinner } from "@/components/ui/spinner";
import { FaRupiahSign } from "react-icons/fa6";

import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiFileText,
  FiArrowLeft,
  FiSave,
  FiEdit3,
} from "react-icons/fi";
import { toast } from "sonner";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();

  const id = useMemo(() => {
    if (!params?.id) return null;
    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    namaLoker: "",
    tipePekerjaan: "Full-Time",
    deskripsiLoker: "",
    lokasi: "",
    gajiMinimum: "",
    gajiMaksimum: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "lowonganKerja", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setForm({
            namaLoker: data.namaLoker || "",
            tipePekerjaan: data.tipePekerjaan || "Full-Time",
            deskripsiLoker: data.deskripsiLoker || "",
            lokasi: data.lokasi || "",
            gajiMinimum: data.gajiMinimum?.toString() || "",
            gajiMaksimum: data.gajiMaksimum?.toString() || "",
          });
        } else {
          toast.error("Data lowongan tidak ditemukan");
          router.back();
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   edit lowongan kerja

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    const minSalary = Number(form.gajiMinimum.replace(/\D/g, ""));
    const maxSalary = Number(form.gajiMaksimum.replace(/\D/g, ""));

    if (
      isNaN(minSalary) ||
      isNaN(maxSalary) ||
      minSalary <= 0 ||
      maxSalary <= 0
    ) {
      toast.error("Salary minimum dan maksimum harus berupa angka yang valid");
      return;
    }

    if (minSalary > maxSalary) {
      toast.error("Salary minimum tidak boleh lebih besar dari maksimum");
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "lowonganKerja", id), {
        ...form,
        gajiMinimum: minSalary,
        gajiMaksimum: maxSalary,
      });

      toast.success("Lowongan berhasil diperbarui");
      router.push("/admin/jobList");
    } catch (error) {
      console.error(error);
      toast.error("Gagal update");
    } finally {
      setSaving(false);
    }
  };

// loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Header */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <FiArrowLeft size={18} />
          </button>

          <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
            <FiEdit3 size={14} />
            Edit Job Posting
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Main Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Job Details Card */}
              <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3"></div>

                <div className="space-y-5">
                  {/* Job Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Job Name
                    </label>
                    <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-sm">
                      <input
                        type="text"
                        name="namaLoker"
                        value={form.namaLoker}
                        onChange={handleChange}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                        placeholder="Frontend Developer"
                      />
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">
                      Job Type
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {["Full-Time", "Intern", "Part-Time"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              tipePekerjaan: type,
                            }))
                          }
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                            form.tipePekerjaan === type
                              ? "border-cyan-500 bg-cyan-500 text-white shadow-md shadow-cyan-200"
                              : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Job Description
                    </label>
                    <div className="group flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-sm">
                      <textarea
                        name="deskripsiLoker"
                        value={form.deskripsiLoker}
                        onChange={handleChange}
                        rows={7}
                        className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                        placeholder="Tulis deskripsi pekerjaan, tanggung jawab, dan kualifikasi..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Salary Card */}
              <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Location & Salary
                    </h2>
                    <p className="text-sm text-slate-500">
                      Tentukan lokasi kerja dan rentang gaji.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Location */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Location
                    </label>
                    <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-sm">
                      <FiMapPin className="shrink-0 text-slate-400 group-focus-within:text-cyan-600" />
                      <input
                        type="text"
                        name="lokasi"
                        value={form.lokasi}
                        onChange={handleChange}
                        className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                        placeholder="Jakarta / Remote / Hybrid"
                      />
                    </div>
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Salary Range
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-sm">
                        <FaRupiahSign className="shrink-0 text-slate-400 group-focus-within:text-cyan-600" />
                        <input
                          type="text"
                          name="gajiMinimum"
                          value={form.gajiMinimum}
                          onChange={handleChange}
                          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                          placeholder="Minimum salary"
                        />
                      </div>

                      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-300 focus-within:border-cyan-400 focus-within:bg-white focus-within:shadow-sm">
                        <FaRupiahSign className="shrink-0 text-slate-400 group-focus-within:text-cyan-600" />
                        <input
                          type="text"
                          name="gajiMaksimum"
                          value={form.gajiMaksimum}
                          onChange={handleChange}
                          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                          placeholder="Maximum salary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-6">
                <h3 className="text-base font-bold text-slate-900">
                  Live Preview
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Ringkasan data lowongan yang sedang kamu edit.
                </p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Job Name
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {form.namaLoker || "Belum diisi"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Job Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {form.tipePekerjaan}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {form.lokasi || "Belum diisi"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary Range
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {form.gajiMinimum || "0"} - {form.gajiMaksimum || "0"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-sm sm:p-6">
                <h3 className="text-base font-bold text-slate-900">Actions</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Simpan perubahan atau kembali ke halaman sebelumnya.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-white transition-all duration-300 hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <FiSave size={18} />
                    {saving ? "Saving..." : "Update Job"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50"
                  >
                    <FiArrowLeft size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
