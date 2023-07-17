import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { decryptPKey, decryptTag } from "../scripts/securePKey";
import CryptoJS from "crypto-js";
import { MessageContext } from "../context/MessageContext";

export const useLogin = () => {
    const [error, set_error] = useState(null);
    const [isLoading, set_isLoading] = useState(null);
    const {dispatch} = useContext(AuthContext);
    const {dispatch: msg_dispatch} = useContext(MessageContext);

    const login = async (username, password, pin) => {
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

            if(!pin) {
                set_isLoading(false);
                set_error('All fields must be filled');
                return;
            }

            //      check the pin and attempt to decrypt private keys
            // find the correct encrypted pKey
            var pKeyArray = JSON.parse(localStorage.getItem('pKeys'));
            // test every tag hash to find the correct one
            var tag = json.tag;
            var c = -1;
            for (let i = 0; i < pKeyArray.length; i++) {
                try {
                    var stage_ex = await decryptTag(pKeyArray[i].tag, username+password); 
                } catch {
                    var stage_ex = '-';
                }
                
                if (stage_ex === CryptoJS.SHA3(tag+pin).toString()) {
                    c = i;
                }
            }

            if (c === -1) {
                // give error if cannot find the private key
                set_isLoading(false);
                set_error('Incorrect PIN or you are trying to log in from a different device.');
                return;
            }

            // decrypt the tag
            var tag_n = await decryptTag(pKeyArray[c].tag, username+password);
            // decrypt the pKey
            var pKey_n = await decryptPKey(pKeyArray[c].key, username+password);
            // save the new versions to the temp variable
            pKeyArray[c].tag = tag_n;
            pKeyArray[c].key = pKey_n;
            // save to local storage
            localStorage.setItem('pKeys', JSON.stringify(pKeyArray));

            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            // get the current pKey
            var pKey = await decryptPKey(pKey_n, tag+pin);

            // update the context state
            var user = {...json, pKey, pin}
            dispatch({type: 'LOGIN', payload: user});
            console.log(user);

            // load the messages
            msg_dispatch({type: 'LOGIN', payload: {tag: tag, pKey: pKey}});

            set_isLoading(false);
        }
    }

    return {login, isLoading, error}
}