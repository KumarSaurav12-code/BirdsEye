var express                        = require("express");
var app                            = express();
var bodyParser                     = require("body-parser");
var passport                       = require("passport");
var mongoose                       = require("mongoose");
var LocalStrategy                  = require("passport-local");
var passportLocalMongoose          = require("passport-local-mongoose");
var User                           = require("./models/user");
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true,useUnifiedTopology: true }, function(err, db) {
    if (err) {
        return console.log('Unable to connect MongoDB Server');
    }
    console.log('Connected to MongoDB server');
});

mongoose.set('useCreateIndex', true)
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("Public"));

app.use(require("express-session")({
    secret: "I want a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//===================================//

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/signup", function(req, res){
    res.render("signup.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/profile", function(req, res){
    res.render("profile.ejs");
});


//====================================//

app.post("/signup", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.render("profile.ejs");
        });
    });
});


app.post("/login", passport.authenticate("local", {
    successRedirect:"/profile",
    failureRedirect:"/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});




app.listen("3000", function(){
    console.log("server started")
});