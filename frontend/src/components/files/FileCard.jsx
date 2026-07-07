import { motion } from "framer-motion";
import {
  File,
  Image,
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  FileCode2,
  MoreVertical,
  Star,
  Clock3,
} from "lucide-react";

import { formatBytes } from "../../lib/formatBytes";
import { useContextMenu } from "../../context/ContextMenuContext";
import { useState } from "react";

function getFileIcon(ext = "") {
  
  ext = ext.toLowerCase();

  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext))
    return <Image size={38} className="text-sky-400" />;

  if (["pdf", "doc", "docx", "txt"].includes(ext))
    return <FileText size={38} className="text-red-400" />;

  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileSpreadsheet size={38} className="text-green-400" />;

  if (["js", "jsx", "ts", "tsx", "json", "css", "html"].includes(ext))
    return <FileCode2 size={38} className="text-cyan-400" />;

  if (["zip", "rar", "7z"].includes(ext))
    return <FileArchive size={38} className="text-yellow-400" />;

  if (["mp4", "mov", "avi", "mkv"].includes(ext))
    return <FileVideo size={38} className="text-violet-400" />;

  if (["mp3", "wav"].includes(ext))
    return <FileAudio size={38} className="text-pink-400" />;

  return <File size={38} className="text-zinc-300" />;
}

export default function FileCard({
 file,
  onOpen,
  onDelete,
  onShare,
  onStar,
  onOpenFile,
  onRemoveStar
}) {
  const { openMenu } = useContextMenu();
  const [starring, setStarring] = useState(false)
  console.log("starred",file);

  //const openFile = () => {window.location.href = `http://localhost:4000/file/${file._id}`;};

  const extension =
    file.extension ||
    file.name?.split(".").pop() ||
    "";

  const isImage = [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
  ].includes(extension.toLowerCase());

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpenFile(file)}
      onContextMenu={(e) => openMenu(e, file, "file")}
      className="
      group
      overflow-hidden
      rounded-3xl
      border
      border-white/10
      bg-[#11161f]
      transition-all
      duration-300
      hover:border-blue-500/40
      hover:bg-[#171e28]
      hover:shadow-[0_18px_40px_rgba(0,0,0,.35)]
      cursor-pointer
      "
    >
      {/* Preview */}

      <div className="relative">

        <div className="flex aspect-video items-center justify-center bg-[#1b222d]">

          {isImage && file.url ? (
            <img
              src={file.signedUrl || file.previewUrl || file.url}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            getFileIcon(extension)
          )}

        </div>

        {/* Star */}

        <button
       onClick={async (e) => {
  e.stopPropagation();
  setStarring(true);
  try {
    if (file?.starred) {
      await onRemoveStar?.(file._id);
    } else {
      await onStar?.(file._id);
    }
  } finally {
    setStarring(false);
  }
}}
          className="
          absolute
          left-3
          top-3
          rounded-lg
          bg-black/40
          p-2
          opacity-0
          transition
          backdrop-blur
          group-hover:opacity-100
          "
        >
          <Star
            size={16}
            className="text-yellow-400"
          />
        </button>

        {/* Menu */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            openMenu(e, file, "file");
          }}
          className="
          absolute
          right-3
          top-3
          rounded-lg
          bg-black/40
          p-2
          opacity-0
          transition
          backdrop-blur
          group-hover:opacity-100
          "
        >
          <MoreVertical size={18} />
        </button>

      </div>

      {/* Body */}

      <div className="p-5">

        <h3 className="truncate text-base font-semibold text-white">
          {file.name}
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          {extension.toUpperCase()} • {formatBytes(file.size)}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <span
            className="
            rounded-full
            border
            border-white/10
            bg-white/5
            px-3
            py-1
            text-xs
            text-zinc-400
            "
          >
            File
          </span>

          <div className="flex items-center gap-1 text-xs text-zinc-500">

            <Clock3 size={12} />

            <span>
              {file.updatedAt
                ? new Date(file.updatedAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )
                : "--"}
            </span>

          </div>

        </div>

      </div>

    </motion.div>
  );
}