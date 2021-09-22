const express=require('express');
const bcrypt=require("bcryptjs")
const app=express()
const router=express.Router();
const {signup,signin,deleteTodoListItem,deleteBrandName
       ,createBrandsTodoList,findBrands,findTodoList,createBrand,brandsTodoListUpdate,brandsNameUpdate} =require('../controllers/auth')
require('../db');
const User=require('../models/schema');
const authenticate = require('../middleware/authenticate');
const { find } = require('../models/schema');

router.get('/',(req,res)=>{
       
    res.send("hello");

});

router.post('/Signup',async(req,res)=>{
        console.log(req.body);
        const response=await signup(req,res);
        console.log(response);
       return  res.send(response);       
});

router.post('/Signin',async(req,res)=>{
       const response=await signin(req,res);
       
       return  res.send(response)

    
})

router.delete('/deleteBrand',authenticate,async(req,res)=>{
       const response=await deleteBrandName(req);
       //console.log(response.deletedCount);
       return  res.send(response)

    
})

router.delete('/deleteTodoList',authenticate,async(req,res)=>{
       const response=await deleteTodoListItem(req);
       //console.log(response.deletedCount);
       return  res.send(response)

    
})

router.get("/userData",authenticate,(req,res)=>{
       res.send(req.rootUser);
})

router.post("/brandsCreate",authenticate,async(req,res)=>{
       console.log(req.rootUser)

        const result=createBrand(req)
       // console.log(response);
       //  res.send(response)
//req.body.brands=req.body.brands.concat({brand:req.body.brands.brand});
       res.send("hy")
});

router.post("/brandsTodoListCreate",authenticate,async(req,res)=>{
       //console.log(req)

        const response=await createBrandsTodoList(req)
       // console.log(response);
       //  res.send(response)
//req.body.brands=req.body.brands.concat({brand:req.body.brands.brand});
       res.send("helo")
});

router.get("/brandsFind",authenticate,async(req,res)=>{
       const response=await findBrands(req);
       res.send(response);

});

router.get("/todoListFind",authenticate,async(req,res)=>{
       const response=await findTodoList(req);
       res.send(response);

});

router.patch("/brandsTodoListUpdate",authenticate,async(req,res)=>{
       //console.log(req.body)
       const response=await brandsTodoListUpdate(req)
       //console.log(response);
        res.send(response)
})

router.patch("/brandsNameUpdate",authenticate,async(req,res)=>{
       //console.log(req.body)
       const response=await brandsNameUpdate(req)
       //console.log(response);
        res.send(response)
});

router.get("/logout",(req,res)=>{
       console.log("hyjuggh");
       res.clearCookie("jwtt",{path:'/'});
       res.status(200).send("user logout");
});

module.exports=router