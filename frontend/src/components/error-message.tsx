import * as React from "react";

interface ErrorProps {
  error: Error;
}

export function ErrorMessage({ error }: ErrorProps) {
  return (
    <div className="w-full rounded border border-red-200 bg-red-50 p-4 text-red-700">
      {error.message}
    </div>
  );
}
