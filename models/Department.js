module.exports=function(sequelize,DataTypes){
    const Departments=sequelize.define("Departments",{
        departmentId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        departmentName:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false
        },
        overHeadCosts:{
            type:DataTypes.INTEGER
        }
    },{timestamps:false}
    );

    return Departments;
};