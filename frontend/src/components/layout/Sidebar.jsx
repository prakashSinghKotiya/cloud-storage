import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useUIContext } from "../../context/UIContext";
import { useDrive } from "../../context/DriveContext";
import FolderTree from "../folders/FolderTree";

const navItems = [
  { label: "Home", to: "/app" },
  { label: "Starred", to: "/app/starred" },
  { label: "Shared Files", to: "/app/shared" },
  { label: "Photos", to: "/app/photos" },
  { label: "Billing", to: "/app/billing" },
];

export default function Sidebar() {
  const { user } = useAuthContext();
  const { sidebarOpen, setSidebarOpen } = useUIContext();
  const { directoryData, goHome } = useDrive();
  

  const maxStorage = user?.totalStorage ?? 1024 ** 3;
  const usedStorage = user?.usedStorage ?? 0;

  const totalGB = maxStorage / 1024 ** 3;
  const usedGB = usedStorage / 1024 ** 3;
  const usedMB = usedStorage / 1024 ** 2;

  const progress =
    maxStorage > 0
      ? Math.min((usedStorage / maxStorage) * 100, 100)
      : 0;

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0
          z-50
          w-[290px]
          border-r border-white/10
          bg-[#12161f]
          p-4
          flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* User */}
        <div className="mb-6 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-zinc-400">Welcome to <spam className="bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent  text-bold"> ClouDisk</spam></p>

          <h2 className="mt-1 truncate text-lg font-semibold text-white">
            {user?.name || user?.email || "User"}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              onClick={() => {
                if (item.to === "/app") {
                  goHome();
                }
                setSidebarOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          
        </nav>

        {/* Folder Tree */}
        <div className="mt-6 flex-1 min-h-0 overflow-hidden">
          <FolderTree
            folders={
              directoryData?.directories ??
              directoryData?.folders ??
              []
            }
          />
        </div>

        {/* Storage */}
        <div className="mt-6 flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Storage
            </h3>
               <span
      className="
        rounded-full
        border border-blue-500/30
        bg-blue-500/10
        px-2.5
        py-0.5
        text-[10px]
        font-semibold
        uppercase
        tracking-wide
        text-blue-400
      "
    >
      {user?.plan || "Free"}
    </span>

            <span className="text-xs text-blue-400 font-medium">
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <span>
              {usedGB >= 1
                ? `${usedGB.toFixed(2)} GB`
                : `${usedMB.toFixed(1)} MB`}
            </span>

            <span>{totalGB.toFixed(0)} GB</span>
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            {usedGB >= 1
              ? `${usedGB.toFixed(2)} GB`
              : `${usedMB.toFixed(1)} MB`}{" "}
            used of {totalGB.toFixed(0)} GB
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}