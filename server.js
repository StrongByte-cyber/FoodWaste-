const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const Sequelize=require('sequelize')
require('dotenv').config()
app.use(express.json())
app.use(bodyParser.json())
const sequelize=new Sequelize(process.env.DATABASE,process.env.USER,'',{
    host:process.env.HOST,
    dialect:"mysql",
    define:{
        timestamps:false
    }
})

const Produs=require('./produs')(sequelize,Sequelize)
const Utilizator=require('./utilizator')(sequelize,Sequelize);

Utilizator.belongsToMany(Produs, { through: "user_product" });
Produs.belongsToMany(Utilizator, { through: "product_user" });

//Creare cont
app.post('/register',async (req,res,next)=>{
    try{
        
        Utilizator.create(req.body)
        res.status(201).json({message:`${req.body.nume}, ai fost inregistrat`})
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
//Creare cont

app.get('/myaccount/:id',async (req,res,next)=>{
    try{
        let user=await Utilizator.findByPk(req.params.id, {include:[Produs]})
        if(user){
            res.status(201).json(user)
        }
        else{
            res.status(404).json({message:"not found"})
        }
        
    }catch(err){
        next(err)
    }
})

//Gestionare lista personala

app.get('myaccount/:uid/mylist',async (req,res,next)=>{
    try{
        let user=await Utilizator.findByPk(req.params.uid)
        if(user){
                let produs=await Produs.findAll({where:{id:req.params.uid}})
                res.status(201).json(produs)            
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})
app.post('myaccount/:bid/mylist', async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.bid,{include:[Produs]})
        if(user){
            const produs=new Produs(req.body)
            produs.id=user.id
            await produs.save()
            res.status(201).json(produs)            
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})

app.delete('myaccount/:id/mylist', async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.id)
        if(user){
            const produs=await Produs.findAll()
            await produs.destroy()
            res.status(201).json({message:"all products were deleted"})            
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})
app.get('myaccount/:id/mylist/:pid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.id)
        if(user){
                const produs=await Produs.findByPk(req.params.pid,{id:req.params.pid})
                res.status(201).json(produs)            
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})

app.put('myaccount/:id/mylist/:pid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.id)
        if(user){
            const produs=await Produs.findByPk(req.params.pid,{id:req.params.pid})
            produs.nume=req.body.nume;
            produs.nume_proprietar=req.body.nume_proprietar
            produs.prenume_proprietar=req.body.prenume_proprietar
            produs.data_expirare=req.body.data_expirare
            await produs.save()
            req.status(201).json(produs)
        }
    }catch(err){
        next(err)
    }
})
app.delete('myaccount/:id/mylist/:pid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.id)
        if(user){
                const produs=await Produs.findByPk(req.params.pid)
                await produs.destroy()
                res.status(201).json(produs)            
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})


app.use((err,req,res,next)=>{
    console.warn(err);
    res.status(505).json({message:"eroare"})
})
///////////////////////////
//VegetarianGroup
app.get('/vegetariangroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"vegetarian"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)
    }
})
app.get('/vegetariangroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "vegetarian",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)
    }
})
app.post('/vegetariangroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)
    }
})
app.put('/vegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)
    }
})
app.delete('/vegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})
/////////////////////////////////////
//CarnivorousGroup
app.get('/carnivorousgroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"carnivor"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)
    }
})
app.get('/carnivorousgroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "carnivor",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)
    }
})
app.post('/carnivorousgroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)
    }
})
app.put('/carnivorousgroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)
    }
})
app.delete('/carnivorousgroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
/////////////////////////////////////
//LactovegetarianGroup
app.get('/lactovegetariangroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"lactovegetarian"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.get('/lactovegetariangroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "lactovegetarian",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)
    }
})
app.post('/lactovegetariangroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)
    }
})
app.put('/lactovegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.delete('/lactovegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
//////////////////////////////////////
//LactoovovegetarianGroup
app.get('/lactoovovegetariangroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"lactoovovegetarian"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.get('/lactoovovegetariangroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "lactoovovegetarian",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.post('/lactoovovegetariangroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.put('/lactoovovegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.delete('/lactoovovegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
//////////////////////////////////////
//ApivegetarianGroup
app.get('/apivegetariangroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"apivegetarian"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)
    }
})
app.get('/apivegetariangroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "apivegetarian",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.post('/apivegetariangroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.put('/apivegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.delete('/apivegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
///////////////////////////////////////
//CarnivorousGroup
app.get('/apivegetariangroup',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator:"carnivor"
            }
        })
        res.status(201).json(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.get('/apivegetariangroup/:nume',async (req,res,next)=>{
    try{
        const member=await Utilizator.findAll({
            where:{
                tip_utilizator: "vegetarian",
                nume: req.params.nume
            },
            include:{
                model:Produs,
            }
        })
        res.send(member)
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.post('/apivegetariangroup', async (req,res,next)=>{
    try{
        const user=await Utilizator.create(req.body)
        res.status(201).json(user);             
    }catch(err){
        next(err)//pasez catre app.use care va trata eroarea
    }
})
app.put('/apivegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user= await Utilizator.findByPk(req.params.uid)
        if(user){
            user.iduser=req.body.iduser;
            user.nume=req.body.nume;
            user.prenume=req.body.prenume;
            user.email=req.body.email;
            user.data_logare=req.body.data_logare;
            user.tip_utilizator=req.body.tip_utilizator;
            await user.save();
            res.status(201).json(user)
        }
    }catch(err){
        next(err)
    }
})
app.delete('/apivegetariangroup/:uid',async (req,res,next)=>{
    try{
        const user=await Utilizator.findByPk(req.params.uid)
        if(user){
            await user.destroy();
            res.status(201).json({message:"completed"})
        }
        else{
            res.status(404).json({message:"not found"})
        }
    }catch(err){
        next(err)
    }
})
app.listen(6000)