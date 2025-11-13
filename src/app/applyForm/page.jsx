"use client";
import { useState } from "react";
import { TbInfoSquareFilled } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { IoSearch } from "react-icons/io5"; // 👈 TAMBAH icon search

// Data negara dengan bendera emoji (5 contoh)
const COUNTRIES = [
  { code: "ID", dial: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "MY", dial: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", dial: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", dial: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "PH", dial: "+63", name: "Philippines", flag: "🇵🇭" },
];

// 🏙️ Data provinsi Indonesia (5 contoh)
const INDONESIAN_PROVINCES = [
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Timur",
  "Bali",
  "Sumatera Utara",
];

export default function ApplyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+62");
  const [searchCountry, setSearchCountry] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // 🔍 Filter negara berdasarkan search
  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      country.dial.includes(searchCountry)
  );

  // 🔄 Pilih negara
  const handleSelectCountry = (dial) => {
    setCountryCode(dial);
    setSearchCountry("");
    setShowCountryDropdown(false);
  };

  // Dapatkan bendera negara yang dipilih
  const selectedCountryFlag = COUNTRIES.find(
    (c) => c.dial === countryCode
  )?.flag || "🏳️";

  // ✅ Validasi form
  const validateForm = () => {
    const newErrors = {};

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

    if (!form.phone.trim()) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (!/^\d{9,}$/.test(form.phone)) {
      newErrors.phone = "Nomor telepon minimal 9 digit";
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

  // 💾 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Pastikan semua data terisi dengan benar");
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        fullName: form.fullName.trim(),
        dob: form.dob,
        pronoun: form.pronoun,
        domicile: form.domicile,
        phone: form.phone.trim(),
        phoneCountryCode: countryCode,
        email: form.email.trim(),
        linkedin: form.linkedin.trim(),
        status: "pending",
        appliedAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "applications"),
        applicationData
      );

      console.log("✅ Aplikasi berhasil disimpan dengan ID:", docRef.id);
      toast.success("Aplikasi berhasil dikirim!");

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

      setTimeout(() => {
        router.push("/jobList");
      }, 2000);
    } catch (error) {
      console.error("❌ Error menyimpan aplikasi:", error);
      toast.error("Gagal mengirim aplikasi. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl p-8">
        {/* Dialog */}
        <div className="mb-4 overflow-y-auto bg-white rounded-md shadow-md w-full p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-3 items-center">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-md border border-gray-300 p-1 bg-white hover:bg-gray-100 cursor-pointer"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">
                Lamar Posisi Frontend di Rakamin
              </h1>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TbInfoSquareFilled className="text-2xl text-blue-950" />
              Field ini wajib diisi
            </div>
          </div>
          <p className="text-red-500 font-semibold text-sm mb-6">*Wajib diisi</p>

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

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor telepon<span className="text-red-500">*</span>
            </label>

            {/* Phone input dengan negara */}
            <div className="relative">
              <div
                className={`flex items-center border rounded-lg overflow-hidden bg-white ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              >
                {/* Country Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowCountryDropdown(!showCountryDropdown)
                  }
                  className="flex items-center gap-2 px-3 py-2 border-r border-gray-300 hover:bg-gray-50 text-gray-700 font-medium min-w-max"
                >
                  <span className="text-xl">{selectedCountryFlag}</span>
                  <span>{countryCode}</span>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* Phone Input */}
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="81XXXXXXXXX"
                  className="flex-1 px-3 py-2 focus:outline-none text-gray-700"
                />
              </div>

              {/* Dropdown List dengan Search */}
              {showCountryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 w-full">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-300 flex items-center gap-2 bg-gray-50">
                    <IoSearch className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchCountry}
                      onChange={(e) => setSearchCountry(e.target.value)}
                      className="flex-1 outline-none bg-gray-50 text-sm"
                      autoFocus
                    />
                  </div>

                  {/* Country List */}
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.dial}
                          type="button"
                          onClick={() => handleSelectCountry(country.dial)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-2xl">{country.flag}</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {country.name}
                            </p>
                          </div>
                          <span className="text-gray-600 font-medium">
                            {country.dial}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        Negara tidak ditemukan
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
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
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-cyan-700 hover:bg-cyan-800"
            } text-white py-3 rounded-lg font-medium transition`}
          >
            {loading ? "Mengirim..." : "Kirim Aplikasi"}
          </button>
        </div>
      </form>
    </main>
  );
}
