import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("authToken") || null;

  const [authToken, setAuthToken] = useState(savedToken);
  const [user, setUser] = useState('')
  const [usermail, setUsermail] = useState('')

  const [refreshAuthFlag, setRefreshAuthFlag] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [userId, setUserId] = useState('')
  const [signupPassword, setSignupPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isverified, setIsverified] = useState(false);
  const [country, setCountry] = useState("");
  const [topics, setTopics] = useState([]);

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem('user_name')
    const savedUsermail = localStorage.getItem('email')
    if (savedToken) {
      setAuthToken(savedToken);
    }
    if (savedUser){
      setUser(savedUser)
    }
    if (savedUsermail){
      setUsermail(savedUsermail)
    }
  }, []);

  const handleAuthFlag = (flag) => {
    setRefreshAuthFlag(flag);
  };

  const addToken = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
  };

  const clearToken = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
  };

  const addSignupEmail = (value) => {
    setSignupEmail(value);
  };

  const addSignupPassword = (value) => {
    setSignupPassword(value);
  };

  const addUsername = (value) => {
    setUsername(value);
  };

  const addIsVerified = (value) => {
    setIsverified(value);
  };

  const addCountry = (value) => {
    setCountry(value);
  };

  const addTopics = (value) => {
    setTopics(value);
  };

  const addUserId = (value) => {
    setUserId(value)
  }

  const addLoginEmail = (value) =>{
    setLoginEmail(value)
  }

  const addLoginPassword = (value) => {
    setLoginPassword(value)
  }

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        usermail,
        addToken,
        clearToken,
        refreshAuthFlag,
        handleAuthFlag,
        signupEmail,
        addSignupEmail,
        signupPassword,
        addSignupPassword,
        username,
        addUsername,
        isverified,
        addIsVerified,
        country,
        addCountry,
        topics,
        addTopics,
        userId,
        addUserId,
        loginEmail,
        addLoginEmail,
        loginPassword,
        addLoginPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;