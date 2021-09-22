
const mongoose=require('mongoose');
const bcrypt=require("bcryptjs")
// const db='mongodb+srv://abhi:fXY9s8VfJj8DkjNH@cluster0.lme2e.mongodb.net/userdata?retryWrites=true&w=majority';
// mongoose.connect(db,{
//     useNewUrlParser:true,
    
//     useUnifiedTopology:true,
    
// }).then(()=>{
//     console.log('connection successfull')
// }).catch((err)=>console.log(err.message));

const userSchema=new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    brands:[
        {
            name:{
                
                type:String,
                unique:true
                
            },
            
        }]
    ,
    tokens:[
       { token:{
            type:String,
            required:true
       }
        }
]

})

const todoList=new mongoose.Schema({
    _id:{
        type:String,
        required:true
    },
    todoList:[
        {
            name:{
                type:String,
                
            },
            status:{
                type:String
            }
        }
    ]

})



const User=mongoose.model('USER',userSchema);
const TodoList=mongoose.model('TODOLIST',todoList);

module.exports={ User,TodoList};