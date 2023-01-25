class KpiResponse {
    constructor(status, message, page, size, totalCount, data){
        this.status = status;
        this.message = message;
        this.page = page;
        this.size = size;
        this.totalCount = totalCount;
        this.data = data;
    }

    toJSON(){
        return {
            status : this.status,
            message : this.message,
            page : this.page,
            size : this.size,
            totalCount : this.totalCount,
            data : this.data
        };
    }
}

module.exports = KpiResponse;