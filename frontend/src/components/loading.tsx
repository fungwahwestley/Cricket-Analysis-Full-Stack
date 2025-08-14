import * as React from "react";

interface LoadingProps {
  message?: string;
}

export function Loading({ message }: LoadingProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600"></div>
        <p className="text-lg font-medium text-zinc-600">
          {message ?? "Loading..."}
        </p>
      </div>
    </div>
  );
}
