import CryptoJS from "crypto-js";

export const messageReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CONTACT':
            var data_new = [{...action.payload}, ...state.data];
            state.data = data_new;
            return {...state};
        case 'ADD_MESSAGE':
            // find that user
            var c = -1;
            for (let i = 0; i < state.data.length; i++) {
                if (state.data[i].tag === action.payload.tag) {
                    c = i;
                }
            }

            // add the new message
            var msg_old = state.data[c].messages;
            state.data[c].messages = [action.payload.message, ...msg_old];

            return {...state}
        case 'LOGIN':
            var {pKey, tag} = action.payload;
            state.user = tag;
            // create valid 216 bit key from our pKey using SHA512
            var pKey_str = JSON.stringify(pKey);
            var pKey_h = CryptoJS.SHA512(pKey_str);
            pKey_h = pKey_h.toString().substring(16, 48);

            // get the current data on the lc
            var lc = localStorage.getItem('messages');

            if(!lc) {
                // if no entry exists set data to empty
                state.data = [];
            } else {
                // if entry exists
                var messages = JSON.parse(lc);

                // check if the current user exists
                var c = -1;
                for (let i = 0; i < messages.length; i++) {
                    var dec_user = CryptoJS.AES.decrypt(messages[i].user, pKey_h).toString(CryptoJS.enc.Utf8);
                    if (dec_user == tag) {
                        c = i;
                    }
                }

                if (c === -1) {
                    // if the current user does not exist set data to empty
                    state.data = [];
                } else {
                    // if the current user does exist set data to stored value
                    data_str = CryptoJS.AES.decrypt(messages[c].data, pKey_h).toString(CryptoJS.enc.Utf8);
                    state.data = JSON.parse(data_str);
                }
            }
            return {...state};
        case 'LOGOUT':
            return {user: "", data: []};
        case 'SAVE':
            // deconstruct the variables
            var {user, data} = state;
            var {pKey, tag} = action.payload;

            // stringify the values
            var data_str = JSON.stringify(data);
            var pKey_str = JSON.stringify(pKey);

            // create valid 216 bit key from our pKey using SHA512
            var pKey_h = CryptoJS.SHA512(pKey_str);
            pKey_h = pKey_h.toString().substring(16, 48);

            // encrypt the data
            var data_ex = CryptoJS.AES.encrypt(data_str, pKey_h).toString();
            var user_ex = CryptoJS.AES.encrypt(user, pKey_h).toString();

            // get the current data on the lc
            var lc = localStorage.getItem('messages');

            if(!lc) {
                // if no entry exists create one
                console.log('not exists');
                var messages = JSON.stringify([{user: user_ex, data: data_ex}]);
                localStorage.setItem('messages', messages.toString());
            } else {
                // if entry exists edit it
                console.log('exists');
                var messages = JSON.parse(lc);

                // check if the current user already exists
                var c = -1;
                for (let i = 0; i < messages.length; i++) {
                    var dec_user = CryptoJS.AES.decrypt(messages[i].user, pKey_h).toString(CryptoJS.enc.Utf8);
                    if (dec_user == user) {
                        c = i;
                    }
                }

                if (c === -1) {
                    // if the current user does not exist
                    var msg_new = JSON.stringify([{user: user_ex, data: data_ex}, ...messages]);
                    localStorage.setItem('messages', msg_new);
                } else {
                    // if the current user does exist
                    // edit the data
                    messages[c].data = data_ex;
                    // turn to string
                    var msg_str = JSON.stringify(messages);
                    // set the data back to localstorage
                    localStorage.setItem('messages', msg_str);
                }
            }
            return state;
        default:
            return state;
    }
}