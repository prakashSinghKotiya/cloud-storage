import {
  FileText,
  Image,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileCode,
  Star,
  MoreVertical,
} from "lucide-react";

import { useContextMenu } from "../../context/ContextMenuContext";
import { useState } from "react";
function getFileIcon(extension = "") {
  extension = extension.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension))
    return <Image size={20} className="text-sky-400" />;

  if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension))
    return <FileVideo size={20} className="text-violet-400" />;

  if (["mp3", "wav", "aac"].includes(extension))
    return <FileAudio size={20} className="text-pink-400" />;

  if (["zip", "rar", "7z"].includes(extension))
    return <FileArchive size={20} className="text-yellow-400" />;

  if (["xls", "xlsx", "csv"].includes(extension))
    return <FileSpreadsheet size={20} className="text-green-400" />;

  if (["js", "jsx", "ts", "tsx", "json", "html", "css"].includes(extension))
    return <FileCode size={20} className="text-cyan-400" />;

  return <FileText size={20} className="text-zinc-300" />;
}

function formatBytes(bytes = 0) {
  if (!bytes) return "--";

  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (
    (bytes / Math.pow(1024, i)).toFixed(1) +
    " " +
    sizes[i]
  );
}

function formatDate(date) {
  if (!date) return "--";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FileRow({
  file,
  onOpen,
  onRemoveStar,
  onDelete,
  onShare,
  onStar,
  onOpenFile
} ) 
{
   const { openMenu } = useContextMenu();
   const [starring, setStarring] = useState(false);
   
  return (
    <div
       onClick={() => {
    console.log("Opening file:", file);
    onOpenFile?.(file);
  }}
      className={`
        
group
grid
cursor-pointer
grid-cols-[36px_minmax(0,1fr)_55px_28px]
sm:grid-cols-[60px_1.8fr_170px_120px_170px_60px]
items-center
border-b
border-white/5
px-3
sm:px-6
py-3
sm:py-4
transition-all
duration-200
${file.starred ? "bg-yellow-400/[0.03]" : ""}
hover:bg-white/[0.04]
`}
    >
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
  className={`
    flex h-9 w-9 items-center justify-center rounded-xl
    transition-all duration-300 ease-out
    active:scale-90
    ${
      file.starred
        ? "opacity-100"
        : "opacity-0 group-hover:opacity-100"
    }
  `}
>
<Star
    size={18}
    className={`
    transition-all duration-300 hover:scale-125 cursor-pointer
    ${
        starring
        ? "animate-pulse scale-125 text-yellow-400"
        : file.starred
        ? "fill-yellow-400 text-yellow-400 scale-110"
        : "text-zinc-500"
    }
    `}
/>
</button>

      {/* Name */}

      <div className="flex items-center gap-4">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          {getFileIcon(file.extension)}
        </div>

        <div className="min-w-0">

          <h3 className="truncate text-sm sm:text-[15px] font-medium text-white">
            {file.name}
          </h3>

          <p className="truncate text-xs text-zinc-500">
            .{file.extension}
          </p>

        </div>

      </div>

      {/* Owner */}

     {/* Owner */}
<div className="hidden sm:flex items-center gap-3">
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold">
    Y
  </div>
  <span className="text-sm text-zinc-300">You</span>
</div>

{/* Size */}
<span className="text-sm text-zinc-400">
  {formatBytes(file.size)}
</span>

{/* Modified */}
<span className="hidden sm:block text-sm text-zinc-400">
  {formatDate(file.updatedAt)}
</span>

      {/* Actions */}

<button
  onClick={(e) => {
    e.stopPropagation();
    openMenu(e, file, "file");
  }}
  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
>
        <MoreVertical size={18} />
      </button>
    </div>
  );
}