"use client";
import { useState } from "react";
import { TbInfoSquareFilled } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { IoSearch } from "react-icons/io5";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FiUpload, FiFileText } from "react-icons/fi";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
// Data provinsi Indonesia (5 contoh)
const INDONESIAN_PROVINCES = [
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Sumatera Selatan",
  "Bangka Belitung",
  "Bengkulu",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua",
  "Papua Barat",
  "Papua Selatan",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Barat Daya",
];

export default function ApplyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+62");
  const [pageLoading, setPageLoading] = useState(true);
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const [user,setUser] = useState(null);

   // cek user login
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.push("/register");
        } else {
          setUser(user);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [router]);

  // state form
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    pronoun: "",
    domicile: "",
    phone: "",
    email: "",
    linkedin: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    dob: "",
    pronoun: "",
    domicile: "",
    phone: "",
    email: "",
    linkedin: "",
  });

  // Handle tambah lamaran
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      toast.error("Kamu harus login dulu");
      setLoading(false);
      return;
    }

    if (!validateForm()) {
      toast.error("Pastikan semua data terisi dengan benar");
      setLoading(false);
      return;
    }

    // Validasi file CV
    if (!file) {
      toast.error("CV wajib diupload");
      setLoading(false);
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("CV harus berupa file PDF");
      setLoading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran CV maksimal 2MB");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload CV ke Cloudinary lewat API route
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadRes = await fetch("/api/upload-cv", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Gagal upload CV");
      }

      // 2. Siapkan data lamaran + hasil upload CV
      const applicationData = {
        fullName: form.fullName.trim(),
        dob: form.dob,
        pronoun: form.pronoun,
        domicile: form.domicile,
        phone: form.phone.trim(),
        phoneCountryCode: countryCode,
        email: form.email.trim(),
        linkedin: form.linkedin.trim(),
        status: "submitted",
        jobId: id,
        appliedAt: serverTimestamp(),
        // user id
        userId: user.uid,
        // Data CV dari Cloudinary
        resumeUrl: uploadData.resumeUrl,
        resumePublicId: uploadData.resumePublicId,
        resumeFileName: uploadData.resumeFileName,
      };

      // 3. Simpan ke Firestore
      console.log("applicationData FINAL:", applicationData);

      const docRef = await addDoc(
        collection(db, "applications"),
        applicationData,
      );

      // 4. Reset form
      setForm({
        fullName: "",
        dob: "",
        pronoun: "",
        domicile: "",
        phone: "",
        email: "",
        linkedin: "",
      });
      setCountryCode("+62");
      setErrors({});
      setFile(null);

      toast.success("Aplikasi berhasil dikirim!");

      setTimeout(() => {
        router.push("/jobList");
      }, 1000);
    } catch (error) {
      console.error("❌ Error menyimpan Lamaran:", error);
      toast.error(error.message || "Gagal mengirim Lamaran. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  //Validasi form
  const validateForm = () => {
    const newErrors = {};
    const phoneDigits = (form.phone || "").replace(/\D/g, "");

    if (!form.fullName.trim()) {
      newErrors.fullName = "Nama lengkap wajib diisi";
    }

    if (!form.dob) {
      newErrors.dob = "Tanggal lahir wajib diisi";
    }

    if (!form.pronoun) {
      newErrors.pronoun = "Pilih pronoun Anda";
    }

    if (!form.domicile) {
      newErrors.domicile = "Domisili wajib diisi";
    }

    if (!form.phone?.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 digit";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.linkedin.trim()) {
      newErrors.linkedin = "URL LinkedIn wajib diisi";
    } else if (!form.linkedin.includes("linkedin.com")) {
      newErrors.linkedin = "URL LinkedIn tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // loading halaman
  useEffect(() => {
    const loadPage = async () => {
      setPageLoading(false);
    };

    loadPage();
  }, []);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-16" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-start py-10 px-4">
      {/* form */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl lg:p-8">
        <div className="mb-4 overflow-y-auto bg-white rounded-md shadow-md w-full p-8">
          {/* text di atas */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* LEFT */}
            <div className="flex items-start md:items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center rounded-lg border border-gray-300 p-2 bg-white hover:bg-gray-100 transition cursor-pointer"
              >
                <FaArrowLeft className="text-lg text-gray-700" />
              </button>

              <div>
                <h1 className="text-lg md:text-xl font-semibold text-gray-800 leading-snug">
                  Lamar Posisi{" "}
                  <span className="text-cyan-600">Frontend Developer</span>
                </h1>

                <p className="text-xs md:text-sm text-gray-500">
                  Di PT Mencari Kerja Sejati
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 bg-red-50 text-red-500 text-xs md:text-sm px-3 py-2 rounded-lg w-fit">
              <TbInfoSquareFilled className="text-lg" />
              <span>Field ini wajib diisi</span>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama lengkap<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal lahir<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.dob
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </div>

          {/* Pronoun */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pronoun (Jenis kelamin)<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pronoun"
                  value="perempuan"
                  checked={form.pronoun === "perempuan"}
                  onChange={handleChange}
                />
                <span className="text-sm text-gray-700">Perempuan</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pronoun"
                  value="laki-laki"
                  checked={form.pronoun === "laki-laki"}
                  onChange={handleChange}
                />
                <span className="text-sm text-gray-700">Laki-laki</span>
              </label>
            </div>
            {errors.pronoun && (
              <p className="text-red-500 text-xs mt-2">{errors.pronoun}</p>
            )}
          </div>

          {/* Domicile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domisili<span className="text-red-500">*</span>
            </label>
            <select
              name="domicile"
              value={form.domicile}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 ${
                errors.domicile
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            >
              <option value="">Pilih Provinsi</option>
              {INDONESIAN_PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {errors.domicile && (
              <p className="text-red-500 text-xs mt-1">{errors.domicile}</p>
            )}
          </div>

          {/* No Hp */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nomor telepon<span className="text-red-500">*</span>
            </label>

            <div
              className={`rounded-xl border bg-white transition-all duration-300 ${
                errors.phone
                  ? "border-red-500 ring-2 ring-red-100"
                  : "border-gray-300 hover:border-cyan-300 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-100"
              }`}
            >
              <PhoneInput
                defaultCountry="id"
                value={form.phone}
                onChange={(phone) =>
                  setForm((prev) => ({
                    ...prev,
                    phone,
                  }))
                }
                inputClassName="!w-full !border-0 !bg-transparent !px-3 !py-2.5 !text-sm !text-gray-700 placeholder:!text-gray-400 focus:!outline-none focus:!ring-0"
                countrySelectorStyleProps={{
                  buttonClassName:
                    "!border-0 !border-r !border-gray-300 !bg-white hover:!bg-gray-50 !px-3 !py-2.5 !rounded-l-xl",
                  dropdownStyleProps: {
                    className:
                      "!z-50 !mt-2 !rounded-xl !border !border-gray-200 !shadow-xl",
                    listItemClassName:
                      "hover:!bg-cyan-50 !px-3 !py-2 transition-colors duration-200",
                  },
                }}
                placeholder="81XXXXXXXXX"
                forceDialCode={true}
              />
            </div>

            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="linkedin"
              value={form.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                errors.linkedin
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-cyan-500"
              }`}
            />
            {errors.linkedin && (
              <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>
            )}
          </div>

          {/* Upload CV */}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Upload CV (PDF)
            </label>

            <label className="flex items-center justify-between w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-cyan-600 transition">
              <div className="flex items-center gap-3">
                <FiFileText className="text-xl text-gray-500" />

                <div className="text-sm">
                  {file ? (
                    <span className="text-gray-800 font-medium">
                      {file.name}
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      Pilih file PDF (max 2MB)
                    </span>
                  )}
                </div>
              </div>

              <FiUpload className="text-xl text-gray-500" />

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-cyan-700 cursor-not-allowed"
                : "bg-cyan-700 hover:bg-cyan-800 cursor-pointer"
            } text-white`}
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 size-5 text-white" />
                Mengirim...
              </>
            ) : (
              "Kirim Lamaran"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
