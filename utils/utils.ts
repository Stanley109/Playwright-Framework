const  utils = {
    generateRandomCharacters: function (length: number=10){      //make the parameter optional and default it to 10 if no parameter has been passed
        const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result: string = '';
  
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
  
    return result;
    }
}

export default utils