import { createContext, useCallback, useState } from "react";
import { baseUrl } from "../utils/services";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerInfo, setRegisterInfo] = useState({
        name : "", 
        email : "",
        password: "",
    }
    );
    const updateRegisterInfo = useCallback((info)=>
    {
        setRegisterInfo(info);
    },[]);
    const [registererror, setRegisterError] = useState(null);
    const [loginerror, setLoginError] = useState(null);
    const [loading, setLoading] = useState(false);


    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await postrequest(`${baseUrl}/users/register`, data);
            if (response) {
                setUser(response);
                localStorage.setItem("user", JSON.stringify(response));
            }
        } catch (error) {
            return setRegisterError(error.message);
        }
        setLoading(false);
    }, []);


    console.log(registerInfo);
  return (
    <AuthContext.Provider value={{ user,registerInfo,updateRegisterInfo,registerUser,registererror,loading }}>
      {children}
    </AuthContext.Provider>
  );
 
};
