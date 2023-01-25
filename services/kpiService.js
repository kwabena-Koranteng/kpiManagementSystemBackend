const mongoose = require('mongoose');
const kpiSchema = require('../models/kpiSchema');
const mongooseConnectionSettings = require('./mongooseConnectionSettings');
const User = require('../models/user');
const Kpi = require('../models/kpi');
const UserService = require('../services/userService');

const userService = new UserService();

class kpiService{

    constructor(){}

    async save(payload){
        const conn = await mongoose.connect(process.env.MONGO_URL, mongooseConnectionSettings);

        const model = conn.model('kpi',kpiSchema);

        const kpi = this.buildKpi(model,payload);

        const createdKpi = await model.create(kpi);

        const foundKpi = await model.find({'_id': createdKpi._id}).populate('user');

        return foundKpi;
    }


    async findById(id){
        if(id){
            const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

            const model = conn.model('kpi',kpiSchema);

            const kpi = await model.findById(id).populate('user');

            return kpi;
        }

        return null;
    }

    async findByIdandAddComment(id,comment){

        if(id && comment){

            const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

            const model = conn.model('kpi',kpiSchema);

            const kpi = await model.findOneAndUpdate({'_id':id},{$set:{comments:comment}},{new:true}).populate('user');

            return kpi;
        }
    }


    async findByIdandupdateStatus(id,status){

        if(id && status){

            const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

            const model = conn.model('kpi',kpiSchema);

            const kpi = await model.findOneAndUpdate({'_id':id},{$set:{status:status}},{new:true}).populate('user');

            return kpi;
        }
    }


    async findAllByUser(id){

        const conn = await mongoose.connect(process.env.MONGO_URL, mongooseConnectionSettings);

        const model = conn.model('kpi',kpiSchema);

        const pagedResults = await model.find({'user':id}).populate('user');

        return pagedResults
    }

    async findByIdAndDelete(id){

        const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

        const model = conn.model('kpi',kpiSchema);

        const kpi = await model.findByIdAndUpdate({'_id':id},{$set:{enabled:false}},{new:true}).populate('user');

        return kpi;


    }

    async getAllkpiByemail(email,page,size){
        const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

        const model = conn.model('kpi',kpiSchema);

        const kpi = await model.paginate({'user':email , 'enabled':true},{page:page,limit:size, populate: ['user']});

        return kpi;
    }


    async findByIdAndUpdate(id,payload){

        let updatedKpi = null;

        const conn = await mongoose.connect(process.env.MONGO_URL , mongooseConnectionSettings);

        const kpiModel = conn.model('kpi',kpiSchema);

        const kpiDetails = await kpiModel.findById(id);

        if(kpiDetails){
            
            const kpi = this.updateKpi(kpiModel,payload);

            await kpiModel.findByIdAndUpdate({'_id':kpiDetails._id}, kpi);

            updatedKpi = await kpiModel.findById(id).populate('user').exec();

        }

        return updatedKpi;
    }

    buildKpi(model,payload){

        const kpiModel = new model();
        kpiModel._id = mongoose.Types.ObjectId();
        kpiModel.title =payload.title,
        kpiModel.details =payload.details,
        kpiModel.type =payload.type,
        kpiModel.timelines = payload.timelines,
        kpiModel.comments = payload.comments,
        kpiModel.user =payload.user,
        kpiModel.enabled =payload.enabled,
        kpiModel.status =payload.status,
        kpiModel.createdBy = payload.createdBy,
        kpiModel.createdOn = new Date(),
        kpiModel.updatedOn = new Date()

        return kpiModel
    }

    updateKpi(model,payload){
        const kpiModel = new model();
        kpiModel.title =payload.title,
        kpiModel.details =payload.details,
        kpiModel.type =payload.type,
        kpiModel.timelines = payload.timelines,
        kpiModel.comments = payload.comments

        kpiModel.updatedOn = new Date()

        return kpiModel;
    }

    async createdKpiValidate(payload){
        const errors = new Array();
        const keys = Object.keys(payload);

        if(keys.length > 0){

            const title = payload.title;
            const details = payload.details;
            const type = payload.type;
            const timelines = payload.timelines;
            const user = payload.user;
            // const createdBy = payload.createdBy;



            if(title){
                if(title.trim() === "" && title.trim().length() === 0){
                    errors.push('invalid or empty title passed')
                }
            }else{
                errors.push('invalid or missing title')
            }

            if(details){
                if(details.trim() === "" && details.trim().length() === 0){
                    errors.push('invalid or empty details passed')
                }
            }else{
                errors.push('invalid or missing details')
            }

            if(type){
                if(type.trim() === "" && type.trim().length() === 0){
                    errors.push('invalid or empty type passed')
                }
            }else{
                errors.push('invalid or missing type')
            }

            if(timelines){
                if(timelines.trim() === "" && timelines.trim().length() === 0){
                    errors.push('invalid or empty timelines passed')
                }
            }else{
                errors.push('invalid or missing timelines')
            }

            if(user){
                if(user === ""){
                    errors.push('invalid or empty user passed')
                }
            }else{
                errors.push('invalid or missing user')
            }

        }else{
            errors.push('invalid or empty create kpi request passsed');
        }

return errors;  

    }

    toKpi(kpi){
        return (kpi) ? 
        new Kpi(kpi._id,
            kpi.title,
            kpi.details,
            kpi.type,
            kpi.timelines,
            kpi.comments,
            userService.toUser(kpi.user)
            ): new Kpi();
    }
}


module.exports = kpiService;