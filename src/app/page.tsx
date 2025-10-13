"use client";

import Screenshot from "./components/Screenshot.tsx";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-blue-100 dark:bg-blue-900 dark:text-white">
      {/* Screenshot */}
      <Screenshot></Screenshot>
    </div>
  );
}
