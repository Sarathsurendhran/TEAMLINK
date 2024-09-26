import React, { useState } from "react";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import DehazeIcon from "@mui/icons-material/Dehaze";

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <header className="sticky top-0  bg-slate-800 border-b border-slate-700 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-slate-500 hover:text-slate-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
            >
              <span className="sr-only">Open sidebar</span>
              <DehazeIcon style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
