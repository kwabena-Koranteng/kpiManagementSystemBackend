class Response{
    constructor(status,message,totalCount,data){
        this.status =status;
        this.message = message;
        this.totalCount = totalCount;
        this.data = data;
    }

    toJSON(){
        return {
            status : this.status,
            message : this.message,
            totalCount : this.totalCount,
            data: this.data
        }
    }
}

module.exports = Response;