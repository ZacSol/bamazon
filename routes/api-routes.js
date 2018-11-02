const db=require('../models');

module.exports=function(app){
    app.get('/api/products', function(req, res) {
        db.Products.findAll({})
        .then(function(data){
            // console.log(data);
            res.json(data);
        });
    });
    app.get('/api/cart',function(req,res){
        db.CartItems.findAll({})
        .then(function(cartData){
            res.json(cartData);
        });
    });
    app.post('/api/cart', function (req, res) {
        // res.send("did a thing");
        db.CartItems.create(req.body)
            .then(function (rows) {
                // console.log(rows);
                res.json({ success: true });
            })
            .catch(function (error) {
                res.json({ error: error })
            });
    });
};