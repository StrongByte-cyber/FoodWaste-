const express=require('express')
const bodyParser=require('body-parser')
const veganapp=express()
const pool=require('./pool')
veganapp.use(bodyParser.json())
veganapp.use(bodyParser.urlencoded({extended:true}))
veganapp.get('/veganusers',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){throw err}
        connection.query("SELECT * from utilizatori",(err,rows)=>{
            if(err){throw err}
            connection.release();
            res.send(rows);
        })
    })
})
veganapp.post('/veganusers/:nume',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){throw err}
        const content=req.body
        connection.query("SELECT * from utilizatori where nume=?",[content.nume],(err,rows)=>{
            if(err){throw err}
            connection.release();
            res.send(rows);
        })
    })
})

veganapp.delete('/veganusers/:iduser',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body;
        connection.query("DELETE from utilizatori WHERE iduser=?",[content.iduser],(err)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, produsul tau a fost sters`)
        })
    })
})


veganapp.post('/veganusers',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("INSERT INTO utilizatori(nume) VALUES (?)",[content.nume],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, ti-am introdus produsul`)
        })
    })
})
veganapp.put('/veganusers',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("UPDATE utilizatori SET nume=?",[content.nume],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, modificarile tale au fost realizate cu succes`)
        })
    })
})
module.exports=veganapp