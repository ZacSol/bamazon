const path=require('path');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
    app.get('/manager',function(req,res){
        res.sendFile(path.join(__dirname,"../public/manager.html"));
    });
    app.get("/login",function(req,res){
        res.sendFile(path.join(__dirname,'../public/login.html'));
    });

    
};