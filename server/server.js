const port = process.env.PORT || 3000;
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose')

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {Navigation} = require('./models/navigation');
var {authenticate} = require('./middleware/authenticate');
var app = express();

app.use(bodyParser.json());




//get all todos
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

//get todo by id
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

//add new todo!
app.post('/todos', function(req, res){
 console.log(req.body);
    var todo =  new Todo({
        text: req.body.text
    });
    
    todo.save().then(function(doc){
       res.send(doc);
    }).catch(function(err){
        res.status(404).send();
    });
});

//remove todo by id
app.delete('/todos/:id', function(req, res){
 var id = req.params.id;
    console.log(id);
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid!");
    }
  Todo.findByIdAndRemove(id).then(function(doc){
      if(!doc){
          return res.status(404).send("No record found for delete --/todos/:id")
      }
        res.send(doc);
    }).catch(function(err){
        res.status(404).send();
    });
});

//update todo by id
app.patch('/todos/:id', function(req,res){
  var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    console.log(body);
      if(!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid!");
    }
    
    if(body.completed && _.isBoolean(body.completed)) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate(id, body, {new:true}).then(function(doc){
        if(!doc){
            return res.status(404).send('No record found for update --/todos/:id');
        }
        
        res.send({doc});
    }).catch(function(err){
        res.status(400).send();
    });
});


app.get('/users/me', authenticate, function(req, res){
res.send(req.user);
});

app.post('/users', function(req,res){
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(function(user){
        
        return user.generateAuthToken();
  }).then(function(token){
        res.header('x-auth', token).send(user);
    }).catch(function(err){
        res.status(400).send(err);
    });
   
    
    
    
//    user.save().then(function(obj){
//        res.send(obj);
//    }).catch(function(err){
//       res.status(400).send(err);
//    });
})


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

//add new navigation item
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
        res.send(doc);
    }).catch(function(err){
        res.status(404).send(err);
    })
});

//remove navigation item
app.delete('/navigation/:id', function(req, res){
 var id = req.params.id;
    console.log(id);
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send("ID not valid!");
    }
  Navigation.findByIdAndRemove(id).then(function(doc){
      if(!doc){
          return res.status(404).send("No record found to delete --/navigation/:id");
      }
        res.send(doc);
    }).catch(function(err){
        res.status(404).send();
    });
});


//update navigation using patch
app.patch("/navigation/:id", function(req, res){
    var id = req.params.id;
    var body = _.pick(req.body, ['name', 'type', 'link', 'visable']);
    console.log(body);
    if(!ObjectID.isValid(id)){
        return res.status(404).send('Id is invalid');
    }
    Navigation.findOneAndUpdate({_id:id}, body).then(function(doc){
        if(!doc){
            return res.status(404).send('No record found for patch --/navigation/:id')
        }
        res.send(doc);
    }).catch(function(err){
       res.status(400).send(err);
    });
});

app.listen(port, function(){
    console.log(`new server listening on post ${port}`)
})

module.exports = {
    app:app
};

