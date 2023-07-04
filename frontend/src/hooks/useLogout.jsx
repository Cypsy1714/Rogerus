import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useLogout = () => {
    const {user, dispatch} = useContext(AuthContext);

    const logout = () => {
        // remove user from local storage
        localStorage.removeItem('user');

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
    }

    return{logout}
}