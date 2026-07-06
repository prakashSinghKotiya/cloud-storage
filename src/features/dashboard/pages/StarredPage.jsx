import { useEffect, useState } from "react";
import AppShell from "../../../components/layout/AppShell";
import ExplorerGrid from "../../../components/files/Homecard";
import { getStarredFiles } from "../../../api/file.api";
import { useDrive } from "../../../context/DriveContext";

export default function StarredPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
 const {
  removeStar,
  toggleStar,
  removeFile,
  shareFile,
} = useDrive();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await getStarredFiles();
        setFiles(res?.files || res || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <AppShell>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Starred Files</h2>
        <p className="text-sm text-zinc-400">Your bookmarked items</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10">
          Loading starred files...
        </div>
      ) : (
      <ExplorerGrid
  files={files}
  onStar={toggleStar}
  onRemoveStar={removeStar}
  onDelete={removeFile}
  onShare={shareFile}
/>
      )}
    </AppShell>
  );
}