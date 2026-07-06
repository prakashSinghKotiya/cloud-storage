import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { fetchAllUsers } from "../src/api/user.api";
import UserTable from "../src/components/admin/UserTable";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await fetchAllUsers();
      setUsers(data);
      console.log(users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase();

    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, search]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage registered users.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-xl border border-white/10 bg-[#141922] py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500"
        />
      </div>

      <UserTable
        users={filteredUsers}
        loading={loading}
        refreshUsers={loadUsers}
        setUsers={setUsers}
      />
    </div>
  );
}