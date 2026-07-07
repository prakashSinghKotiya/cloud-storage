import FileRow from "./FileRow";
import FileCard from "./FileCard";

export default function FileTable({
  files = [],
  fileView = "list",
  onRemoveStar,
  onOpen,
  onDelete,
  onShare,
  onStar,
  onOpenFile,
}) {
  if (!files.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#11161f]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">
            No files found
          </h3>

          <p className="mt-2 text-sm text-zinc-500">
            Upload files to this folder.
          </p>
        </div>
      </div>
    );
  }

  /* GRID MODE */

  if (fileView === "grid") {
    return (
      <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            onOpen={onOpen}
            onDelete={onDelete}
            onShare={onShare}
            onStar={onStar}
            onRemoveStar={onRemoveStar}
            onOpenFile={onOpenFile}
          />
        ))}
      </div>
    );
  }

  /* LIST MODE */

  return (
    <div className=" overflow-x-auto rounded-2xl border border-white/10 bg-[#11161f]">
       <div className="min-w-[640px]">

      {/* Header */}

<div className="grid grid-cols-[40px_minmax(0,1fr)_70px_36px] sm:grid-cols-[60px_1.8fr_180px_120px_180px_60px] border-b border-white/10 bg-[#141821] px-3 sm:px-6 py-3 sm:py-4 text-sm font-medium text-zinc-400">
  <div></div>
  <div>Name</div>
  <div className="hidden sm:block">Owner</div>
  <div>Size</div>
  <div className="hidden sm:block">Modified</div>
  <div></div>
</div>

      {/* Rows */}

      {files.map((file) => (
        <FileRow
          key={file._id}
          file={file}
          onOpen={onOpen}
          onDelete={onDelete}
          onShare={onShare}
          onStar={onStar}
          onRemoveStar={onRemoveStar}
          onOpenFile={onOpenFile}
        />
      ))}

      </div>

    </div>
  );
}