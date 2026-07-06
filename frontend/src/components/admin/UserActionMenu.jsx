import { useState } from "react";
import { MoreVertical, LogOut, Trash2 } from "lucide-react";

import { logoutUserById, deleteUserById } from "../../api/user.api";

export default function UserActionMenu({
  user,
  setUsers,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    const ok = window.confirm(
      `Logout ${user.name} from all devices?`
    );

    if (!ok) return;

    try {
      setLoading(true);

      await logoutUserById(user._id);

      alert("User logged out successfully.");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`
    );

    if (!ok) return;

    try {
      setLoading(true);

      await deleteUserById(user._id);

      setUsers((prev) =>
        prev.filter((u) => u._id !== user._id)
      );
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
    disabled={loading}
    onClick={() => setOpen((prev) => !prev)}
    className="
        flex h-11 w-11 items-center justify-center
        rounded-xl
        border border-white/10
        bg-white/[0.03]
        transition-all
        hover:bg-white/10
        hover:border-white/20
        hover:scale-105
        active:scale-95
    "
>
    <MoreVertical size={18} />
</button>

     {open && (
  <div
    className="
      absolute right-0 top-12 z-50
      w-72
      rounded-2xl
      border border-white/10
      bg-[#151922]/95
      backdrop-blur-xl
      shadow-[0_20px_60px_rgba(0,0,0,.55)]
      overflow-hidden
      animate-in fade-in zoom-in-95 duration-150
    "
  >
    {/* arrow */}
    <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 border-l border-t border-white/10 bg-[#151922]" />

    <button
      onClick={handleLogout}
      className="
        flex w-full items-start gap-4
        px-5 py-5
        transition
        hover:bg-white/5
      "
    >
      <div className="mt-1 text-white">
        <LogOut size={20} strokeWidth={2} />
      </div>

      <div className="text-left">
        <p className="font-semibold text-white">
          Logout User
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Sign out this user from all devices
        </p>
      </div>
    </button>

    <div className="mx-5 border-t border-white/10" />

    <button
      onClick={handleDelete}
      className="
        flex w-full items-start gap-4
        px-5 py-5
        transition
        hover:bg-red-500/10
      "
    >
      <div className="mt-1 text-red-500">
        <Trash2 size={20} strokeWidth={2} />
      </div>

      <div className="text-left">
        <p className="font-semibold text-red-500">
          Delete User
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Permanently delete this user
        </p>
      </div>
    </button>
  </div>
)}
    </div>
  );
}