"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const CheckEmailClient = dynamic(() => import("./checkEmailClient"));

export default function ClientWrapper() {
  return (
    <Suspense>
      <CheckEmailClient />
    </Suspense>
  );
}
