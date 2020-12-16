module.exports=(sequelize,DateType)=>{
    return sequelize.define('produs',{
        
        nume:{
            type:DateType.STRING,
            allowNull:false
        },
        nume_proprietar:{
            type: DateType.STRING,
            allowNull:false
        },
        prenume_proprietar:{
            type: DateType.STRING,
            allowNull:false
        },
        data_expirare:{
            type: DateType.DATEONLY,
            allowNull:false
        },
    })
}