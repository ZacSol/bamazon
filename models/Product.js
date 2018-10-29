module.exports=function(sequelize,DataTypes){
    const Products=sequelize.define("Products",{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        price:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        availQty:{
            type:DataTypes.INTEGER
        },
        imageUrl:{
            type:DataTypes.STRING,
        },
        department:{
            type:DataTypes.STRING,
            allowNull:false
        }
    }
    ,{timestamps:false}
    );


    return Products;
}