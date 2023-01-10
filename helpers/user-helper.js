

const db=require('../config/connection')
const collection=require('../config/collections')
const bcrypt =require('bcrypt')
const objectId=require('mongodb').ObjectId
const collections = require('../config/collections')
const { response } = require('express')
module.exports={

    //use for signup
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let respone={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
            response.status=false;
            resolve({status:false})
    }else{
        
        userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.InsertedId,{status:true})
            })
    }
})

    },
    // use for login
    doLogin:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user=user;
                        response.status=true;
                        resolve(response)
                    }
                    else{
                        console.log("Login failed");
                        resolve({status:false})
                        
                    }
                })           
             }else{
                resolve({status:false})
             }
        })
    },
    addUser:(user)=>{
        return new Promise(async (resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data)=>{
               resolve(data.insertedId)
        })
         })
            },
            getAllUsers:()=>{
                return new Promise(async(resolve,reject)=>{
                    let users=await db.get().collection(collection.USER_COLLECTION).find().toArray();
                    resolve(users)
                })
            },
            deleteUser:(proId)=>{
                return new Promise((resolve,reject)=>{
                    db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                        resolve(response)
                    })
                })
            },
            getUserdetail:(proId)=>{
                return new Promise((resolve,reject)=>{
                    db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(proId)}).then((user)=>{
                        resolve(user)
                    })
                })
            },
            updateUser:(proId,userDetails)=>{
                return new Promise((resolve,reject)=>{
                    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(proId)},{
                        $set:{
                            Name:userDetails.Name,
                            Email:userDetails.Email
                        }
                    }).then((response)=>{
                        resolve()
                    })
                })
            }
}