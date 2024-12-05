import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  useEffect((e) => {
    const User = localStorage.getItem("user");
    if (User) {
      setUser(JSON.parse(User));
    }
  }, []);
  
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );
      if (response.error) {
        setLoading(false);
        return setRegisterError(response.message);
      }
      setRegisterError("compte created successfully");
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      setLoading(false);
    },
    [registerInfo]
  );

  

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo)
      );
      if (response.error) {
        setLoading(false);
        return setLoginError(response.message);
      }
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      setLoading(false);
    },
    [loginInfo]
  );



  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        loading,
        logoutUser,
        updateLoginInfo,
        loginError,
        loginInfo,
        loginUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
