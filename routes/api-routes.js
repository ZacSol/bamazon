const db=require('../models');

module.exports=function(app){
    app.get('/api/products', function(req, res) {
        db.Products.findAll({})
        .then(function(data){
            // console.log(data);
            res.json(data);
        })
    });

};