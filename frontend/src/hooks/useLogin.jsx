import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const useLogin = () => {
    const [error, set_error] = useState(null);
    const [isLoading, set_isLoading] = useState(null);
    const {user, dispatch} = useContext(AuthContext);

    const login = async (username, password) => {
        // reset state variables
        set_isLoading(true)
        set_error(null)

        // send request to database
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        })
        const json = await response.json();

        if(!response.ok) {
            // if response is not ok display error
            set_isLoading(false)
            set_error(json.error)
        } else {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the context state
            dispatch({type: 'LOGIN', payload: json});
            console.log(user);

            set_isLoading(false);
        }
    }

    return {login, isLoading, error}
}