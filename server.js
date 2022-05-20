/**********************************************************************************************
 ** WEB422 – Assignment 1
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students. * 
 * 
 * Name: Edgar David Garcia Torres  Student ID: 104433206  Date: 19/05/2022
 * 
 * Heroku Link: _______________________________________________________________ 
 * *******************************************************************************************/


var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());
app.use(express.json());

const TripDB = require("./tripDB.js");
const db = new TripDB();

var HTTP_PORT = process.env.PORT || 8080;

// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.send({message: "API Listening"});
});


//routes: 

//ADD NEW TRIP 
app.post("/api/trips",(req,res)=>{ // add a new "Trip"
  var tripInfo = req.body;
  console.log("trip info received is: ",tripInfo );
  db.addNewTrip(tripInfo).then(()=>{
    res.status(200).json(`new sale successfully added`);
    console.log("trip added successfully");
  }).catch((err)=>{
    res.status(400).json(err);
    console.log("Error: ", err);
  })
})


//GET ALL 
app.get("/api/trips",(req,res)=>{ //takes parameters page and perPage to Query /api/trips?page=1&perPage=5
  console.log("Page and perPage entered are: ",req.query.page, req.query.perPage); 
  db.getAllTrips(req.query.page, req.query.perPage ).then((info)=>{
    res.status(200).json(info);
    console.log("Information for page retrieved is :", info);
  }).catch((err)=>{
    res.status(400).json(err);
    console.log("failed at getting pages: ", err);
  })
})

//GET ONE by Id
app.get("/api/trips/:id",(req,res)=>{ // It will use this parameter to return a specific "Trip"
  db.getTripById(req.params.id).then(data=>{
    res.status(200).json(data);
}).catch(err=>{
    console.log("failed at retrieving trip:", err);
    res.status(404).json(err);
});
})



//UPDATE record by Id
app.put("/api/trips/:id",(req,res)=>{
  db.updateTripById(req.body, req.params.id).then(data=>{
    console.log("Attempt to update ");
  }).then((data)=>{
    res.status(200).json(`sale ${req.body._id}  updated!!`);
  }).catch(err=>{
      console.log("Attempt to update failed ");
      res.status(404).json(err);
  });
})


//DELETE record by id
app.delete("/api/trips/:id",(req,res)=>{ 
  console.log("Attempt to delete ");
  db.deleteTripById(req.params.id)
  .then((data)=>{
    res.status(200).json(`trip ${req.params.id} deleted!!`);
  }).catch(err=>{
      console.log("Attempt to delete failed ");
      res.status(404).json(err);
  });
})

//initialize dataBase and start the server

db.initialize("mongodb+srv://dbAdmin:dbAdminPass@cluster0.z8lak.mongodb.net/sample_training?retryWrites=true&w=majority")
.then(()=>{
  app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
  });
  }).catch((err)=>{
    console.log(err);
  });
