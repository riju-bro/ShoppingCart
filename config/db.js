var {MongoClient} = require('mongodb');
let db = null;

module.exports = {
    connect: function (done){
        if(db){
            return done('[+] DataBase already Connected');
        }
        const url = 'mongodb://127.0.0.1:27017';
        const dbName = 'shopping-cart';
        const client = new MongoClient(url,{ useNewUrlParser: true ,useUnifiedTopology: true});

        client.connect(function (err){
            if(err){
                return done('[-]Database Connection Error');
            }
            db = client.db(dbName)
            // experimental purpose
            // db.collection().findOne({userName: userName});

            // 
            done('[+] Database connected Successfully')
        })
    },
    db: function(){
        return db;
    }
}

