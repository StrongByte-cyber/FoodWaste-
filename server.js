const express=require('express')
const bodyParser=require('body-parser')
const app=express()
const pool=require('./pool')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//Pagina produse
//Selectie produse
app.get('/globallist',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("SELECT * from produse",(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(rows);
        })
    })
})
//Selectie pe campuri
app.get('/globallist/:iduser',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("SELECT * from produse WHERE iduser=?",[req.params.iduser],(err,rows)=>{
            if(err){ throw err }
            
            connection.release()
            res.send(rows);
            
        })
    })
})

app.get('/globallist/:nume_proprietar',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("SELECT * from produse WHERE nume_proprietar=?",[req.params.nume_proprietar],(err,rows)=>{
            if(err){ throw err }
            
            connection.release()
            res.send(rows);
            
        })
    })
})
app.put('/globallist',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("UPDATE produse SET iduser=? " ,[content.iduser],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume_proprietar]}, modificarile tale au fost realizate cu succes`)
        })
    })
})

//Stergere
app.delete('/mylist/:iduser',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("DELETE from produse WHERE iduser=?",[req.params.iduser],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[req.params.nume_proprietar]}, produsul tau a fost sters`)
        })
    })
})
app.delete('/mylist/:nume',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("DELETE from produse WHERE nume=?",[req.params.nume],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[req.params.nume_proprietar]}, produsul tau a fost sters`)
        })
    })
})
app.delete('/mylist/:nume_proprietar',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("DELETE from produse WHERE nume_proprietar=?",[req.params.nume_proprietar],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[req.params.nume_proprietar]}, produsul tau a fost sters`)
        })
    })
})

//Adaugare 
app.post('/mylist',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("INSERT INTO produse(nume,nume_proprietar,data_cumparare,data_expirare) VALUES (?,?,?,?)",[content.nume,content.nume_proprietar,content.data_cumparare,content.data_expirare],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume_proprietar]}, ti-am introdus produsul`)
        })
    })
})

// app.put('/globallist/:nume_proprietar',(req,res)=>{
//     pool.getConnection((err,connection)=>{
//         if(err) {throw err}
//         const content=req.body
//         connection.query("UPDATE produse SET nume=?, data_cumparare=?, data_expirare=? WHERE nume_proprietar=?",[content.nume_proprietar],(err,rows)=>{
//             if(err){ throw err }
//             connection.release()
//             res.send(`${[content.nume_proprietar]}, modificarile tale au fost realizate cu succes`)
//         })
//     })
// })
////Lista toti useri
app.post('/users',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("INSERT INTO utilizatori(iduser,nume,prenume,email,data_logare,tip_utilizator) VALUES (?,?,?,?,?)",[content.iduser,content.nume,content.prenume,content.email,content.data_logare,content.tip_utilizator],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, ti-am introdus produsul`)
        })
    })
})

app.post('/users/:nume',(req,res)=>{
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
////PAGINA GRUPA VEGANI
app.get('/users/veganusers',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err){throw err}
        connection.query("SELECT * from utilizatori where tip_utilizator='vegetarian'",(err,rows)=>{
            if(err){throw err}
            connection.release();
            res.send(rows);
        })
    })
})

app.delete('/users/veganusers/:iduser',(req,res)=>{
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


app.put('/users/veganusers/',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("UPDATE produse SET iduser=?",[content.iduser],(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, modificarile tale au fost realizate cu succes`)
        })
    })
})
//Gestionare lista personala
app.get("/mylist",(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        connection.query("SELECT p.nume_proprietar,p.nume,p.data_cumparare,p.data_expirare from produse p JOIN utilizatori u where p.iduser=u.iduser",(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(rows)
            
        })
    })})
app.delete('/mylist',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) {throw err}
        const content=req.body
        connection.query("DELETE produse,utilizatori from produse JOIN utilizatori on produse.iduser=utilizatori.iduser",(err,rows)=>{
            if(err){ throw err }
            connection.release()
            res.send(`${[content.nume]}, produsul tau a fost sters`)
        })
    })
})
// app.post('/mylist',(req,res)=>{
//     pool.getConnection((err,connection)=>{
//         if(err) {throw err}
//         const content=req.body
//         connection.query("INSERT INTO produse(nume,nume_proprietar,data_cumparare,data_expirare) SELECT * from produse JOIN utilizatori on produse.iduser=utilizatori.iduser",(err,rows)=>{
//             if(err){ throw err }
//             connection.release()
//             res.send(`${[content.nume]}, produsul tau a fost sters`)
//         })
//     })
// })
app.listen(5000)

