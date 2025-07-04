import { UseAuthentication } from "./utils/useAuthentication";
export const EndpointUrl: string = import.meta.env.VITE_BACKEND_URL;

export const GetHeaders = (): {
  Authorization: string;
  "Content-Type": string;
} => {
  const { JWT } = UseAuthentication();
  const headers = {
    Authorization: `Bearer ${JWT}`,
    "Content-Type": "application/json",
  };

  return headers;
};

export const GetFormHeaders = (): {
  Authorization: string;
  "Content-Type": string;
} => {
  const { JWT } = UseAuthentication();
  const headers = {
    Authorization: `Bearer ${JWT}`,
    "Content-Type": "multipart/form-data",
  };

  return headers;
};
