import { useReducer, createContext } from "react";
import { authReducer } from "./reducers/authReducer";

// create the context
export const AuthContext = createContext();

// the initial state of the context
function createInitialState() {
    const json = localStorage.getItem('user')
    if(json) {
        const user = JSON.parse(json)
        return { user }
    } else {
        return { user: null }
    }
}

// context provider
export const AuthContextProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, {user: null}, createInitialState)
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}