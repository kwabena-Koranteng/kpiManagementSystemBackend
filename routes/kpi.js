const express = require('express');
const Kpi = require('../models/kpi');
const KpiResponse = require('../domains/kpiResponse');
const kpiRoute = express.Router();
const KpiService = require('../services/kpiService');
const authenticationService = require('../services/authenticationService');
const UserService = require('../services/userService');
const e = require('express');


kpiRoute.post('/kpi/add',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    let payload = req.body;
    const data = new Array();

    const email = req.username;

    const kpiService = new KpiService();

    const userService = new UserService();

    const foundUser = await userService.findByEmail(email);

    if(foundUser){

        const kpiUser = await userService.findById(payload.id);

        if(kpiUser){

             payload ={...payload , createdBy:foundUser._id , user: kpiUser}
             payload['enabled'] =true;
             payload['status'] ="Pending";

             const validate = await kpiService.createdKpiValidate(payload);

             const errors =validate.length;

             if(errors == 0){

                const createdKpi = await kpiService.save(payload);

                console.log(createdKpi);
                if(createdKpi){
                    data.push(kpiService.toKpi(createdKpi[0]));
                    message="success";
                    totalCount=1;
                }
             }else{
                let counter = 0;
                val.forEach(error => {
                if(counter < (errors - 1)){
                    message += (counter + 1) + ". " + error + ", ";
                } else {
                    message += (counter + 1) + ". " + error + "";
                }
                counter++;
            });
            status = 400;
        }

        }else{
            message="Invalid user passed"
            status =404
        }

    }else{
        message ="user not found";
        status =400;
    }

    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);

});

kpiRoute.get('/kpi',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = (req.query.page) ? req.query.page : 1;
    let size = (req.query.size) ? req.query.size : 10;
    let totalCount = 0;

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

    // let payload = req.body;
    const data = new Array();

    const arraybefore = new Array();

    const kpiService = new KpiService();

    const userService = new UserService();

    const email = req.username;

    const findUser = await userService.findByEmail(email);

    if(findUser){

        const getKpis = await kpiService.getAllkpiByemail(findUser._id,page,size);

        if(findUser.role !== "user"){
            if(getKpis){
                totalCount = getKpis.total;
                const docs = getKpis.docs;
        
                if(docs.length >0){
                    docs.forEach((i,x)=>{
                        arraybefore.push(i)
                    })
                console.log(groupBy(arraybefore, '{user.department}'));

                //  data.push(result);
                    message ="success";
                }else{
                    message ="No Kpi(s) found";
                    status =400;
                }
             
              
            }else{
                message ="No Kpi(s) found";
                status =400;
            }

        }else{

            if(getKpis){
                totalCount = getKpis.total;
                const docs = getKpis.docs;
        
                if(docs.length >0){
                    docs.forEach((i,x)=>{
                        data.push(kpiService.toKpi(i))
                    })
                    message ="success";
                }else{
                    message ="No Kpi(s) found";
                    status =400;
                }
             
              
            }else{
                message ="No Kpi(s) found";
                status =400;
            }
        }


       
    }


    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);

})


kpiRoute.get('/kpi/:id',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    const id = req.params.id;

    const data = new Array();


    if(id){
        const kpiService = new KpiService();
        const kpi = await kpiService.findById(id);

        if(kpi){
            data.push(kpiService.toKpi(kpi));
            totalCount =data.length
            message = (totalCount > 0) ? "success" : "order with id : "+ id + " is not found.";
            status = (totalCount > 0) ? 200 : 400;
        }else{
            message ="No Kpi(s) found";
            status =400;
        }
    }else{
        message ="invalid kpi id passed";
        status =400;
    }

    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);
})


kpiRoute.patch('/update/kpi/:id',authenticationService,async(req,res)=>{
 
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    let payload = req.body;
    const data = new Array();

    const userService = new UserService();

    const username = req.username;
    
    const id = req.params.id;

    const verifyUser = await userService.findByEmail(username);

    if(verifyUser.role !== "user"){

        const kpiUser = await userService.findById(payload.id);

        payload ={...payload , createdBy:verifyUser._id , user: kpiUser}
        payload['enabled'] =true;
        payload['status'] ="Pending";
        
        const kpiService = new KpiService();

        const validate = await kpiService.createdKpiValidate(payload);

        const errors =  validate.length;

        if(errors == 0){
            const updatedKpi = await kpiService.findByIdAndUpdate(id,payload);

            if(updatedKpi){
    
                data.push(kpiService.toKpi(updatedKpi));
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

   
   
    }else{
        message ="You do not have permission"
        status =404
    }


    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);

})


kpiRoute.delete('/kpi/:id',authenticationService,async(req,res)=>{
 
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    let payload = req.body;
    const data = new Array();

    const id = req.params.id;

    const userService = new UserService();

    const username = req.username;

    const verifyUser = await userService.findByEmail(username);

    if(verifyUser.role !== "user"){

        const kpiService = new KpiService();
        
        const deletedkpi = await kpiService.findByIdAndDelete(id);

        if(deletedkpi){
                data.push(kpiService.toKpi(deletedkpi));
                message ="success";
                totalCount =1;
            }
    
   
    }else{
        message="You do not have permission";
        status =404;
    }

    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);

})

kpiRoute.put('/comment/:id',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    const kpiService = new KpiService();

    const payload = req.body;

    const id = req.params.id;

    const data = new Array();

    const addComment = await kpiService.findByIdandAddComment(id,payload.comment);

    if(addComment){
        data.push(kpiService.toKpi(addComment))
        message ="success";
        totalCount =1
        
    }else{
        message="Unable to add comment"
        status=400
    }

    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);
})


kpiRoute.put('/update/status',authenticationService,async(req,res)=>{
    let status = 200;
    let message = "";
    let page = 0;
    let size = 0;
    let totalCount = 0;

    const kpiService = new KpiService();

    const payload = req.body;

    const data = new Array();

    const addStatus = await kpiService.findByIdandupdateStatus(payload.id,payload.status);

    if(addStatus){
        data.push(kpiService.toKpi(addStatus))
        message ="success";
        totalCount =1
        
    }else{
        message="Unable to add comment"
        status=400
    }

    const kpiResponse = new KpiResponse(status,message,page,size,totalCount,data);

    res.header("Content-Type" , "application/json");
    res.status(status);
    res.json(kpiResponse);
});








module.exports = kpiRoute;