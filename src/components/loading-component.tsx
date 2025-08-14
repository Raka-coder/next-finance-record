"use client"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-500 border-dashed rounded-full animate-spin"></div>
      <span className="mt-4 text-gray-500 font-semibold">Loading...</span>
      <span className="mt-2 text-gray-400 text-sm">Memuat data Anda</span>
    </div>
  );
}
