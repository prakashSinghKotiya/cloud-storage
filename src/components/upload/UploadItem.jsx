import {
  CheckCircle2,
  LoaderCircle,
  XCircle,
  File,
} from "lucide-react";

export default function UploadItem({ upload }) {
  return (
    <div className="border-b border-white/5 p-4 last:border-none">

      <div className="flex justify-between">

        <div className="flex gap-3">

          <File
            size={20}
            className="mt-1 text-blue-400"
          />

          <div>

            <p className="truncate text-sm font-medium">
              {upload.name}
            </p>

            <p className="mt-1 text-xs text-white/50">
              {upload.status}
            </p>

          </div>

        </div>

        <div>

          {upload.status === "Uploading" && (
            <LoaderCircle
              className="animate-spin text-blue-400"
              size={18}
            />
          )}

          {upload.status === "Completed" && (
            <CheckCircle2
              className="text-green-500"
              size={18}
            />
          )}

          {upload.status === "Failed" && (
            <XCircle
              className="text-red-500"
              size={18}
            />
          )}

        </div>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">

        <div
          className="
            h-full
            rounded-full
            bg-blue-500
            transition-all
            duration-300
          "
          style={{
            width: `${upload.progress}%`,
          }}
        />

      </div>

      <div className="mt-2 flex justify-end">

        <span className="text-xs text-white/50">

          {upload.progress}%

        </span>

      </div>

    </div>
  );
}