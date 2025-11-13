"use client";
import { useEffect, useState } from "react";

export default function AlamatPage() {
  const [provinsi, setProvinsi] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);

  const [selectedProv, setSelectedProv] = useState("");
  const [selectedKab, setSelectedKab] = useState("");
  const [selectedKec, setSelectedKec] = useState("");

  // 🔹 Ambil daftar provinsi saat pertama kali
  useEffect(() => {
    fetch("https://emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => setProvinsi(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Ambil kabupaten ketika provinsi dipilih
  useEffect(() => {
    if (!selectedProv) return;
    fetch(`https://emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProv}.json`)
      .then((res) => res.json())
      .then((data) => setKabupaten(data))
      .catch((err) => console.error(err));
  }, [selectedProv]);

  // 🔹 Ambil kecamatan ketika kabupaten dipilih
  useEffect(() => {
    if (!selectedKab) return;
    fetch(`https://emsifa.com/api-wilayah-indonesia/api/districts/${selectedKab}.json`)
      .then((res) => res.json())
      .then((data) => setKecamatan(data))
      .catch((err) => console.error(err));
  }, [selectedKab]);

  // 🔹 Ambil kelurahan ketika kecamatan dipilih
  useEffect(() => {
    if (!selectedKec) return;
    fetch(`https://emsifa.com/api-wilayah-indonesia/api/villages/${selectedKec}.json`)
      .then((res) => res.json())
      .then((data) => setKelurahan(data))
      .catch((err) => console.error(err));
  }, [selectedKec]);

  return (
    <div className="flex flex-col gap-4 p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Form Alamat Indonesia</h1>

      {/* Provinsi */}
      <div>
        <label className="block font-medium mb-1">Provinsi</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedProv}
          onChange={(e) => {
            setSelectedProv(e.target.value);
            setKabupaten([]);
            setKecamatan([]);
            setKelurahan([]);
            setSelectedKab("");
            setSelectedKec("");
          }}
        >
          <option value="">Pilih Provinsi</option>
          {provinsi.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kabupaten */}
      <div>
        <label className="block font-medium mb-1">Kabupaten / Kota</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedKab}
          onChange={(e) => {
            setSelectedKab(e.target.value);
            setKecamatan([]);
            setKelurahan([]);
            setSelectedKec("");
          }}
          disabled={!selectedProv}
        >
          <option value="">Pilih Kabupaten</option>
          {kabupaten.map((k) => (
            <option key={k.id} value={k.id}>
              {k.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kecamatan */}
      <div>
        <label className="block font-medium mb-1">Kecamatan</label>
        <select
          className="w-full border p-2 rounded"
          value={selectedKec}
          onChange={(e) => {
            setSelectedKec(e.target.value);
            setKelurahan([]);
          }}
          disabled={!selectedKab}
        >
          <option value="">Pilih Kecamatan</option>
          {kecamatan.map((kc) => (
            <option key={kc.id} value={kc.id}>
              {kc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Kelurahan */}
      <div>
        <label className="block font-medium mb-1">Kelurahan</label>
        <select
          className="w-full border p-2 rounded"
          disabled={!selectedKec}
        >
          <option value="">Pilih Kelurahan</option>
          {kelurahan.map((kel) => (
            <option key={kel.id} value={kel.id}>
              {kel.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
