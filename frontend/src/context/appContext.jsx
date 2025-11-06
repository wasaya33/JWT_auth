import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
 
  axios.defaults.withCredentials = true; 

  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

   
  // getAuthStatus()
  const getAuthStatus = async () => {
    try {
      const {data} = await axios.get(backendurl + '/api/auth/is-auth');
      if(data.Success){
        setIsLoggedIn(true);
        getUserdata();  
      }
    } catch (error) {
       toast.error(error.response?.data?.message);
    }
  };

  // ✅ Fetch user data
  const getUserdata = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/api/user/data`, {
        withCredentials: true, // send cookies (JWT)
      });

      console.log("Fetched user data:", data);

      if (data.success) {
        setUserData(data.data); // ✅ backend returns { success, data: {name, ...} }
        toast.success("User data updated");
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong while fetching user data");
    }
  };

  useEffect(() => {
    getAuthStatus();
  }, []); 
  const value = {
    backendurl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserdata,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
