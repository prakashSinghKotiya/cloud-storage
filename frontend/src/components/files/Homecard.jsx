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
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6",

  medium:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",

  large:
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4",
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

<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  <div className="flex flex-wrap items-center gap-2
justify-end
w-full
sm:w-auto">
    <h2 className="text-xl sm:text-3xl font-semibold text-white">
      Folders
    </h2>
    <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
      {folders.length}
    </span>
  </div>

  <div className="flex items-center gap-2 sm:gap-3">
    <select
      value={folderSize}
      onChange={(e) => setFolderSize(e.target.value)}
      className="rounded-xl border border-white/10 bg-[#141821] px-2 sm:px-4 py-2 text-xs sm:text-sm text-zinc-300 outline-none"
    >
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
    </select>

    <button onClick={() => setFolderView("grid")} className={`rounded-xl p-2 ${folderView === "grid" ? "bg-blue-600 text-white" : "bg-[#141821] text-zinc-500"}`}>
      <Grid2X2 size={18} />
    </button>

    <button onClick={() => setFolderView("list")} className={`rounded-xl p-2 ${folderView === "list" ? "bg-blue-600 text-white" : "bg-[#141821] text-zinc-500"}`}>
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
                size={folderSize} 
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

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

         <div className="flex flex-wrap items-center gap-2
justify-end
w-full
sm:w-auto">

            <h2 className="text-3xl font-semibold text-white">
              Files
            </h2>

            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-zinc-300">
              {files.length}
            </span>

          </div>

          <div className="flex
flex-wrap
gap-2
items-center
justify-end
w-full
sm:w-auto">

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

       <div className="overflow-x-auto rounded-2xl ">
        
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
        </div>

      </section>

    </div>
  );
}