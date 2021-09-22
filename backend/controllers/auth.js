const express=require('express');
const jwt=require('jsonwebtoken');
const bcrypt=require("bcryptjs")
const cookie=require('cookie-parser')
require('../db');
const {User,TodoList}=require('../models/schema');

const { response } = require('express');
const { set } = require('mongoose');



const signup=async(req,res)=>{
    const {fname,lname,email,dob,phone,password,cpassword}=req.body;
    if(!fname || !lname || !email || !dob || !phone || !password || !cpassword)
    {
       const result={message:"Allfields are require",status:401}
       return result;
    }
    try{
       const userExist=await User.findOne({email:email})
        
            if(userExist){
            const result={message:"Email already exist",
        status:202};
        return result;
          }
       
            
            if(password!==cpassword)
            {
                const result={message:"Password don't match",
            status:404};
            return result;
            }
            const hashedPassword= await bcrypt.hash(password,10);
            


            const user=new User({fname,lname,email,dob,phone,password:hashedPassword});
    
           const userSignup=await user.save();
           if(userSignup){
                const result={message:"user registered successfully",
            status:200}
        return result;}
                else{
                    const result={message:"failed to registered",
                status:500}
                return result;
                }
        
    }

    catch(err){console.log(err.message)};
}

const signin=async(req,res)=>{
    //const result
    try{
        let token;
        const {email,password}=req.body;
        if(!email || !password){
            const result={message:"Invalid data",
        status:401};
        return result;
        }
        const userLogin=await User.findOne({email:email})
        
        if(userLogin){
            
            const isMatch=await bcrypt.compare(password,userLogin.password);
            if(isMatch){
            
            //console.log(process.env.SECRET_KEY)
            try{
                 token=await jwt.sign({userLogin_id:userLogin._id},process.env.SECRET_KEY);
            //console.log(token);
            userLogin.tokens=userLogin.tokens.concat({token:token});
            await userLogin.save({token:token});
            console.log(token)
            }
            catch (err){
                console.log(err.message)
            }
            res.cookie("jwtt",token,{
                expires:new Date(Date.now()+258920000000000)
                
            })
            
            //   res.cookie("shivam",token,{
            //       expiresIn:new Date(Date.now()+2590000),
            //       httpOnly:true
            //   })
            //   console.log('Cookies',req.cookies)
             
            

                const result={message:"Signin successfully",
            status:200,token:token};
            return result;
            }
            else{
                const result={message:"error",
            status:400};
            return result;
            }
        }
        else{
            const result={message:"error",
        status:404};
        return result;
        }
        
    }catch(err){
        console.log(err.message);
    }
    
}


    const find1=async(req)=>{
            const result=await User.find({})
            console.log(result.fname)
            return result.brands;
    }

    const deleteBrandName=async(req)=>{
        console.log(req.body.brands)
        const result=await User.findOne({_id:req.userID},{
            brands: {
              "$elemMatch": {
                name: req.body.brands
              }
            }},{_id:1});
        
            
                // const result=await User.updateOne({_id:req.userID,"brands.name":d},{$set:{"brands":
                // {todoList:{name:data.body.todoList,status:"doing"}}}})
        
        console.log(result.brands[0]._id)
        const answer=result.brands[0]._id;
        const result1=await User.updateOne({_id:req.userID},{$pull:{"brands":{"name":req.body.brands}}})
        await TodoList.deleteOne({_id:answer})
        console.log(result1)
        return result1;
}

const deleteTodoListItem=async(req)=>{
    console.log(req.body.brands)
    const result=await User.findOne({_id:req.userID},{
        brands: {
          "$elemMatch": {
            "name": req.body.brands
          }
        }},{_id:1});
    
        
            // const result=await User.updateOne({_id:req.userID,"brands.name":d},{$set:{"brands":
            // {todoList:{name:data.body.todoList,status:"doing"}}}})
    
    console.log(result.brands[0]._id)
    const answer=result.brands[0]._id;
    const result1=await TodoList.updateOne({_id:answer},{$pull:{todoList:{"name":req.body.todoList}}})
    //await TodoList.deleteOne({_id:answer})
    console.log(result1)
    return result1;
}

const createBrand=async(req)=>{
    //console.log(req.rootUser);
   const query=req.rootUser.brands;
    // req.rootUser.brands
    const result=await User.findOne({_id:req.userID})
    console.log(result.brands.name)
    if(result){
        result.brands=await result.brands.concat({"name":req.body.brands})
        await result.save({"name":req.body.brands})
        console.log(result)
    }
    
    return result;
}

const createBrandsTodoList=async(data)=>{
    //const d="netplay6"
    //console.log(data.rootUser)
    const result=await User.findOne({_id:data.userID},{
        brands: {
          "$elemMatch": {
            name: data.body.brands
          }
        }},{_id:1});
    
        
            // const result=await User.updateOne({_id:data.userID,"brands.name":d},{$set:{"brands":
            // {todoList:{name:data.body.todoList,status:"doing"}}}})
    
    console.log(result.brands[0]._id)
    const answer=result.brands[0]._id;
    const ans=await TodoList.findOne({_id:answer})
    console.log(ans)
            if(ans===null)
            {
                await TodoList.insertMany({"_id":answer,todoList:{"name":data.body.todoList,"status":data.body.status}})
            }
            else {
                    ans.todoList=await ans.todoList.concat({"name":data.body.todoList,"status":data.body.status})
                   await ans.save({"name":data.body.todoList,"status":data.body.status})
            }

    return result;
}

const findBrands=async(req)=>{
        const result=await User.findOne({_id:req.userID});
        //console.log(result.brands[0].name);
        return result.brands;
}

const findTodoList=async(data)=>{
    const result=await User.findOne({_id:data.userID},{
        brands: {
          "$elemMatch": {
            name: data.body.brands
          }
        }},{_id:1});

        const answer=result.brands[0]._id;
        const ans=await TodoList.findOne({_id:answer});
        console.log(ans);
        return ans;
}

const brandsTodoListUpdate=async(data)=>{
    const result=await User.findOne({_id:data.userID},{
        brands: {
          "$elemMatch": {
            name: data.body.brands
          }
        }},{_id:1});
        console.log(result)
        const answer=result.brands[0]._id;
        console.log(data.body.updatedName);
        //let ans;
        if(data.body.updatedName!==undefined)
        
       { const ans=await TodoList.findOne({_id:answer}
            ,{todoList:{$elemMatch:{name:data.body.todoList}}})
        // console.log(ans.todoList)
        // 
        console.log("0")
        console.log(ans)
    
 
 ans.todoList.map((x)=>{
     x.name=data.body.updatedName;
 })
        console.log(ans)
        await ans.save()
       }
       else{
        const ans=await TodoList.findOne({_id:answer}
            ,{todoList:{$elemMatch:{name:data.body.todoList}}})
        // console.log(ans.todoList)
        // 
        console.log("0")
        console.log(ans)
    
 //}

        //  ans=await TodoList.findOne({_id:answer},{todoList:{$elemMatch:{name:data.body.todoList}}},{$set:{"todoList.$.status":data.body.updatedStatus}})
        // console.log(ans)
    //}
 ans.todoList.map((x)=>{
     x.status=data.body.updatedStatus;
 })
        console.log(ans)
        await ans.save()

       }
        //const ans=await TodoList.updateOne({_id:answer,todoList:{"name":data.body.todoList}},{$set:{todoList:{"name":data.body.updatedName}}});
        //console.log(ans);
        return result;
}
const brandsNameUpdate=async(req)=>{
        const result=await User.findOne({_id:req.userID});
        result.brands.map((x)=>{
            if(x.name===req.body.brand)
            {
                x.name=req.body.brandUpdatedName
            }
        })
        await result.save();
        console.log(result.brands);
        return result;

}

module.exports ={signup,signin,find1,deleteBrandName,createBrand,createBrandsTodoList,findBrands,findTodoList,deleteTodoListItem,brandsTodoListUpdate,
    brandsNameUpdate}