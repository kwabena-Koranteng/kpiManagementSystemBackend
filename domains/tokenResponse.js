class TokenResponse {
    constructor(status, message, email, token, expires, role,isDefault){
        this.status = status;
        this.message = message;
        this.email = email;
        this.token = token;
        this.expires = expires;
        this.role = role;
        this.isDefault =isDefault;
    }

    toJSON(){
        return {
            status : this.status,
            message : this.message,
            email : this.email,
            token : this.token,
            expires : this.expires,
            role : this.role,
            isDefault :this.isDefault
        }
    }
}

module.exports = TokenResponse;