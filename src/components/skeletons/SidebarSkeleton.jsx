import React from "react";

// Skeleton UI that mirrors the Sidebar layout while data loads
const SidebarSkeleton = () => {
  return (
  <aside className="w-full sm:w-64 bg-base-200 h-48 sm:h-full p-2 sm:p-4 border-b sm:border-b-0 sm:border-r border-base-300 flex-shrink-0">
      <div className="animate-pulse space-y-6">
        {/* Nav skeleton */}
        <nav>
          <ul className="list-none p-0 space-y-4">
            <li className="flex items-center space-x-3">
      <div className="h-5 w-5 rounded bg-base-300" />
      <div className="h-4 w-24 rounded bg-base-300" />
            </li>
            <li className="flex items-center space-x-3">
      <div className="h-5 w-5 rounded bg-base-300" />
      <div className="h-4 w-20 rounded bg-base-300" />
            </li>
          </ul>
        </nav>

    <div className="h-px w-full bg-base-300" />

        {/* Users list skeleton */}
        <ul className="list-none p-0 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-base-300" />
              <div className="flex-1">
        <div className="h-4 w-32 rounded bg-base-300" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;