import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CryptoJS from "crypto-js";

export const useLogout = () => {
    const {user, dispatch} = useContext(AuthContext);

    const logout = () => {
        // remove user from local storage
        localStorage.removeItem('user');

        //          change the fast acces pKeys to the more secure version
        // find the correct pKey
        var pKeyArray = JSON.parse(localStorage.getItem('pKeys'));
        // test every tag hash to find the correct one
        var c = -1;
        for (let i = 0; i < pKeyArray.length; i++) {
            if (pKeyArray[i].tag === CryptoJS.SHA3(user.tag+user.pin).toString()) {
                c = i;
            }
        }
        console.log(c);
        if(c != -1) {
            var pKeyArray_ex = JSON.parse(localStorage.getItem('pKeys_ex'));
            pKeyArray[c] = pKeyArray_ex[c];
            localStorage.setItem('pKeys', JSON.stringify(pKeyArray));
        }

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
    }

    return{logout}
}