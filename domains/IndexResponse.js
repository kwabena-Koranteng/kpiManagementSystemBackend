class IndexResponse {
    constructor(message){
        this.message = message;
    }

    toJSON(){
        return {
            message : this.message
        }
    }
}

module.exports = IndexResponse;