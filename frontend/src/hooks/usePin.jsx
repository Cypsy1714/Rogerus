import { useState, useContext } from "react";
import { isNumber } from "../scripts/isNumber";
import CryptoJS from "crypto-js";
import { decryptPKey } from "../scripts/securePKey";
import { AuthContext } from "../context/AuthContext";

export const usePin = () => {
    const [error, set_error] = useState(null);
    const [success, set_success] = useState(false);
    const [isLoading, set_isLoading] = useState(null);
    const {user, dispatch} = useContext(AuthContext);
    const tag = user.tag;

    const enterPin = async (pin) => {
        // reset state variables
        set_isLoading(true);
        set_error(null);

        // check if the PIN is valid
        if(pin.length != 8 || !isNumber(pin)) {
            set_isLoading(false);
            set_error('The PIN must be 8 digits long and only contain numbers.');
            return;
        }

        // find the correct encrypted pKey
        var pKeyArray = JSON.parse(localStorage.getItem('pKeys'));
        // test every tag hash to find the correct one
        var c = -1;
        for (let i = 0; i < pKeyArray.length; i++) {
            if (pKeyArray[i].tag === CryptoJS.SHA3(tag+pin).toString()) {
                c = i;
            }
        }

        if(c === -1) {
            // if no tag could be found it means the given PIN is incorrect
            set_isLoading(false);
            set_error('Incorrect PIN');
            return;
        }
        // attemp to decrypt the pKey
        var pKey = await decryptPKey(pKeyArray[c].key, tag+pin);

        // check the kty, if not "RSA" then send error, the pin is not correct
        if (pKey.kty != 'RSA') {
            set_isLoading(false);
            set_error('Incorrect PIN');
            return;
        }

        // pin correct, update the AuthContext
        user.pKey = pKey;
        set_success(true);
    }

    return {enterPin, isLoading, error, success}
}