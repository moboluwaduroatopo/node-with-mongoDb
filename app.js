var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
var fs = require('fs');
var formidable = require('formidable');

var app = express();

//const api='b15f3177256d90c6c3fa4bbc5442238c';
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/AssBetaTeamDB");
const port =3002;

let nameSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        phone: Number,
        gender: String
    }
);


let User = mongoose.model("User", nameSchema);
app.get('/',(req,res)=> {
  res.render('index',{weather:null, error: null});
});

app.get('/reg',(req,res) =>{

    User.find((err,result)=>{
        console.log(result)
        res.render('reg',{sent: "empty",users : result})
    })
   
});
app.get('/edit', (req, res) => { 
    User.find({_id: req._parsedOriginalUrl.query}, (err,result)=>{
        res.render('editlist', { editusers: result });
    })
});

app.get('/delUser',(req,res) =>{
console.log(req._parsedOriginalUrl.query);
  User.deleteOne({_id: req._parsedOriginalUrl.query}, function (err){ 
        if(err) return handleError(err);
        User.find((err,result)=>{
            res.render('reg', { sent: "empty", users: result })
           // console.log('A collection has been deleted in the database')
        });
    })  
   
});


app.post('/updatelist',(req,res)=> {
    User.updateOne({_id: req.body.id}, { $set: {firstName: req.body.firstName, lastName: req.body.lastName, phone: req.body.phone, gender: req.body.gender }}, function (err, response) {
            if(err) throw err;
            else {
                User.find((err,result)=>{
                    res.render('reg', { n_update: null, y_update: "One collection updated", users: result });
                })

            }
        });
});


app.post('/regprocess',(req,res)=> {
 // var form = new formidable.IncomingForm();
 //        form.parse(req, function (err, fields, files) {
          
 //          var oldpath=files.file.path;
 //          var newpath='C:/nodeclss/node-ass/images/'+fields.firstName+".jpg"
 //          fs.rename(oldpath, newpath,(err) =>{
 //               if (err) {
 //                console.log(err)
 //               } else{
 //                res.send("success")
 //               }
 //             });
           
 //        })




 let myData = new User(req.body);
   // console.log(req.body);
   myData.save().then(item => {
          // console.log(myData);
           User.find((err,result)=>{
            //console.log(result)
            res.render('test',{success: "Congratulation,You are now save into our database"})
        });
       }
   ).catch(
       err => {
           console.log("In error block")
           res.status(400)
           // .render('reg',{sent: "unable to save to database" + err})
       }
   )
});


app.listen(port,() => {
  console.log("Server started and listening at "+port);
});