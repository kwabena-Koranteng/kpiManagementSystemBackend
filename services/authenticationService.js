const jwt = require('jsonwebtoken');

function authenticationService(req,res,next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null){
        return res.sendStatus(401);
    }


    const secret = "8c99041eef94716cc047aff7e002a427ea5a87bab9d96e7d2a429b4a5665e9e9";

    jwt.verify(token , secret , function(err,decoded){
        if(err){
            return res.sendStatus(403);
        }

        req.username = decoded.data;

        next();
    })

}

module.exports = authenticationService;