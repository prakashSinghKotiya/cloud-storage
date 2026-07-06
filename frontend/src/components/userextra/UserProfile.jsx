import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuthContext();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log(user);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex h-11 w-11 items-center justify-center
          rounded-full
          overflow-hidden
          border border-white/10
          bg-white/5
          transition-all
          hover:bg-white/10
        "
      >
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="h-full w-full  object-cover"
          />
        ) : (
          <span className="text-sm font-semibold">
            {initials}
          </span>
        )}
      </button>

      {/* Dropdown */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="
              absolute right-0 mt-3
              w-72
              overflow-hidden
              rounded-2xl
              border border-white/10
              bg-[#131922]
              shadow-2xl
            "
          >
            <div className="flex flex-col items-center px-6 py-6">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="mb-4 h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
                  {initials}
                </div>
              )}

              <h3 className="text-base font-semibold">
                {user?.name}
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                {user?.email}
              </p>
            </div>

            <div className="border-t border-white/10">
              <button
                className="
                  flex w-full items-center gap-3
                  px-5 py-3
                  text-sm
                  transition-colors
                  hover:bg-white/5
                "
              >
                <User size={18} />
                My Profile
              </button>

              <button
                onClick={logout}
                className="
                  flex w-full items-center gap-3
                  px-5 py-3
                  text-sm
                  text-red-400
                  transition-colors
                  hover:bg-red-500/10
                "
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}