class User {
    constructor(id,firstName , lastName , email,department,role,enabled,createdOn, updatedOn){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.department = department;
        this.role = role;
        this.enabled = enabled;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
    }

    toJSON(){
        return {
            id: this.id,
            firstName : this.firstName,
            lastName : this.lastName,
            email : this.email,
            role : this.role,
            enabled: this.enabled,
            department : this.department,
            createdOn : this.createdOn,
            updatedOn : this.updatedOn
        }
    }
}


module.exports =User;