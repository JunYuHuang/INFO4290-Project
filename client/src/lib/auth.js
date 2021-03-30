import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import cookie from "js-cookie";

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signup = async (username, password) => {
    await axios
      .post(
        `${process.env.REACT_APP_HTTPS_SERVER_URL}/signup`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
      });
  };

  const login = async (username, password) => {
    await axios
      .post(
        `${process.env.REACT_APP_HTTPS_SERVER_URL}/login`,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setUser(res.data);
      });
  };

  const signout = async () => {
    await axios
      .post(`${process.env.REACT_APP_HTTPS_SERVER_URL}/signout`, null, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          setUser(null);
          cookie.remove("connect.sid");
        }
      });
  };

  useEffect(() => {
    const authenticate = async () => {
      await axios
        .post(`${process.env.REACT_APP_HTTPS_SERVER_URL}/authenticate`, null, {
          withCredentials: true,
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    authenticate();
  }, []);

  return {
    user,
    signup,
    login,
    signout,
  };
}
