import UserActionMenu from "./UserActionMenu";

export default function UserRow({
  user,
  refreshUsers,
  setUsers,
}) {
  return (
    <tr className="group relative border-b border-white/5 transition hover:bg-white/[0.03]">
      {/* Name */}
      <td className="px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {user.name}
            </h3>

            <p className="mt-1 text-xs text-zinc-500">
              ID: {user._id}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-6">
        <span className="text-sm text-zinc-300">
          {user.email}
        </span>
      </td>

      {/* Plan */}
      <td className="px-6 py-6 text-center">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
            user.plan === "pro"
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-white/10 bg-white/[0.03] text-zinc-300"
          }`}
        >
          {user.plan === "pro" ? "Pro" : "Free"}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-6 text-center">
        <span className="inline-flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              user.isLoggedin
                ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,.9)]"
                : "bg-zinc-500"
            }`}
          />

          <span
            className={`text-sm ${
              user.isLoggedin
                ? "text-green-400"
                : "text-zinc-500"
            }`}
          >
            {user.isLoggedin ? "Active" : "Offline"}
          </span>
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-6 text-center">
        <div className="flex justify-center">
          <UserActionMenu
            user={user}
            refreshUsers={refreshUsers}
            setUsers={setUsers}
          />
        </div>
      </td>
    </tr>
  );
}