const express = require('express');
const TokenResponse = require('../domains/tokenResponse');
const UserResponse = require('../domains/userResponse');
const UserService = require('../services/userService');

const userRoute = express.Router();
const TokenService = require('../services/tokenService');
const BcryptService = require('../services/bcryptService');
const authenticationService = require('../services/authenticationService');


userRoute.post('/users',async(req,res)=>{
    let status = 200;
    let message = "";
    let page =0;
    let size =0;
    let totalCount =0;

    let payload = req.body;

    console.log(payload);

    const users = new Array();

    const userService = new UserService();

    const validate = await userService.createUserValidate(payload);
    
    const errors = validate.length;

    if(errors == 0){
        payload['enabled']= true;

        const created = await userService.save(payload);

        if(created){
            users.push(userService.toUser(created));
            message ="success";
            totalCount =1;
        }
    }else{
        let counter = 0;
        validate.forEach(error => {
            if(counter < (errors - 1)){
                message += (counter + 1) + ". " + error + ", ";
            } else {
                message += (counter + 1) + ". " + error + "";
            }
            counter++;
        });
        status = 400;
    }


    const userResponse = new UserResponse(status, message , page,size , totalCount , users);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(userResponse);
})



userRoute.post('/user/token', async(req,res)=>{
    let status = 200;
    let message = "";
    let email = "";
    let token = "";
    let expires = "";

    const payload = req.body;

    const keys = Object.keys(payload);
    const payloadKeys = keys.length;

    if(payloadKeys == 0){
        message ="invalid or empty payload passed";
        status =400;
    }

    let tokenResponse = new TokenResponse(status, message,email,token ,expires);

    if(payload){
        const tokenService = new TokenService(payload);
        tokenResponse = await tokenService.getToken();
        status = tokenResponse.status;

    }

    res.header("Content-Type","application/json");
    res.status(status);
    res.json(tokenResponse);
});

//get userinfo


userRoute.get('/user',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page =0;
    let size =0;
    let totalCount =0;

    const email = req.username;

    const userService  = new UserService();

    const data = new Array();

    if(email){

        const foundUser = await userService.findByEmail(email);

        if(foundUser){
            data.push(userService.toUser(foundUser));
            message ="success";
            totalCount=1
        }else{
            message ="invalid user"
            status =400
        }
    
    }

    const userResponse = new UserResponse(status, message , page,size , totalCount , data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(userResponse);

})


userRoute.get('/users',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = (req.query.page) ? req.query.page : 1;
    let size = (req.query.size) ? req.query.size : 10;
    let totalCount =0;

    const email = req.username;

    const userService  = new UserService();

    let data = null;

    const arraybefore = new Array();


    const foundUser = await userService.findByEmail(email);

    if(foundUser.role !== "user"){
        if(email){

            const foundUsers = await userService.findAllUsers(page,size);
    
            if(foundUsers){
               
                totalCount = foundUsers.total;
                const docs = foundUsers.docs;
    
                if(docs.length > 0){
                    docs.forEach((i,x)=>{
                        arraybefore.push(userService.toUser(i))
                    })
                data = userService.groupBy(arraybefore,'department')
    
                }
                message ="success";
            }else{
                message ="invalid user"
                status =400
            }
        
        }
      

    }else{
        message ="You do not have permission";
        status =404;
    }

   
    const userResponse = new UserResponse(status, message , page,size , totalCount , data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(userResponse);

})


userRoute.post('/resetpassword',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    const email = req.username;

    const payload = req.body;

    const data  = new Array();

    const userService = new UserService();

    const userInfo =  await userService.findByEmailAndUpdatePassword(email,payload.password);

    if(userInfo){

        data.push(userService.toUser(userInfo));
        message ="success";
        totalCount =1;
    }else{
        message ="unable to update password";
        status =404;
    }

    const userResponse = new UserResponse(status, message , page,size , totalCount , data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(userResponse);

})


module.exports =userRoute