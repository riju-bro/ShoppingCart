let {db} = require('../config/db');
let collection = require('./collections')
let bcrypt = require('bcrypt');
const { ObjectID } = require('bson');
module.exports = {
    // we create a cart for the user while sign-up
    doSignUp: function (userData){
        return new Promise(async function (resolve, reject){
            let password = await bcrypt.hash(userData.password, 10);
            // console.log(password);
            userData.password = password
            db().collection(collection.USERS).insertOne(userData)
            .then(function (result){
                db().collection(collection.CART).insertOne({
                    _id: result.insertedId,
                    products: []
                }).then(function (result){
                    resolve(result)
                }).catch(function (err){
                    console.log('[+] Something went wrong in creating cart');
                    // console.log(err);
                    reject(err)
                })
            })
            .catch(function (err){
                reject(err) 
            })
        })
    },
    doLogin: function (userData){
       return new Promise(function (resolve, reject){
        db().collection(collection.USERS).findOne({email: userData.email})
        .then(async function (data){
            console.log(data);
            if(data){
                let status = await bcrypt.compare(userData.password, data.password);
                if(status){
                    resolve(data)
                }else{
                    reject('Incorrect User Name or Password');
                }
            }else{
                reject('Incorrect User Name or Password')
            }
        }).catch(function (data){
            reject('Are You a mad')
        });

       }); 
    },
    showAllProducts: function (){
        return new Promise(async function (resolve, reject){
            let products = await db().collection(collection.PRODUCTS).find().toArray()
            if(products){
                resolve(products)
            }else{
                reject()
            }
        })
    },
    getProductById: function(prodId) {
      return new Promise(function (resolve, reject){
        db().collection(collection.PRODUCTS).findOne({_id: ObjectID(prodId)})
        .then(function(product){
            resolve(product)
        }).catch(function(err){
            reject(err)
        })
      })
    },
    addToCart: function(prodId, userId) {
        return new Promise(function (resolve, reject){
            db().collection(collection.CART).updateOne(
                {_id: ObjectID(userId)},
                {$push: {products: ObjectID(prodId)}}
            ).then(function (result){
                resolve(result)
            }).catch(function (err){
                resolve(err)
            })
        })
    },
    viewCart: function (userId) {
        return new Promise(function (resolve, reject) {
            db().collection(collection.CART).aggregate()
        })
    }
}   