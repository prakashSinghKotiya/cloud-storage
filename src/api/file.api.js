import { axiosWithCreds } from "./axios";

export const getStarredFiles = async () => {
  const { data } = await axiosWithCreds.get(`/file/getStaredFile`);
  return data;
};

export const addStarredFile = async (fileId) => {
  const { data } = await axiosWithCreds.patch(`/file/star/${fileId}`);
  return data;
};

export const removeStarredFile = async (fileId) => {
  const { data } = await axiosWithCreds.patch(`/file/removestar/${fileId}`);
  return data;
};

export const deleteFile = async (id) => {
  const { data } = await axiosWithCreds.delete(`/file/${id}`);
  return data;
};

export const createShare = async (fileId) => {
  const { data } = await axiosWithCreds.post(`/share/createshare/${fileId}`);
  console.log(data);
  return data;
};

export const getSharedFile = async (token) => {
  const { data } = await axiosWithCreds.get(`/share/${token}`);
  console.log("api",data);
  return data;
};

export const renameFile = async (id, newFilename) => {
  const { data } = await axiosWithCreds.patch(`/file/${id}`, {
    newFilename,
  });
  return data;
};

export const uploadInitiate = async (fileData) => {
  const { data } = await axiosWithCreds.post("/file/upload/initiate", fileData);
  return data;
};

export const uploadComplete = async (fileId) => {
  const { data } = await axiosWithCreds.post("/file/upload/complete", {
    fileId,
  });
  return data;
};

