module.exports=function(sequelize,DataTypes){
    const Department=sequelize.define("Product",{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        }
    })

    return Department;
}