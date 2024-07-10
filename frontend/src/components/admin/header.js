import React, { useState } from "react";

import ModalSearch from "./modal_search";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import DehazeIcon from "@mui/icons-material/Dehaze";


function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  return (
    <header className="sticky top-0  bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
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

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <div>
              <button
                className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full ml-3 ${
                  searchModalOpen && "bg-slate-200"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchModalOpen(true);
                }}
                aria-controls="search-modal"
              >
                <span className="sr-only">Search</span>
                <SearchTwoToneIcon style={{ color: "white" }} />
              </button>
              <ModalSearch
                id="search-modal"
                searchId="search"
                modalOpen={searchModalOpen}
                setModalOpen={setSearchModalOpen}
              />
            </div>
            {/* <Notifications align="right" /> */}
            {/* <Help align="right" /> */}
            {/* <ThemeToggle /> */}
            {/*  Divider */}
            <hr className="w-px h-6 bg-slate-200 dark:bg-slate-700 border-none" />
            {/* <UserMenu align="right" /> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
