import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { isNumber } from "../scripts/isNumber";
import rsa from 'js-crypto-rsa';
import { encryptPKey, decryptPKey, encryptTag } from "../scripts/securePKey";
import CryptoJS from "crypto-js";

export const useSignup = () => {
    const [error, set_error] = useState(null);
    const [isLoading, set_isLoading] = useState(null);
    const {dispatch} = useContext(AuthContext);

    const signup = async (tag, username, password, pin) => {
        // reset state variables
        set_isLoading(true)
        set_error(null)

        // check if the PIN is valid
        if(pin.length != 8 || !isNumber(pin)) {
            set_isLoading(false);
            set_error('The PIN must be 8 digits long and only contain numbers.');
            return;
        }

        // generate the keys
        var key = await rsa.generateKey(4096);
        var publicKey = key.publicKey;
        var publicKeyStr = JSON.stringify(publicKey);
        var privateKey = key.privateKey;
        
        // send request to database
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tag, username, password, key: publicKeyStr})
        })
        const json = await response.json();

        if(!response.ok) {
            // if response is not ok display error
            set_isLoading(false);
            set_error(json.error);
        } else {
            // save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //          save the private key to local storage

            // produce the tag hash and the encyrepted private key to save to the local storage
            var tag_h = CryptoJS.SHA3(tag+pin).toString();
            var encryptedPKey = await encryptPKey(privateKey, tag+pin);
            // produce another pair that is also offline protected
            var tag_h_ex = await encryptTag(tag_h, username+password);
            var encryptedPKey_ex = await encryptPKey(encryptedPKey, username+password);

            // check if the pKeys item already exists in local storage
            var exists = localStorage.getItem('pKeys');
            var exists_ex = localStorage.getItem('pKeys_ex');

            if (exists) {
                // if pKeys already exists add a new entry
                var old_data = JSON.parse(exists);
                var data = [...old_data, {tag: tag_h, key: encryptedPKey}];
                var old_data_ex = JSON.parse(exists_ex);
                var data_ex = [...old_data_ex, {tag: tag_h_ex, key: encryptedPKey_ex}];
                localStorage.setItem('pKeys', JSON.stringify(data));
                localStorage.setItem('pKeys_ex', JSON.stringify(data_ex));
            } else {
                // if pKeys does not exist create the entry
                var data = [{tag: tag_h, key: encryptedPKey}];
                var data_ex = [{tag: tag_h_ex, key: encryptedPKey_ex}];
                localStorage.setItem('pKeys', JSON.stringify(data));
                localStorage.setItem('pKeys_ex', JSON.stringify(data_ex));
            }

            // update the context state
            var user = {...json, pKey: privateKey, pin};
            dispatch({type: 'LOGIN', payload: user});
            console.log(user);

            set_isLoading(false);
        }
    }

    return {signup, isLoading, error}
}