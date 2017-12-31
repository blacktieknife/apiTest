const port = process.env.PORT || 8000;
const express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose')

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {Navigation} = require('./models/navigation');

var app = express();

app.use(bodyParser.json());


app.get('/todos', function(req, resp){
    Todo.find().then(function(docs){
        if(!docs){
         return resp.status(404).send();
        }
       resp.send({todos:docs});
    }).catch(function(error){
        resp.status(400).send(error);
    });
});

app.get("/todos/:id", function(req, resp){
    var id = req.params.id;
    if (!ObjectID.isValid(id)){
        return resp.status(404).send();
    }
Todo.findById(id).then(function(todo){
    if(!todo){
        return resp.status(404).send();
    }
    resp.send({todo:todo});
    
}).catch(function(err){
    resp.status(400).send();
});
});

app.post('/todos', function(req, res){
 console.log(req.body);
    var todo =  new Todo({
        text: req.body.text
    });
    
    todo.save().then(function(doc){
//        console.log('new todo sucessfully saved');
//        console.log(JSON.stringify(doc, null, 2));
        res.send(doc);
    }).catch(function(err){
//console.log("error saving new Todo ", err);
        res.status(404).send();
    })
});


//navigation api test
app.get('/navigation', function(req, resp){
    Navigation.find().then(function(navs){
        if(!navs){
         return resp.status(404).send();
        }
       resp.send({nav:navs});
    }).catch(function(error){
        resp.status(400).send(error);
    });
});

app.post('/navigation', function(req, res){
 console.log(req.body);
    var navItem =  new Navigation({
        name: req.body.name,
        type: req.body.type,
        link: req.body.link,
        visable: req.body.visable
        
    });
    console.log(navItem);
    navItem.save().then(function(doc){
//        console.log('new todo sucessfully saved');
//        console.log(JSON.stringify(doc, null, 2));
        res.send(doc);
    }).catch(function(err){
//console.log("error saving new Todo ", err);
        res.status(404).send(err);
    })
});



app.listen(port, function(){
    console.log(`new server listening on post ${port}`)
})

module.exports = {
    app:app
};



//find by id example
//var id = "5a45ceaaf258f206b07ea0ed";

//Todo.findById(id).then(function(todo){
//    console.log(todo);
//}).catch(function(err){
//    console.log(err)
//});



















//Todo example





//text - required - trimmed -minlength 1

//var otherTodo = new Todo({
//    text:"Fix false not showing up by default in completed field",
//    completed:true,
//    completedAt:new Date().getTime()
//})
//
//otherTodo.save().then(function(doc){
//   console.log("Full Todo Saved ", doc);
//}, function(err){
//    console.log("there was an error... ", err)
//});

//User Model
//email -reuired - trimed - set type - set min legnth of 1
// var newUser = new User({
//
// });
// newUser.save().then(function(doc){
//    console.log("New User Saved ", doc);
//}).catch(function(err){
//     console.log("error with save --newUser --")
//     console.log("----");
//     console.log(err.message);
//     console.log("----");
//     console.log("Full error dump");
//     console.log(JSON.stringify(err,null,2));
// })
