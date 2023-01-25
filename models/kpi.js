class Kpi{
    constructor(id, title,details,type,timelines,comments,user,createdBy,status,enabled,createdOn,updatedOn){
        this.id = id;
        this.title = title;
        this.details = details;
        this.type = type;
        this.timelines = timelines;
        this.comments = comments;
        this.user = user;
        this.createdBy = createdBy;
        this.status =status;
        this.enabled =enabled;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
    }

    toJSON(){
        return {
            id: this.id,
            title: this.title,
            details: this.details,
            type: this.type,
            timelines: this.timelines,
            comments: this.comments,
            user : this.user,
            createdby : this.createdby,
            status:this.status,
            enabled: this.enabled,
            createdOn : this.createdOn,
            updatedOn : this.updatedOn

        }
    }
}

module.exports =Kpi