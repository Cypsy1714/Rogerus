
var sikeyim = await CryptoJS.AES.encrypt('test', 'test');
console.log(sikeyim)

var decryptedPKey = await decryptPKey(encryptedPKey, tag+pin);
console.log(decryptedPKey);

const utf8EncodeText = new TextEncoder();

const str = 'this is a test';

const byteArray = utf8EncodeText.encode(str);
// sign
rsa.encrypt(
    byteArray,
    publicKey,
    'SHA-256', // optional, for OAEP. default is 'SHA-256'
    ).then( (encrypted) => {
    // now you get an encrypted message in Uint8Array
    console.log(encrypted);
    const strAgain1 = new TextDecoder().decode(encrypted);
    console.log(strAgain1);
    return rsa.decrypt(
        encrypted,
        privateKey,
        'SHA-256', // optional, for OAEP. default is 'SHA-256'
    );
}).then( (decrypted) => {
    // now you get the decrypted message
    console.log(decrypted);
    const strAgain = new TextDecoder().decode(decrypted);
    console.log(strAgain);
});