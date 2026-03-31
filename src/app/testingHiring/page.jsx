"use client";

import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneField() {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        Phone Number
      </label>

      <PhoneInput
        defaultCountry="id"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
    </div>
  );
}