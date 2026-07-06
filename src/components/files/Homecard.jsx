import { useMemo, useState } from "react";
import {
  Grid2X2,
  List,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import FolderCard from "./FolderCard";
import FileTable from "./FileTable";

const GRID_SIZE = {
  small:
    "grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7",

  medium:
    "grid-cols-2 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6",

  large:
    "grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5",
};

export default function ExplorerGrid({
  folders = [],
  files = [],
onRemoveStar,
  onOpen,
  onDelete,
  onShare,
  onStar,
 onOpenFile
}) {
  const [folderSize, setFolderSize] = useState("medium");

  const [folderView, setFolderView] = useState("grid");

  const [fileView, setFileView] = useState("list");

  const [showAllFolders, setShowAllFolders] =
    useState(false);

  const visibleFolders = useMemo(() => {
    if (showAllFolders) return folders;

    return folders.slice(0, 6);
  }, [folders, showAllFolders]);

  
  return (
    <div className="space-y-10">

      {/* ============================ */}
      {/* FOLDERS */}
      {/* ============================ */}

      <section>

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <h2 className="text-3xl font-semibold text-white">
              Folders
            </h2>

            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
              {folders.length}
            </span>

          </div>

          <div className="flex items-center gap-3">

            {/* Size */}

            <select
              value={folderSize}
              onChange={(e) =>
                setFolderSize(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#141821] px-4 py-2 text-sm text-zinc-300 outline-none"
            >
              <option value="small">
                Small
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="large">
                Large
              </option>
            </select>

            {/* Grid */}

            <button
              onClick={() =>
                setFolderView("grid")
              }
              className={`rounded-xl p-2 ${
                folderView === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-[#141821] text-zinc-500"
              }`}
            >
              <Grid2X2 size={18} />
            </button>

            {/* List */}

            <button
              onClick={() =>
                setFolderView("list")
              }
              className={`rounded-xl p-2 ${
                folderView === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-[#141821] text-zinc-500"
              }`}
            >
              <List size={18} />
            </button>

          </div>

        </div>

        {/* GRID */}

        {folderView === "grid" ? (

          <div
            className={`grid gap-5 ${GRID_SIZE[folderSize]}`}
          >
            {visibleFolders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onOpen={onOpen}
              />
            ))}
          </div>

        ) : (

          <div className="space-y-3">

            {visibleFolders.map((folder) => (
              <FolderCard
                key={folder._id}
                folder={folder}
                onOpen={onOpen}
                compact
              />
            ))}

          </div>

        )}

        {/* SHOW MORE */}

        {folders.length > 6 && (

          <div className="mt-6 flex justify-center">

            <button
              onClick={() =>
                setShowAllFolders((v) => !v)
              }
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#141821] px-8 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              {showAllFolders
                ? "Show Less"
                : `Show More (${
                    folders.length - 6
                  })`}

              {showAllFolders ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

          </div>

        )}

      </section>

      {/* Divider */}

      <div className="border-t border-white/10" />

      {/* ============================ */}
      {/* FILES */}
      {/* ============================ */}

      <section>

        <div className="mb-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <h2 className="text-3xl font-semibold text-white">
              Files
            </h2>

            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
              {files.length}
            </span>

          </div>

          <div className="flex items-center gap-3">

            <select
              className="rounded-xl border border-white/10 bg-[#141821] px-4 py-2 text-sm text-zinc-300 outline-none"
            >
              <option>Name</option>
              <option>Modified</option>
              <option>Size</option>
            </select>

            <button
              onClick={() =>
                setFileView("grid")
              }
              className={`rounded-xl p-2 ${
                fileView === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-[#141821] text-zinc-500"
              }`}
            >
              <Grid2X2 size={18} />
            </button>

            <button
              onClick={() =>
                setFileView("list")
              }
              className={`rounded-xl p-2 ${
                fileView === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-[#141821] text-zinc-500"
              }`}
            >
              <List size={18} />
            </button>

          </div>

        </div>

        <FileTable
          files={files}
          fileView={fileView}
          onDelete={onDelete}
          onOpen={onOpen}
          onShare={onShare}
          onStar={onStar}
          onRemoveStar={onRemoveStar}
          onOpenFile={onOpenFile}
        />

      </section>

    </div>
  );
}