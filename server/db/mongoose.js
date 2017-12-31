var mongoose = require("mongoose");

//setting up javascipt ES6 promises as default  // normal default is a callback funciton
mongoose.Promise= global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/TodoApp",{ useMongoClient: true });


module.exports = {
    mongoose:mongoose
}
