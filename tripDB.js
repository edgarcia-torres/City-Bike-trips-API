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

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    "tripduration": Number,
    "start station id": Number,
    "start station name": String,
    "end station id": Number,
    "end station name": String,
    "bikeid": Number,
    "usertype": String,
    "birth year": Number,
    "gender": Number,
    "start station location": {
        "type": {type: String},
        "coordinates": [Number]
    },
    "end station location": {
        "type": {type: String},
        "coordinates": [Number]
    },
    "start time": Date,
    "stop time": Date
});

module.exports = class TripDB {
    constructor() {
         // We don't have a `Trip` object until initialize() is complete
        this.Trip = null;
    }

    // Pass the connection string to `initialize()`
    initialize(connectionString) {
        return new Promise((resolve, reject) => {
           const db = mongoose.createConnection(connectionString);
           
            db.once('error', (err) => {
                reject(err);
            });
            db.once('open', () => {
                this.Trip = db.model("trips", tripSchema);
                resolve();
            });
        });
    }

    async addNewTrip(data) {
        const newTrip = new this.Trip(data);
        await newTrip.save();
        return newTrip;
    }
    
    getAllTrips(page, perPage) { 
        console.log("    INSIDE GET ALL TRIPS:   ");
        console.log("    PAGE IS :   "+ page+ " per Page is: "+ perPage);

        if(+page && +perPage){
            return this.Trip.find().sort({_id: +1}).skip((page - 1) * +perPage).limit(+perPage).exec();
        }
        
        return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
    }

    getTripById(id) {
        console.log("    INSIDE GET TRIP BI ID:   ");
        return this.Trip.findOne({_id: id}).exec();
    }

    updateTripById(data, id) {
        return this.Trip.updateOne({_id: id}, { $set: data }).exec();
    }

    deleteTripById(id) {
        return this.Trip.deleteOne({_id: id}).exec();
    }
}