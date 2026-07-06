import { Menu, Search,ChevronDown, LogOut,Bot } from "lucide-react";
import { useUIContext } from "../../context/UIContext";
import UserProfile from "../userextra/UserProfile";
import { useDrive } from "../../context/DriveContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AIChatPopup from "./AIChatPopup";




export default function Header() {
  const { setSidebarOpen } = useUIContext();
  const { searchQuery, setSearchQuery,  } = useDrive();
  const navigate = useNavigate();
  const [openAI, setOpenAI] = useState(false);


  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0c1017]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="rounded-xl border border-white/10 bg-white/5 p-0 lg:hidden"
            onClick={() => setSidebarOpen(true) }
          >
            <Menu size={18} />
          </button>

<div className="flex flex-col pr-8 " >
  {/* Logo + Title */}
  <div className="flex items-center gap-0 cursor-pointer" onClick={() => navigate("/app")} >
    <div className="w-10 h-10 flex-shrink-0">
      <img
        src="/cloudlogo.svg"
        alt="ClouDisk"
        className="w-full h-full object-contain p-0 "
      />
    </div>

    <h1 className="text-1xl font-bold tracking-tight text-white pl-0">
      ClouDisk
    </h1>
  </div>

 
</div>

            <div className="hidden w-[55%] min-w-[500px] max-w-[750px] items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:flex">
            <Search size={18} className="text-zinc-400" />
             <input
                 type="text"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search files and folders..."
                 className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500 pl-4"
    />
  </div>
        </div>

<div className="ml-auto relative  flex items-center gap-4">

  <button
  onClick={() => setOpenAI(!openAI)}
  className="
    flex
    items-center
    gap-2

    rounded-2xl
    border border-violet-500/20

    bg-violet-500/10

    px-4
    py-2.5

    text-sm
    font-medium

    text-violet-300

    transition-all

    hover:bg-violet-500/20
  "
>
  <Bot size={18} />

  <span className="hidden lg:block">
    AI
  </span>
</button>

<AIChatPopup
  open={openAI}
  onClose={() => setOpenAI(false)}
/>




  <UserProfile />
</div>
      </div>
    </header>
  );
}