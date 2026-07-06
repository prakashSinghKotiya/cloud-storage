import UserRow from "./UserRow";

export default function UserTable({
  users,
  loading,
  refreshUsers,
  setUsers,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141922] p-16 text-center text-zinc-400">
        Loading users...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#141922] p-16 text-center text-zinc-400">
        No users found.
      </div>
    );
  }

  return (
    <div className="relative overflow-visible rounded-2xl border border-white/10 bg-[#141922] shadow-[0_15px_50px_rgba(0,0,0,.35)]">
      <table className="w-full border-collapse">
        <thead className="border-b border-white/10 bg-white/[0.03]">
          <tr className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            <th className="px-6 py-5 text-left w-[35%]">
              Name
            </th>

            <th className="px-6 py-5 text-left w-[30%]">
              Email
            </th>

            <th className="px-6 py-5 text-center w-[10%]">
              Plan
            </th>

            <th className="px-6 py-5 text-center w-[12%]">
              Status
            </th>

            <th className="px-6 py-5 text-center w-[13%]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="relative overflow-visible">
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              refreshUsers={refreshUsers}
              setUsers={setUsers}
            />
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.02] px-6 py-4">
        <span className="text-sm text-zinc-500">
          Total users:{" "}
          <span className="font-medium text-zinc-300">
            {users.length}
          </span>
        </span>

        <span className="text-xs text-zinc-600">
          Updated just now
        </span>
      </div>
    </div>
  );
}