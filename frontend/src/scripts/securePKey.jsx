import CryptoJS from "crypto-js";

// encrypt private key object
export const encryptPKey = async (key, secret) => {
    var d = CryptoJS.AES.encrypt(key.d, secret+'d').toString();
    var dp = CryptoJS.AES.encrypt(key.dp, secret+'dp').toString();
    var dq = CryptoJS.AES.encrypt(key.dq, secret+'dq').toString();
    var e = CryptoJS.AES.encrypt(key.e, secret+'e').toString();
    var kty = CryptoJS.AES.encrypt(key.kty, secret+'kty').toString();
    var n = CryptoJS.AES.encrypt(key.n, secret+'n').toString();
    var p = CryptoJS.AES.encrypt(key.p, secret+'p').toString();
    var q = CryptoJS.AES.encrypt(key.q, secret+'q').toString();
    var qi = CryptoJS.AES.encrypt(key.qi, secret+'qi').toString();

    // return the encrypted object
    return {d, dp, dq, e, kty, n, p, q, qi};
}

// decrypt private key object
export const decryptPKey = async (key, secret) => {
    var d = CryptoJS.AES.decrypt(key.d, secret+'d').toString(CryptoJS.enc.Utf8);
    var dq = CryptoJS.AES.decrypt(key.dq, secret+'dq').toString(CryptoJS.enc.Utf8);
    var dp = CryptoJS.AES.decrypt(key.dp, secret+'dp').toString(CryptoJS.enc.Utf8);
    var e = CryptoJS.AES.decrypt(key.e, secret+'e').toString(CryptoJS.enc.Utf8);
    var kty = CryptoJS.AES.decrypt(key.kty, secret+'kty').toString(CryptoJS.enc.Utf8);
    var n = CryptoJS.AES.decrypt(key.n, secret+'n').toString(CryptoJS.enc.Utf8);
    var p = CryptoJS.AES.decrypt(key.p, secret+'p').toString(CryptoJS.enc.Utf8);
    var q = CryptoJS.AES.decrypt(key.q, secret+'q').toString(CryptoJS.enc.Utf8);
    var qi = CryptoJS.AES.decrypt(key.qi, secret+'qi').toString(CryptoJS.enc.Utf8);

    // return the encrypted object
    return {d, dp, dq, e, kty, n, p, q, qi};
}

// encrypt tag
export const encryptTag = async (tag, secret) => {
    var tag = CryptoJS.AES.encrypt(tag, secret).toString();

    // return the encrypted object
    return tag;
}

// decrypt tag
export const decryptTag = async (tag, secret) => {
    var tag = CryptoJS.AES.decrypt(tag, secret).toString(CryptoJS.enc.Utf8);

    // return the decrypt object
    return tag;
}