// client/src/components/NavBar.jsx
//
// Base classes target mobile first.
// md: and lg: add enhancements for larger viewports.

import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <img
          src="/inkwell-icon.svg"
          alt=""
          className="h-6 w-6"
        />

        <span className="font-bold text-lg">
          Inkwell
        </span>
      </div>

      <div className="flex gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm ${
              isActive
                ? "font-semibold text-indigo-600"
                : "text-gray-600"
            }`
          }
        >
          Feed
        </NavLink>

        <NavLink
          to="/write"
          className={({ isActive }) =>
            `text-sm ${
              isActive
                ? "font-semibold text-indigo-600"
                : "text-gray-600"
            }`
          }
        >
          Write
        </NavLink>
      </div>
    </nav>
  );
}