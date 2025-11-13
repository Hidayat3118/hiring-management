import { Suspense } from "react";
import VerifyClient from "./verifyClient";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyClient />
    </Suspense>
  );
}
