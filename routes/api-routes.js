const db=require('../models');
const Sequelize=require('sequelize');
const Op=Sequelize.Op;

module.exports=function(app){
    // used to get all products for home page
    app.get('/api/products', function(req, res) {
        db.Products.findAll({})
        .then(function(data){
            // console.log(data);
            res.json(data);
        });
    });

    app.get('/api/products/low',function(req,res){
        db.Products.findAll({
            where:{
                availQty:{
                    [Op.lt]:5,
                }
            }
        }).then(function(data){
            res.json(data);
        });
    });

    // used to grab any items previously added to the cartDb  
    app.get('/api/cart',function(req,res){
        db.CartItems.findAll({})
        .then(function(cartData){
            res.json(cartData);
        });
    });

    // req itemId and res availQty
    app.get('/api/cart/checkout', function (req, res) {
        console.log(req);
        let idArr=[1,2,3];
        db.Products.findAll({
            where: {
                id: {
                    [Op.or]:idArr
                    // [Op.or]:
                }
            }
        })
        .then(function(data){
            // let returnData={
            //     productId:data.id,
            //     name:data.name,
            //     availQty:data.availQty
            // }
            // res.json(returnData);
            res.json(data);
        });
    });

    // adds item to the productDb
    app.post('/api/manager/products', function (req, res) {
        db.Products.create(req.body)
            .then(function (rows) {
                res.json({ success: true });
            })
            .catch(function (error) {
                res.json({ error: error });
            });
    });

    // adds item to the cartDb
    app.post('/api/cart', function (req, res) {
        // res.send("did a thing");
        // console.log(req.body);
        db.CartItems.create(req.body)
            .then(function (rows) {
                // console.log(rows);
                res.json({ success: true });
            })
            .catch(function (error) {
                res.json({ error: error })
            });
    });

    // manager is able to change available quantity
    app.put('/api/manager/:id',function(req,res){
        db.Products.update(req.body,{
            where:{
                id:req.params.id
            }
        }).then(function(response){
            res.json({success:true});
        }).catch(function(err){
            res.json({error:err});
        });
    });

    // updates cartDb buying quantity
    app.put('/api/cart/:id', function (req, res) {
        db.CartItems.update(req.body,
            { where: { productId: req.params.id } }
        ).then(function (response) {
            res.json({ success: true });
        }).catch(function (err) {
            res.json({ error: err });
        });
    });

    // updates productDb quantity after purchase
    app.put('/api/cart/checkout/:id',function(req,res){
        db.Products.update(req.body,{
            where:{id:req.params.id}
        }).then(function(response){
            res.json({success:true});
        }).catch(function(err){
            res.json({error:err});
        });
    });

    // manager is able to remove products from sale
    app.delete("/api/manager/:id",function(req,res){
        db.Products.destroy({
            where:{
                id:req.params.id
            }
        }).then(function(response){
            res.json({success:true});
        }).catch(function(err){
            res.json({error:err});
        });
    });

    // removes item from cartDb
    app.delete('/api/cart/:id', function (req, res) {
        db.CartItems.destroy({
            where: { productId: req.params.id }
        }).then(function () {
            res.json({ success: true });
        }).catch(function (error) {
            res.json({ error: error });
        });
    });
};