var express = require('express'),
    app = express(),
    mongodb = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    bodyParser = require('body-parser');
cors = require('cors');
jsonwebtoken = require('jsonwebtoken');

const mongo_conn = 'mongodb://localhost/';
var db = '';

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongodb.connect(mongo_conn, function (err, client) {
    if (!err) {
        console.log('Connection Established!');
        app.listen(9797, function () {
            console.log("Server Started @ localhost:9797");
        });
        db = client.db('mydb');
    } else {
        console.log('Could not connect to MongoDB');
    }

});

app.post('/authenticate', function (req, resp) {
    db.collection('users').find(req.body).toArray(function (err, docs) {
        if (!err) {
            if (docs.length == 1) {
                var token = jsonwebtoken.sign({ username: docs[0].username }, 'secret-key', {
                    'expiresIn': '1h'
                });
                resp.send({
                    token: token,
                    isLoggedIn: true
                });
            } else {
                resp.send({
                    isLoggedIn: false,
                    err: 'Invalid Credentials'
                });
            }
        } else {
            resp.send({
                isLoggedIn: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/register', function (req, res) {
    db.collection('users').find({ "username": req.body.username }).toArray(function (err, docs) {
        if (docs.length < 1) {
            db.collection('users').insert(req.body, function (err) {
                if (!err) {
                    res.send({
                        status: true
                    });
                } else {
                    res.send({
                        status: false,
                        err: 'Oops...something went wrong!!! Please try again!'
                    });
                }
            });
        } else {
            res.send({
                status: false,
                err: 'Username unavailable!!! Please try registering using a different username!'
            });
        }
    });

});

app.use(function (req, res, next) {
    var token = req.body.authorization || req.query.authorization || req.headers.authorization;
    if (token) {
        jsonwebtoken.verify(token, 'secret-key', function (err, decoded) {
            if (!err) {
                req.decoded = decoded;
                next();
            } else {
                res.send({
                    status: false,
                    err: 'Invalid Credentials'
                });
            }
        })
    }
    else {
        res.send({
            status: false,
            err: 'Invalid Credentials'
        });
    }
});

app.post('/create', function (req, res) {
    req.body.username = (req.decoded.username);
    req.body.likes = [];
    db.collection('posts').insert(req.body, function (err) {
        if (!err) {
            res.send({
                status: true
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});


app.get('/getposts', function (req, res) {
    db.collection('posts').find().toArray(function (err, docs) {
        if (!err) {
            for (i = 0; i < docs.length; i++) {
                var likes = docs[i].likes;
                var like = false;
                docs[i].isUser = false;
                if(docs[i].username==req.decoded.username){
                    docs[i].isUser = true;
                }
                for (x in likes) {
                    if (likes[x] == req.decoded.username) {
                        like = true;
                    }
                }
                docs[i].like = like;
            }
            res.send({
                status: true,
                docs: docs
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }

    });
});

app.get('/getcomments', function (req, res) {
    db.collection('comments').find({ postid: req.query.postid }).toArray(function (err, docs) {
        if (!err) {
            for (i = 0; i < docs.length; i++) {
                var likes = docs[i].likes;
                var like = false;
                docs[i].isUser = false;
                if(docs[i].username==req.decoded.username){
                    docs[i].isUser = true;
                }
                for (x in likes) {
                    if (likes[x] == req.decoded.username) {
                        like = true;
                    }
                }
                docs[i].like = like;
            }
            res.send({
                status: true,
                docs: docs
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.get('/getpost',function(req,res){
    db.collection('posts').find({_id: new ObjectId(req.query.id)}).toArray(function(err,docs){
        if(!err){
            res.send({
                status:true,
                docs:docs
            });
        }else{
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
})

app.post('/editpost',function(req,res){
    db.collection('posts').update({_id: new ObjectId(req.body._id)},{$set:{title:req.body.title,description:req.body.description}},function(err,docs){
        if(!err){
            res.send({
                status:true,
                docs:docs
            });
        }else{
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
})

app.post('/deletepost', function (req, res) {
    db.collection("posts").deleteOne({ _id: new ObjectId(req.body.id) }, function (err) {
        if (!err) {
            console.log("deleted post!");
            db.collection("comments").deleteMany({ postid: req.body.id }, function (error) {
                if (!error) {
                    res.send({
                        status: true
                    });
                } else {
                    res.send({
                        status: false,
                        err: 'Oops...something went wrong!!! Please try again!'
                    });
                }
            });

        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/addlike', function (req, res) {
    db.collection("posts").update({ _id: new ObjectId(req.body.id) }, { $push: { likes: req.decoded.username } }, function (err) {
        if (!err) {
            console.log("liked post!");
            res.send({
                status: true
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});


app.post('/addcomment', function (req, res) {
    req.body.comment.username = (req.decoded.username);
    req.body.comment.likes = [];
    db.collection("comments").insert(req.body.comment, function (err) {
        if (!err) {
            console.log("comment added!");
            res.send({
                status: true
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/commentlike', function (req, res) {
    db.collection("comments").update({ _id: new ObjectId(req.body.commentid) }, { $push: { likes: req.decoded.username } }, function (err) {
        if (!err) {
            console.log("liked comment!");
            res.send({
                status: true
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/deletecomment', function (req, res) {
    db.collection("comments").deleteOne({ _id: new ObjectId(req.body.id) }, function (err) {
        if (!err) {
            console.log("deleted comment!");
            res.send({
                status: true
            });
        } else {
            res.send({
                status: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

