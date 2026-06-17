require('dotenv').config();
const express =require('express')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hbs=require('hbs')
const route=require('./routes/main')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const fileUpload = require('express-fileupload');
const { handlebars } = require('hbs');
require("./handlebar")//this hbs user made handlebars
const app=express();

app.use(helmet({
    contentSecurityPolicy: false,
}));

// Serve static folder before rate limiter so images/css don't trigger the limit
app.use("/static",express.static("public"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500, // Increased to 500
});
app.use(limiter);

app.use(fileUpload())
app.use(session({
    secret: process.env.SESSION_SECRET || "restorent_datails"
}))
app.use(bodyParser.urlencoded({
    extended:true
}))

app.use('',route)
//static folder served above
//template engine
app.set("view engine",'hbs')
app.set("views",'views')
//app.set("views","")
hbs.registerPartials('views/partials')





mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/restorent",()=>{
    console.log("Server connected..");
})
const PORT = process.env.PORT || 5656;
app.listen(PORT,()=>{
    console.log('server is start..')
})