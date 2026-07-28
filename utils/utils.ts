const  utils = {
    generateRandomCharacters: function (length: number=10){      //make the parameter optional and default it to 10 if no parameter has been passed
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
  
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length); // example randomIndex = 0.99 * 62 = 61.38  -> 61 after round down math.floor
            result += characters.charAt(randomIndex);                          // gets '9' because it's the 61st char. remember that it starts at 0. 62 characters but index are 0~61
        }
  
    return result;
    }
}

export default utils