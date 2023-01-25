const mongooseConnectionSettings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true, 
    connectTimeoutMS: 30000
}
module.exports = mongooseConnectionSettings;