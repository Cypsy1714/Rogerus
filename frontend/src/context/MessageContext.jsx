import { useReducer, createContext } from "react";
import { messageReducer } from "./reducers/messageReducer";

// create the context
export const MessageContext = createContext();

// context provider
export const MessageContextProvider = (props) => {
    // message data structure inside data {tag: "", key: "", messages: [{date: "", content: ""}]}
    const [state, dispatch] = useReducer(messageReducer, {user: "", data: []})
    return (
        <MessageContext.Provider value={{...state, dispatch}}>
            {props.children}
        </MessageContext.Provider>
    )
}