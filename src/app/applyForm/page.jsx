"use client";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";
import { TbInfoSquareFilled } from "react-icons/tb";
import { LuUpload } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa6";

export default function ApplyForm() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    pronoun: "",
    domicile: "",
    phone: "",
    photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, photo: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted! (demo only)");
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-start py-10 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-8"
      >
        {/* dialog */}
        <div className="h-[700px] mb-4 overflow-y-scroll bg-white rounded-md shadow-md w-full  p-8" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-3 items-center">
              <div className="rounded-md border border-gray-300 p-1 bg-white hover:bg-gray-100">
                <FaArrowLeft className="text-xl cursor-pointer"/>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Apply Front End at Rakamin
              </h1>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <TbInfoSquareFilled className="text-2xl text-blue-950" />
              This field required to fill
            </div>
          </div>
              <p className="text-red-500 font-semibold text-sm">*Required</p>

          {/* Photo upload */}
          <div className="grid gap-3 mb-6 max-w-36 ">
            <div className="w-36 h-36 rounded-full bg-cyan-50 flex items-center justify-center overflow-hidden">
              {form.photo ? (
                <img
                  src={form.photo}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/avatar-placeholder.png"
                  alt="avatar"
                  className="w-20 h-20"
                />
              )}
            </div>
            <label className="flex items-center gap-2 border px-3 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50 ">
              <LuUpload />
              Take a Picture
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of birth<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Pronoun */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pronoun (gender)<span className="text-red-500">*</span>
            </label>
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pronoun"
                  value="female"
                  checked={form.pronoun === "female"}
                  onChange={handleChange}
                />
                <span className="text-sm text-gray-700">She/her (Female)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pronoun"
                  value="male"
                  checked={form.pronoun === "male"}
                  onChange={handleChange}
                />
                <span className="text-sm text-gray-700">He/him (Male)</span>
              </label>
            </div>
          </div>

          {/* Domicile */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domicile<span className="text-red-500">*</span>
            </label>
            <select
              name="domicile"
              value={form.domicile}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Choose your domicile</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Bandung">Bandung</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Yogyakarta">Yogyakarta</option>
            </select>
          </div>

          {/* Phone */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone number<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
              {/* Flag + dropdown */}
              <div className="flex items-center px-3 border-r">
                <img
                  src="https://flagcdn.com/w20/id.png"
                  alt="Indonesia flag"
                  className="w-5 h-5 rounded-full mr-2"
                />
                <select
                  className="bg-transparent focus:outline-none text-gray-600 text-sm cursor-pointer"
                  defaultValue="+62"
                >
                  <option value="+62">+62</option>
                  <option value="+60">+60</option>
                  <option value="+65">+65</option>
                  <option value="+1">+1</option>
                </select>
              </div>

              {/* Input nomor */}
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="81XXXXXXXXX"
                className="flex-1 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-700"
              />
            </div>
          </div>

          {/* email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="email"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* linkedin */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linkedin<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="linkedin"
              value={form.fullName}
              onChange={handleChange}
              placeholder="https/linkedin.com/username"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white py-3 rounded-lg font-medium transition"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
