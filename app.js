var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open",function(){
  console.log("DB connected ");
});
db.on("error",function(err) {
  console.log("DB ERROR :", err);
});


var dataSchema = mongoose.Schema({
  name : String,
  count : Number
});

var Data = mongoose.model('data',dataSchema);
Data.findOne({name : "myData"}, function(err,data){
  //find database named myData. if not, create one has name myData.
  if(err) return console.log("data error : ",err);
  if(!data){
    Data.create({name : "myData",count :0}, function(err,data){
        if(err) return console.log("data error : ",err);
        console.log("counter initialized :",data);
    });
}
});

app.set("view engine", 'ejs');
app.use(express.static( __dirname + '/public'));

app.get('/',function( req, res) {
  Data.findOne({name :"myData"},function(err,data){
    if(err) return console.log("data error:", err);
    data.count++;
    data.save(function (err) {
      if(err) return console.log("data error:", err);
      res.render('my_first_ejs',data);
    });
  });
});

app.get('/',function(req,res){
  res.send('hello world~~~');
});

app.listen(8003, function(){
  console.log('server on');

});
