const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId
const user = require('./userSchema');
const User = mongoose.model('user', user);

const kpiSchema = new Schema({
    id : objectId,
    title : String,
    details : String ,
    type :String ,
    timelines : String,
    comments : [String],
    user : {type : Schema.Types.ObjectId , ref : 'user'},
    createdBy : String,
    status :String,
    enabled :Boolean,
    createdOn : {type : Date , default : Date.now},
    updatedOn : {type : Date , default : Date.now}

});


kpiSchema.plugin(mongoosePaginate);

module.exports = kpiSchema;