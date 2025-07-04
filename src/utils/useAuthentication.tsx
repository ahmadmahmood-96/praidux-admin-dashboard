import { useCallback, useRef, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { useNavigate } from "react-router-dom";
import { EndpointUrl } from "../environments.tsx";
import { notification } from "antd";

interface GlobalState {
  token: string;
  user: {
    id?: string;
    email: string;
    name: string;
    role: string;
  };
}

const { getGlobalState, setGlobalState } = createGlobalState<GlobalState>({
  token: localStorage.getItem("token") || "",
  user: JSON.parse(localStorage.getItem("user") || "{}"),
});

const gettoken = (): string => getGlobalState("token");
const settoken = (value: string): void => {
  localStorage.setItem("token", value);
  setGlobalState("token", value);
};

const getUser = (): GlobalState["user"] => getGlobalState("user");
const setUser = (value: GlobalState["user"]): void => {
  localStorage.setItem("user", JSON.stringify(value));
  setGlobalState("user", value);
};

const removetoken = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setGlobalState("token", "");
  setGlobalState("user", {
    id: "",
    email: "",
    name: "",
    role: "",
  });
};

const usetoken = (): [string, () => void] => {
  const tokenRef = useRef<string>(gettoken());

  const updatetoken = useCallback(() => {
    tokenRef.current = gettoken();
  }, []);

  return [tokenRef.current, updatetoken];
};

const useUser = (): [
  GlobalState["user"],
  (value: GlobalState["user"]) => void
] => {
  const userRef = useRef<GlobalState["user"]>(getUser());

  const updateUser = useCallback((value: GlobalState["user"]) => {
    userRef.current = value;
  }, []);

  return [userRef.current, updateUser];
};

export function UseAuthentication() {
  const [loading, setLoading] = useState(false);
  const [JWT, updatetoken] = usetoken();
  const [user] = useUser();
  const navigate = useNavigate();

  const login = useCallback(
    (email: string, password: string) => {
      setLoading(true);
      fetch(`${EndpointUrl}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.token) {
            const token = data.token;
            settoken(token);
            setUser(data.user);
            updatetoken();
            // Notify other tabs of login
            const bc = new BroadcastChannel("auth");
            bc.postMessage({
              type: "LOGIN",
              payload: { token: token, user: data.user },
            });
            setLoading(false);
            if (data.user?.role?.name == "company_client_admin") {
              navigate("/orders");
            } else {
              navigate("/");
            }
          } else {
            setLoading(false);
            notification.error({
              duration: 90,
              placement: "topRight",
              message: "Failed to login",
              description: "Please verify your credentials",
            });
          }
        })
        .catch(() => {
          setLoading(false);
          notification.error({
            placement: "topRight",
            message: "An error occurred",
            description: "Error occurred while logging in",
          });
        });
    },
    [updatetoken, navigate]
  );

  const logout = useCallback(() => {
    removetoken();
    updatetoken();
    const bc = new BroadcastChannel("auth");
    bc.postMessage({ type: "LOGOUT", payload: { token: null, user: null } });
    bc.close();
    window.location.reload();
    navigate("/login");
  }, [updatetoken, navigate, JWT]);

  return {
    loading,
    JWT,
    user,
    login,
    logout,
  };
}

export default UseAuthentication;
