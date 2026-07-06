import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  getDirectoryItems,
  createDirectory,
  deleteDirectory,
  renameDirectory,
} from "../api/directory.api";

import {
  deleteFile,
  renameFile,
  addStarredFile,
  createShare,
  removeStarredFile,
  
  
  
} from "../api/file.api";
import { useOperation } from "./OperationContext";


const DriveContext = createContext(null);

export function DriveProvider({ children }) {

  const { startOperation, finishOperation } =
    useOperation();

  


  /* -----------------------------
      Drive State
  ------------------------------ */

  const [currentDirectoryId, setCurrentDirectoryId] = useState("");

  const [directoryData, setDirectoryData] = useState(null);

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);

  const [selectedItems, setSelectedItems] = useState([]);

  const [viewMode, setViewMode] = useState("grid");

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);



  

  /* -----------------------------
        Fetch Directory
  ------------------------------ */

  const refreshDirectory = useCallback(
    async (
      directoryId = currentDirectoryId,
      breadcrumbTrail = breadcrumbs
    ) => {
      try {
        setLoading(true);

        const data = await getDirectoryItems(directoryId);

        setDirectoryData(data);

        setCurrentDirectoryId(directoryId);

        setBreadcrumbs(breadcrumbTrail);

        setError(null);

        return data;
      } catch (err) {
        console.error(err);

        setError(err.message || "Unable to load directory.");
      } finally {
        setLoading(false);
      }
    },
    [currentDirectoryId, breadcrumbs]
  );



  /* -----------------------------
      Folder Operations
  ------------------------------ */

  const createFolder = async (folderName) => {
    await createDirectory(currentDirectoryId, folderName);

    await refreshDirectory(currentDirectoryId);
  };

  const removeFolder = async (folderId) => {
    await deleteDirectory(folderId);

    await refreshDirectory(currentDirectoryId);
  };

  const renameFolder = async (
    folderId,
    newFolderName
  ) => {
     const operationId =
        startOperation({
            title: "Renaming ",
            message: "Renaming.",
        });

    try {
    await renameDirectory(folderId, newFolderName);

    await refreshDirectory(currentDirectoryId);
  } finally {
    finishOperation(operationId);
  }} 

  /* -----------------------------
        File Operations
  ------------------------------ */
const openFile = (file) => {
  window.location.href = `https://cloudisk-cloud.up.railway.app/file/${file._id}`;
};
  const removeFile = async (fileId) => {

    const operationId =
        startOperation({
            title: "Deleting File",
            message: "Removing your file...",
        });

    try {

        await deleteFile(fileId);

        await refreshDirectory(currentDirectoryId);

    } finally {

        finishOperation(operationId);

    }
};

  const updateFileName = async (
    fileId,
    newFilename
  ) => {
      const operationId =
        startOperation({
            title: "Renaming File",
            message: "Renaming your file...",
        });

    try {
    await renameFile(fileId, newFilename);

    await refreshDirectory(currentDirectoryId);
  } finally {
    finishOperation(operationId);
  }}

  const toggleStar = async (fileId) => {
     const operationId =
        startOperation({
            title: " Starring ",
            message: " adding to Starred...",
        });
         try {
           await addStarredFile(fileId);

    await refreshDirectory(currentDirectoryId);
           
         }finally {
            finishOperation(operationId);
         }
   
  };

   const removeStar = async (fileId) => {
     const operationId =
        startOperation({
            title: " removing from Starred ",
            message: " removing...",
        });
         try {
           await removeStarredFile(fileId);

    await refreshDirectory(currentDirectoryId);
    
           
         }finally {
            finishOperation(operationId);
         }
   
  };

  const shareFile = async (fileId) => {
     return await createShare(fileId);
  };

  const getshareFile = async (token) => {
    return await getSharedFile(token);
  };

  /* -----------------------------
      Folder Navigation
  ------------------------------ */

  const navigateToFolder = async (
  folder,
  trail  = breadcrumbs
) => {
  const nextTrail = [
    ...trail ,
    {
      id: folder._id,
      name: folder.name,
    },
  ];

  await refreshDirectory(folder._id, nextTrail);
};

const openFolder = navigateToFolder;





  const goHome = async () => {
    await refreshDirectory("", []);

    setCurrentDirectoryId("");

    setBreadcrumbs([]);
  };

  const navigateToBreadcrumb = async (
    index
  ) => {
    if (index < 0) {
      await goHome();
      return;
    }

    const crumb = breadcrumbs[index];

    const nextTrail = breadcrumbs.slice(
      0,
      index + 1
    );

   await refreshDirectory(crumb.id,nextTrail);
   
  };

  /* -----------------------------
      Selection
  ------------------------------ */

  const toggleSelection = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }

      return [...prev, itemId];
    });
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  /* -----------------------------
      Search
  ------------------------------ */

  const filteredFiles = useMemo(() => {
    if (!directoryData?.files) return [];

    if (!searchQuery.trim())
      return directoryData.files;

    return directoryData.files.filter((file) =>
      file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [directoryData, searchQuery]);

  const filteredFolders = useMemo(() => {
    if (!directoryData?.directories) return [];

    if (!searchQuery.trim())
      return directoryData.directories;

    return directoryData.directories.filter(
      (folder) =>
        folder.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    );
  }, [directoryData, searchQuery]);
  console.log("currentDirectoryId", currentDirectoryId);

  /* -----------------------------
      Context Value
  ------------------------------ */

  const value = useMemo(
    () => ({
      loading,
      error,

      directoryData,
    

      currentDirectoryId,

      breadcrumbs,

      selectedItem,
      selectedItems,

      searchQuery,

      viewMode,

      filteredFiles,
      filteredFolders,

     

      setSelectedItem,
      setSearchQuery,
      setViewMode,

      refreshDirectory,
      openFolder,
      goHome,
      navigateToBreadcrumb,

      createFolder,
      removeFolder,
      renameFolder,


      openFile,
      removeFile,
      updateFileName,

      removeStar,
      toggleStar,
      shareFile,
      getshareFile,

      toggleSelection,
      clearSelection,
    }),
    [
      loading,
      error,
      directoryData,
      currentDirectoryId,
      breadcrumbs,
      selectedItem,
      selectedItems,
      searchQuery,
      viewMode,
      filteredFiles,
      filteredFolders,
    ]
  );

  return (
    <DriveContext.Provider value={value}>
      {children}
    </DriveContext.Provider>
  );
}

export function useDrive() {
  const context = useContext(DriveContext);

  if (!context) {
    throw new Error(
      "useDrive must be used inside DriveProvider"
    );
  }

  return context;
}