import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import axios from "axios";

import {
  uploadComplete,
  uploadInitiate,
} from "../api/file.api";

import { useDrive } from "./DriveContext";

const UploadContext = createContext(null);

export function UploadProvider({ children }) {
const { currentDirectoryId, refreshDirectory } = useDrive();
  const drive = useDrive();
  console.log("UploadContext Render:", currentDirectoryId);

  const [uploads, setUploads] = useState([]);

  /* ----------------------------------
      Upload State Helpers
  ----------------------------------- */

  const addUpload = (upload) => {
    setUploads((prev) => [upload, ...prev]);
  };

  const updateUpload = (id, patch) => {
    setUploads((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    );
  };

  const removeUpload = (id) => {
    setUploads((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /* ----------------------------------
      API Helpers
  ----------------------------------- */

  const startUpload = async (fileData) => {
    console.log("FILE DATA", fileData);
    return await uploadInitiate(fileData);
  };

  const finishUpload = async (fileId) => {
    return await uploadComplete(fileId);
  };

  /* ----------------------------------
      Upload Handler
  ----------------------------------- */

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const uploadId = crypto.randomUUID();

    try {
      addUpload({
        id: uploadId,
        name: file.name,
        size: file.size,
        progress: 0,
        status: "Preparing",
      });

      // Step 1 - Get signed URL
      const { uploadSignedUrl, fileId } =await startUpload({
          name: file.name,
          size: file.size,
          contentType: file.type,
          parentDirId: currentDirectoryId || undefined,
        });
        

      updateUpload(uploadId, {
        status: "Uploading",
      });

      // Step 2 - Upload to S3
      await axios.put(uploadSignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },

        onUploadProgress: (event) => {
          if (!event.total) return;

          const progress = Math.round(
            (event.loaded * 100) / event.total
          );

          updateUpload(uploadId, {
            progress,
          });
        },
      });

      updateUpload(uploadId, {
        progress: 100,
        status: "Finalizing",
      });

      // Step 3 - Notify backend
      await finishUpload(fileId);

      updateUpload(uploadId, {
        status: "Completed",
      });

      // Refresh current folder
      await refreshDirectory(currentDirectoryId);

      // Remove completed upload after 3 seconds
      setTimeout(() => {
        removeUpload(uploadId);
      }, 3000);
    } catch (err) {
      console.error(err);

      updateUpload(uploadId, {
        status: "Failed",
      });
    } finally {
      e.target.value = "";
    }
  };

  /* ----------------------------------
      Context Value
  ----------------------------------- */

  const value = useMemo(
    () => ({
      uploads,

      addUpload,
      updateUpload,
      removeUpload,

      startUpload,
      finishUpload,

      handleFileSelect,
    }),
    [uploads,handleFileSelect, startUpload, finishUpload]
  );

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploadContext() {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error(
      "useUploadContext must be used inside UploadProvider"
    );
  }

  return context;
}