import { axiosWithCreds, axiosWithoutCreds } from "./axios";

export const fetchUser = async () => {
  const { data } = await axiosWithCreds.get("/user");
  return data;
};

export const fetchAllUsers = async () => {
  const { data } = await axiosWithCreds.get("/user/users");
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosWithCreds.post("/user/logout");
  return data;
};

export const logoutAllSessions = async () => {
  const { data } = await axiosWithCreds.post("/user/logout-all");
  return data;
};

export const logoutUserById = async (id) => {
  const { data } = await axiosWithCreds.post(`/user/users/${id}/logout`);
  return data;
};

export const loginUser = async (formData) => {
  const { data } = await axiosWithCreds.post("/user/login", formData);
  return data;
};

export const registerUser = async (formData) => {
  const { data } = await axiosWithoutCreds.post("/user/register", formData);
  return data;
};

export const deleteUserById = async (id) => {
  const { data } = await axiosWithCreds.delete(`/user/users/${id}`);
  return data;
};