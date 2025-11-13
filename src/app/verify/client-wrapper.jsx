"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const VerifyClient = dynamic(() => import("./verifyClient"));

export default function ClientWrapper() {
  return (
    <Suspense>
      <VerifyClient />
    </Suspense>
  );
}
