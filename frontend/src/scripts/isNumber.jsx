// return true if the given string is compromised of numbers, will return false if the string has any symbols or letters inside it
export const isNumber = (str) => {
    // check if the string is a number
    var isNum = !isNaN(str);
    // make sure the string does not contain any whitespace (isNaN does not return true for whitespace)
    var isWhitespace = /\s/.test(str);
    if (isNum && !isWhitespace)
      return true;
    return false;
}