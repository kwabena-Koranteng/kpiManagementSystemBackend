const NodeRsaService = require('./nodeRsaService');
const UserService =require('./userService');
const jwt = require('jsonwebtoken');
const TokenResponse = require('../domains/tokenResponse');
const BcryptService = require('./bcryptService');

class TokenService {
    constructor(payload){
        this.payload =payload;
    }

    async getToken(){

        let token = null;

        const encryptedPayload = this.payload;

        const nodeRsaService = new NodeRsaService();

        const userService = new UserService();

        const privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAKKJ/W7lFNLK/QH6rHRI28WNCM/CdJCkXFIxFDewx9hn1TT6+vQYtkO7jBd507VYzFtM0YTMMYErX47CFHEm0nEXwlkRxqhWlqFV8V+Sf11/6bnO6w7JKkn7FyhNE8iFCrpkV5Pf+OV4KVPqrQ5UmqbhGz915LKb1qBoxYr1yTSbAgMBAAECgYAceqcgNh1W7eA055It8dIoJBUGKiE4csQGVrkfJOdvQIo39T3hZS8SYRsjxeHVZZCw8p3Hceu+oTXmEpV4WgAHLwKGfpZbduImM+UVDQIyuiwG0E7Cd/8Ngz1U/DtPEET5b7KlMk3jilskPf1mjwokVE2TcMB3uOusbV5pzi/AsQJBAN/hmWi1xMRSPSTbIMP15eKs5o5s6fTiTvFv9wezN9nxEZHQcxIFEgo5AychhmfF3yaYVqHFMBFxp9ViNC9oWIkCQQC523+V39GvtCBIpSZknQwPf7qy77xjWfAm3IldF14up76cWh6IGp7goBERRO+81thk+Nl7r37DqI7hOCbljhMDAkEAx05ISv5egEOSKUhmf+1dzRENY0e0c4wwqSF68kDq/LtuX7gJaMZYy/77Po/K3oE56lr97J/l7fGXbxAw0u96uQJAA2OQOQBix2xmZky0nYMLlEDE+7xJWBpsuZit3IevjPQ8EofGJL8vhHMGvKTgJjZYrcan2IyDqDerm0m109u6VwJARAb6LcQxTDox+2BsJ7JSGnm1vo7BjGi9iJKNaj/S4HsD6sE6wCHM8ebuHnzrzLe4/hcWS5y6ve0Sqen5WX3wkA==";

        // var value = null;

        // try{
        //     value = nodeRsaService.decrypt(encryptedPayload, privateKey);

        // }catch(err){
        //     console.log("error decryptng authentication request payload. message : "+ err.toString());
        //     token = new TokenResponse(500, "error occurred while decrypting user credentials. message: "+ err.toString(),"","",0);

        // }

        // const isValue = (value== null);
        // console.log("get token request processing : is decrypted value present : "+ (value != null));

        // if(!isValue){
            const payloadAsObject = encryptedPayload;
            
            const username = (payloadAsObject.hasOwnProperty('email')) ? payloadAsObject.email : null;
            const password = (payloadAsObject.hasOwnProperty('password')) ? payloadAsObject.password : null;

            if(username && password){
                const userService = new UserService();
                const currentUser = await userService.findByEmail(username);

                console.log("get token request processing : is user with username : "+ username +" found present : "+ (currentUser != null));
               
                if(currentUser){
                    const keys = Object.keys(currentUser);
                    if(keys.length > 0){

                        const bcryptService = new BcryptService();
                        let isMatch = false;
                        let isDefault =false;

                        try {
                            isMatch = bcryptService.match(password, currentUser.password);
                        } catch(err){
                            console.log("error occurred while validating user : "+ email + ". message : "+ err.toString());
                        };

                        try{
                            isDefault = bcryptService.match("password1",currentUser.password)

                        }catch(err){
                            console.log('errror' + err)
                        }

                        if(isMatch){
                            //check if user is enabled
                            const isEnabled = currentUser.enabled;
                            const role = currentUser.role;
                            
                            
                            if(isEnabled){
                                //generate valid JSON web token. 
                                const key = "8c99041eef94716cc047aff7e002a427ea5a87bab9d96e7d2a429b4a5665e9e9";

                                const expiresIn = Math.floor(Date.now() / 1000) + (60 * 60);

                            
                                const tokenKey = jwt.sign({
                                    data : currentUser.email, 
                                    iat : Math.floor(Date.now() / 1000) - 30, 
                                    exp: expiresIn
                                }, key);

                                token = new TokenResponse(200, "success", username, tokenKey, expiresIn, role,isDefault,userService.toUser(currentUser));
                            } else {
                                token = new TokenResponse(400, "user is currently disabled", username, "", 0);
                            } 

                        } else {
                            token = new TokenResponse(400, "invalid email or password", username, "", 0);
                        }
                    } else {
                        token = new TokenResponse(400, "invalid email or password", username, "", 0,0);
                    }
                } else {
                    token = new TokenResponse(400, "invalid email or password", username, "", 0,0);
                }
            }
            else {
                 token = new TokenResponse(400, "invalid email or password", "", "", 0);
                 }                 
        // } else {
        //     token = new TokenResponse(400, "invalid email or password", "", "", 0);
        // }

        return token;
    }
}


module.exports = TokenService;