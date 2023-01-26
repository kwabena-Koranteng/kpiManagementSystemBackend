const mongoose = require('mongoose');
const User = require('../models/user');
const BcryptService = require('./bcryptService');
const mongooseConnectionSettings = require('./mongooseConnectionSettings');
const UserSchema = require('../models/userSchema');

class UserService {
    constructor(){}

    async save(payload){
        const conn = await mongoose.connect("mongodb://kobbykoranteng:password1234@cluster0-shard-00-00.84itn.mongodb.net:27017,cluster0-shard-00-01.84itn.mongodb.net:27017,cluster0-shard-00-02.84itn.mongodb.net:27017/?ssl=true&replicaSet=atlas-d1tm3s-shard-0&authSource=admin&retryWrites=true", mongooseConnectionSettings);

        const model = conn.model('users', UserSchema);

        const user = this.buildUser(model, payload);
        const createdUser = await model.create(user);


       conn.disconnect();

        return createdUser;
    }
   
    async findByEmail(email){
        const conn = await mongoose.connect("mongodb://kobbykoranteng:password1234@cluster0-shard-00-00.84itn.mongodb.net:27017,cluster0-shard-00-01.84itn.mongodb.net:27017,cluster0-shard-00-02.84itn.mongodb.net:27017/?ssl=true&replicaSet=atlas-d1tm3s-shard-0&authSource=admin&retryWrites=true",mongooseConnectionSettings );

        const model = conn.model('users', UserSchema);

        const user = await model.findOne({'email': email}).exec();

        return user;
    }


    async findAllUsers(page,size){
        const conn = await mongoose.connect("mongodb://kobbykoranteng:password1234@cluster0-shard-00-00.84itn.mongodb.net:27017,cluster0-shard-00-01.84itn.mongodb.net:27017,cluster0-shard-00-02.84itn.mongodb.net:27017/?ssl=true&replicaSet=atlas-d1tm3s-shard-0&authSource=admin&retryWrites=true",mongooseConnectionSettings );

        const model = conn.model('users', UserSchema);

        const user = await model.paginate({},{page:page , limit:size});

        return user;
    }

    async findById(id){
        const conn = await mongoose.connect("mongodb://kobbykoranteng:password1234@cluster0-shard-00-00.84itn.mongodb.net:27017,cluster0-shard-00-01.84itn.mongodb.net:27017,cluster0-shard-00-02.84itn.mongodb.net:27017/?ssl=true&replicaSet=atlas-d1tm3s-shard-0&authSource=admin&retryWrites=true",mongooseConnectionSettings );

        const model = conn.model('users', UserSchema);

        const user = await model.findById({'_id': id}).exec();

        return user;
    }


    buildUser(model,payload){
        const userModel = new model();
        userModel._id = mongoose.Types.ObjectId();
        userModel.firstName = payload.firstName.trim().toLowerCase();
        userModel.lastName = payload.lastName.trim().toLowerCase();
        userModel.email = payload.email.trim().toLowerCase();
        userModel.enabled = payload.enabled;
        userModel.role = payload.role;
        userModel.enabled = payload.enabled;
        userModel.department =payload.department;

        const bcryptService = new BcryptService();

        const plainText = payload.password.toString();

        const hashpassword = bcryptService.encrypt(plainText);

        userModel.password = hashpassword;

        userModel.createdOn = new Date();

        userModel.updatedOn = new Date();

        return userModel;
    }

    async findByEmail(email){
        
        const conn = await mongoose.connect("mongodb://kobbykoranteng:password1234@cluster0-shard-00-00.84itn.mongodb.net:27017,cluster0-shard-00-01.84itn.mongodb.net:27017,cluster0-shard-00-02.84itn.mongodb.net:27017/?ssl=true&replicaSet=atlas-d1tm3s-shard-0&authSource=admin&retryWrites=true", mongooseConnectionSettings);

        const model = conn.model('users', UserSchema);

        const user = await model.findOne({ 'email' : email }).exec();

        //conn.disconnect();

        return user;
    }


    async createUserValidate(payload){
        const errors = new Array();
        const keys = Object.keys(payload);

        if(keys.length > 0){
            const email = (payload.hasOwnProperty('email')) ? payload.email : null;

            console.log("user payload to be validated : "+ email);

            const firstName = payload.firstName;
            const lastName = payload.lastName;
            const password = payload.password;
            const department = payload.department;
            const role = payload.role;

            if(firstName){
                if(firstName.trim() === "" && firstName.trim().length() === 0){
                    errors.push('invalid or empty First name passed')
                }
            }else{
                errors.push('invalid or missing First Name')
            }

            if(lastName){
                if(lastName.trim() === "" && lastName.trim().length() === 0){
                    errors.push('invalid or empty Last name passed')
                }
            }else{
                errors.push('invalid or missing Last Name')
            }


            if(email){
                if(email.trim() === "" && email.trim().length() === 0){
                    errors.push("invalid or empty email passed");
                } else {
                    const existingUser = await this.findByEmail(email);
                    
                    if(existingUser){
                        const id = existingUser.id
                   
                        if(id){
                            errors.push("The email has already been registered. Please log in");
                        }
                    }
               
                }
            } else {
                errors.push("missing e-mail");
            }

            if(password){
                if(password.trim() === "" && password.trim().length() === 0){
                    errors.push("invalid or empty password passed");
                }
            } else {
                errors.push("invalid or missing password");
            }

            if(department){
                if(department.trim() === "" && department.trim().length() === 0){
                    errors.push("invalid or empty department passed");
                } 
            } else {
                errors.push("invalid or missing department");
            }

            if(role){
                if(role.trim() === "" && role.trim().length() === 0){
                    errors.push("invalid or empty role passed");
                }
            } else {
                errors.push("invalid or missing role");
            }

        } else {
            errors.push("invalid or empty create user request passed");
        }
        return errors;
    }


    toUser(user){
        return(user) 
        ? new User(user._id,
        user.firstName,
        user.lastName,
        user.email,
        user.department,
        user.role,
        user.enabled,
        user.createdOn,
        user.updatedOn): new User();
    }


    groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
          // If an array already present for key, push it to the array. Else create an array and push the object
          (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
          );
          // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
          return result;
        }, {}); // empty object is the initial value for result object
      };
}



module.exports = UserService;

