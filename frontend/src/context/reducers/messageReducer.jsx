import CryptoJS from "crypto-js";

export const messageReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_CONTACT':
            // check if contact already exists
            for (let i = 0; i < state.data.length; i++) {
                if (state.data[i].tag === action.payload.message.tag) {
                    return {...state};
                }
            }

            // if does not already exist add contact
            var data_new = [{...action.payload.message}, ...state.data];
            state.data = data_new;

            // update and add to the lc

            // get data from lc
            var ls = localStorage.getItem('messages');
            var ls_json = JSON.parse(ls);

            // stringify the pKey
            var pKey_str = JSON.stringify(action.payload.pKey);

            // create valid 216 bit key from our pKey using SHA512
            var pKey_h = CryptoJS.SHA512(pKey_str);
            pKey_h = pKey_h.toString().substring(16, 48);

            // find the current user
            var c = -1;
            for (let i = 0; i < ls_json.length; i++) {
                var dec_user = CryptoJS.AES.decrypt(ls_json[i].user, pKey_h).toString(CryptoJS.enc.Utf8);
                if (dec_user == action.payload.user) {
                    c = i;
                }
            }

            // if the user is found add the msg
            if (c !== -1) {
                //          encrypt before saving
                
                // deep copy payload.message
                let temp_ = JSON.stringify(action.payload.message);
                let new_msg = JSON.parse(temp_);
                new_msg.tag = CryptoJS.AES.encrypt(new_msg.tag, pKey_h).toString();
                new_msg.key = CryptoJS.AES.encrypt(new_msg.key, pKey_h).toString();
                ls_json[c].data = JSON.parse(ls_json[c].data);
                ls_json[c].data.push(new_msg);
                ls_json[c].data = JSON.stringify(ls_json[c].data);

                // save to lc
                var data_str = JSON.stringify(ls_json);
                localStorage.setItem('messages', data_str);
            }

            return {...state};
        case 'ADD_MESSAGE':
            // find that user
            var c = -1;
            for (let i = 0; i < state.data.length; i++) {
                if (state.data[i].tag === action.payload.tag) {
                    c = i;
                }
            }

            if(c !== -1) {
                // check if message already exists using the date
                for (let i = 0; i < state.data[c].messages.length; i++) {
                    if (state.data[c].messages[i].date === action.payload.message.date) {
                        return {...state};
                    }
                }

                // if not add the new message
                var msg_old = state.data[c].messages;
                state.data[c].messages = [action.payload.message, ...msg_old];

                // update and add to the lc

                // get data from lc
                var ls = localStorage.getItem('messages');
                var ls_json = JSON.parse(ls);

                // stringify the pKey
                var pKey_str = JSON.stringify(action.payload.pKey);

                // create valid 216 bit key from our pKey using SHA512
                var pKey_h = CryptoJS.SHA512(pKey_str);
                pKey_h = pKey_h.toString().substring(16, 48);

                // find the current user
                var c = -1;
                for (let i = 0; i < ls_json.length; i++) {
                    var dec_user = CryptoJS.AES.decrypt(ls_json[i].user, pKey_h).toString(CryptoJS.enc.Utf8);
                    if (dec_user == action.payload.user) {
                        c = i;
                    }
                }

                // if the user is found add the msg
                if (c !== -1) {
                    // find the contact object
                    var data;
                    var u = -1;
                    let data_temp = JSON.parse(ls_json[c].data);
                    ls_json[c].data = JSON.parse(ls_json[c].data);
                    for (let i = 0; i < data_temp.length; i++) {
                        console.log(ls_json)
                        console.log(data_temp)
                        var dec_tag = CryptoJS.AES.decrypt(data_temp[i].tag, pKey_h).toString(CryptoJS.enc.Utf8);
                        if (dec_tag == action.payload.tag) {
                            data = data_temp[i];
                            u = i;
                        }
                    }

                    //          encrypt before saving
                    
                    // deep copy payload.message
                    let temp_ = JSON.stringify(action.payload.message);
                    let new_msg = JSON.parse(temp_);
                    new_msg.date = CryptoJS.AES.encrypt(new_msg.date, pKey_h).toString();
                    new_msg.content = CryptoJS.AES.encrypt(new_msg.content, pKey_h).toString();
                    data_temp[u].messages.push(new_msg);
                    ls_json[c].data[u] = data_temp;
                    ls_json[c].data = JSON.stringify(data_temp);

                    // save to lc
                    var data_str = JSON.stringify(ls_json);
                    localStorage.setItem('messages', data_str);
                }
            }
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
                    // data_str = CryptoJS.AES.decrypt(messages[c].data, pKey_h).toString(CryptoJS.enc.Utf8);
                    let data_temp = JSON.parse(messages[c].data);
                    for (let i = 0; i < data_temp.length; i++) {
                        data_temp[i].tag = CryptoJS.AES.decrypt(data_temp[i].tag, pKey_h).toString(CryptoJS.enc.Utf8);
                        data_temp[i].key = CryptoJS.AES.decrypt(data_temp[i].key, pKey_h).toString(CryptoJS.enc.Utf8);
                        for (let c = 0; c < data_temp[i].messages.length; c++) {
                            data_temp[i].messages[c].date = CryptoJS.AES.decrypt(data_temp[i].messages[c].date, pKey_h).toString(CryptoJS.enc.Utf8);
                            data_temp[i].messages[c].content = CryptoJS.AES.decrypt(data_temp[i].messages[c].content, pKey_h).toString(CryptoJS.enc.Utf8);
                        }
                    }
                    state.data = data_temp;
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
            var pKey_str = JSON.stringify(pKey);

            // create valid 216 bit key from our pKey using SHA512
            var pKey_h = CryptoJS.SHA512(pKey_str);
            pKey_h = pKey_h.toString().substring(16, 48);

            // encrypt the data
            for (let i = 0; i < data.length; i++) {
                data[i].tag = CryptoJS.AES.encrypt(data[i].tag, pKey_h).toString();
                data[i].key = CryptoJS.AES.encrypt(data[i].key, pKey_h).toString();
                for (let c = 0; c < data[i].messages.length; c++) {
                    data[i].messages[c].date = CryptoJS.AES.encrypt(data[i].messages[c].date, pKey_h).toString();
                    data[i].messages[c].content = CryptoJS.AES.encrypt(data[i].messages[c].content, pKey_h).toString();
                }
            }
            var data_ex = JSON.stringify(data);
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