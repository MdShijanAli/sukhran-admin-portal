import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function SuspenseWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
