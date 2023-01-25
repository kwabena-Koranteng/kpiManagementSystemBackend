const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;


const UserSchema = new Schema({
    _id : objectId,
    firstName : String,
    lastName : String,
    email : String,
    password :String,
    department : String,
    role : String,
    enabled : Boolean,
    createdOn : {type : Date , default : Date.now},
    updatedOn :{type: Date , default : Date.now}

})

UserSchema.plugin(mongoosePaginate);


module.exports = UserSchema;