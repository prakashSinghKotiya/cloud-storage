import { axiosWithCreds } from "./axios";

export const createSubscription = async (planId) => {
  const { data } = await axiosWithCreds.post("/subscriptions", { planId });
  return data;
};