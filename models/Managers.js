module.exports=function(sequelize,DataTypes){
    const Managers=sequelize.define("Managers",{
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{timestamps:false}
    );

    return Managers;
};