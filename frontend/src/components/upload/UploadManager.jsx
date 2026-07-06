import { useUploadContext } from "../../context/UploadContext";
import UploadItem from "./UploadItem";

export default function UploadManager() {
  const { uploads } = useUploadContext();

  if (uploads.length === 0) return null;

  return (
    <div
      className="
      fixed
      bottom-5
      right-5
      z-[999]
      w-96
      rounded-2xl
      border
      border-white/10
      bg-[#141922]
      shadow-2xl
      backdrop-blur-xl
      overflow-hidden
    "
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

        <h2 className="font-semibold">
          Uploads ({uploads.length})
        </h2>

      </div>

      <div className="max-h-96 overflow-y-auto">

        {uploads.map((upload) => (
          <UploadItem
            key={upload.id}
            upload={upload}
          />
        ))}

      </div>
    </div>
  );
}