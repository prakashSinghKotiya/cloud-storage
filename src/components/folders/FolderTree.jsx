import FolderNode from "./FolderNode";
import { FolderTree as FolderTreeIcon } from "lucide-react";

export default function FolderTree({ folders = [] }) {
  return (
    <div
      className="
    flex h-full min-h-0 flex-col
    rounded-2xl
    border border-white/10
    bg-white/[0.03]
    backdrop-blur-xl
    flex
    flex-col
    overflow-hidden
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 flex-shrink-0">
        <FolderTreeIcon
          size={18}
          className="text-zinc-400"
        />

        <h3 className="text-sm font-semibold">
          Folder Tree
        </h3>

        <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs text-zinc-400">
          {folders.length}
        </span>
      </div>

      {/* Content */}
      <div
        className="
        
          flex-1
          flex-1 overflow-y-auto
          px-3
          py-2
          space-y-1

       
        "
      >
        {folders.length ? (
          folders.map((folder) => (
            <FolderNode
              key={folder._id}
              folder={folder}
            />
          ))
        ) : (
          <div className="flex h-32 items-center justify-center text-center">
            <div>
              <FolderTreeIcon
                size={28}
                className="mx-auto mb-2 text-zinc-600"
              />

              <p className="text-sm text-zinc-400">
                No folders found
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}