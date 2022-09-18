var {db} = require('../config/db');
var collection = require('./collections');
var bcrypt = require('bcrypt');
const {ObjectID, ObjectId} = require('mongodb')

module.exports = {
    doLogin: function (adminData){
        return new Promise(async function (resolve, reject){
            db().collection(collection.ADMIN).findOne({email: adminData.email})
         .then(async function (data){
             console.log(data);
             if(data){
                 let status = await bcrypt.compare(adminData.password, data.password);
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
    addProduct: function (product) {
        return new Promise(function (resolve, reject){
            db().collection(collection.PRODUCTS).insertOne(product)
            .then(function (result){
                // console.log(result);
                resolve(result)
            }).catch(function (result){
                reject(result);
            })
        })
    },
    getProductDetails: function (prodId){
        return new Promise(function (resolve, reject){
            db().collection(collection.PRODUCTS).findOne({_id: ObjectID(prodId)})
            .then(function (product){
                resolve(product)
            }).catch(function (err){
                reject(err)
            })
        })
    },
    deleteProduct: function (prodId){
        return new Promise(function (resolve, reject){
            db().collection(collection.PRODUCTS).deleteOne({_id: ObjectID(prodId)})
            .then(function (result){
                resolve()    
            }).catch(function (result){
                reject()
                // console.log('Fail');
                // console.log(result);
            })
        })
    },
    editProduct: function (product) {
        return new Promise(function (resolve, reject){
            console.log(product);
            db().collection(collection.PRODUCTS).updateOne(
                {_id: ObjectId(product._id)},
                {
                    $set: {
                        name: product.name,
                        description: product.description,
                        price: product.price
                    }
                }
            ).then(function (data){
                console.log('Success');
                resolve()
            }).catch(function(err){
                console.log('Something went wrong in editProduct')
                console.log(err);
                reject()
            })
        });
    }
}