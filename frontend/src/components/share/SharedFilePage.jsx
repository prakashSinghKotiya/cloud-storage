import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedFile } from "../../api/file.api";

export default function SharedFilePage() {
  const { token } = useParams();
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getSharedFile(token);
      setFile(data);
    }

    if (token) load();
  }, [token]);

  if (!file) return <div>Loading...</div>;

  return (
     <div className="p-10">
      {file && (
        <img
          src={file}
          alt="Shared file"
          className="max-w-full rounded-lg"
        />
      )}
    </div>
  );
}