const bcrypt = require('bcrypt');

class BcryptService {
    constructor(){
        this.saltRounds =10;
    }

    encrypt(plainText){
        const salt = bcrypt.genSaltSync(this.saltRounds);
        return bcrypt.hashSync(plainText,salt)
    }

    match(plainText,hash){
        return bcrypt.compareSync(plainText,hash)
    }
}

module.exports =BcryptService;