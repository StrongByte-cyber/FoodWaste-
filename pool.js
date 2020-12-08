const mysql=require('mysql')
//MySQL code
const pool=mysql.createPool({
    port:3306,
    host:'localhost',
    user:'root',
    password:'',
    database:'strongbyte',
    connectionLimit:10,
})

module.exports=pool