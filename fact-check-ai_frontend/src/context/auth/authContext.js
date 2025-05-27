import { useContext } from "react"
import AuthContext from "./authProvider";

const useAuthContext = () => {
  return useContext(AuthContext);
};


export default useAuthContext;