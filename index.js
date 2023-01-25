const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const IndexResponse = require('./domains/IndexResponse');
const userRoute = require('./routes/users');
const kpiRoute = require('./routes/kpi');

dotenv.config({path :'.env'});

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json({limit :'50mb'}));
app.use(express.urlencoded({extended : true}));


app.use(cors());



app.get("/api/v1" , (req,res)=>{
    const msg = new IndexResponse("Welcome to kpi-backend");

    res.header("Content-Type","application/json");
    res.status(200);
    res.json(msg);
});

app.use('/api/v1',userRoute);
app.use('/api/v1',kpiRoute);

app.listen(PORT, ()=>{
    console.log(`kpiservice started on port ${PORT}`);
})