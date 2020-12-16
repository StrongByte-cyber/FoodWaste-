module.exports=(sequelize,DateType)=>{
    return sequelize.define('utilizator',{
        
        iduser:{
            type:DateType.STRING,
            allowNull:false
        },
        nume:{
            type:DateType.STRING,
            allowNull:false
        },
        prenume:{
            type:DateType.STRING,
            allowNull:false
        },
        email:{
            type:DateType.STRING, 
            validate:{
                isEmail: true
            }
           
        },
        data_logare:{
            type:DateType.DATEONLY
            //defaultValues: DataType.NOW
        },
        tip_utilizator:{
            type:DateType.ENUM('vegetarian','carnivor','lactovegetarian','lactoovovegetarian','apivegetarian'),
            allowNull:false

        }
    })
}