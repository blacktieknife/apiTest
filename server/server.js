const express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose')

var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

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
        res.status(404).send(err);
    })
});


app.listen(8000, function(){
    console.log('new server listening on post 8000')
})

























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
