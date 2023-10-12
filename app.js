"use strict";
// create an express app
const express = require("express")
const session = require('express-session')
const app = express()
var path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require("./model/user")
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const methodOverride = require('method-override');
const res = require("express/lib/response");
const req = require("express/lib/request");
const multer = require('multer');
const passport = require('passport');
const flash = require('express-flash');
const {
	redirect
} = require("express/lib/response");
const getAllUsers = require('./public/scripts/leaderboard.js')
const getAllInfo = require('./public/scripts/admin.js')
const Timeline = require("./model/timeline");
const {
	request
} = require("https");
const {
	assert
} = require("console");
const fs = require('fs');



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads')
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString().replace(/:|\./g, '') + ' - ' + file.originalname);
	}
});


const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};


const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 10
	},
	fileFilter: fileFilter
});

app.set('view-engine', 'ejs');





mongoose.connect('mongodb+srv://Khn167:mlhch6IIJRXmUzU4@cluster0.2afy9.mongodb.net/COMP2800', {
		useNewUrlParser: true,
		useUnifiedTopology: true,

	}


);

app.use(express.urlencoded({
	extended: false
}));

app.use(require("express-session")({
	secret: 'secret',
	resave: false,
	saveUninitialized: false,
}))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

app.use(flash());


// use the express-static middleware
app.use(express.static(path.join(__dirname, './public')));

app.use('/uploads', express.static('uploads'));

app.get('/dashboard', checkAuthenticated, async (req, res) => {
	let usertype = req.user.userType
	if (usertype === "admin") {
		return res.redirect('/admin')
	}
	res.render(path.join(__dirname, '/public/views/dashboard.ejs'), {
		users: await getAllInfo(),
		name: req.user.firstname
	});
})

app.get('/login', checkLoggedIn, (req, res) => {
	res.render(path.join(__dirname, '/public/views/loginpage.ejs'))
})

app.get('/admin', checkAuthenticated, async (req, res) => {
	let usertype = req.user.userType
	if (usertype === "user") {
		return res.redirect('/dashboard')
	}
	res.render(path.join(__dirname, '/public/views/admin.ejs'), {
		users: await getAllInfo(),
		namef: req.user.firstname,
		user: req.user.username,
		namel: req.user.lastname,
		usertype: req.user.userType,
		pass: req.user.password
	});
})



app.post('/admin', (req, res, ) => {
	const updateData = req.body;
	if (!updateData) {
		res.status(444).send({
			"message": "please provide what you want to update"
		})
	}
	User.findOne({
		username: req.user.username
	}, (err, user) => {

		if (typeof updateData.username !== 'undefined') {
			user.username = updateData.username;
		}

		if (typeof updateData.firstname !== 'undefined') {
			user.firstname = updateData.firstname;
		}

		if (typeof updateData.lastname !== 'undefined') {
			user.lastname = updateData.lastname;
		}

		if (typeof updateData.userType !== 'undefined') {
			user.userType = updateData.userType;
		}

		user.save();
		res.redirect('/admin');
	})

});
//renders the math game instruction
app.get('/mathInstruction', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/mathInstruction.ejs'))
})
//renders the memory game instruction
app.get('/memoryInstruction', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/memoryInstruction.ejs'))
})
//renders the geography game instruction
app.get('/geographyInstruction', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/geographyInstruction.ejs'))
})
//renders the memory game
app.get('/memoryGame', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/memoryGame.ejs'))
})
//renders the geography game
app.get('/geographyGame', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/geographyGame.ejs'))
})
//renders the math game
app.get('/mathgame', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/mathgame.ejs'));
})
//renders the math final score
app.get('/mathFinalScore', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/mathFinalScore.ejs'),{Highscore: req.user.mathGameHighscore});
})

//renders the memory final score
app.get('/memoryFinalScore', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/memoryFinalScore.ejs'), {Highscore: req.user.memoryGameHighscore});
})

//renders the geography final score
app.get('/geographyFinalScore', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/geographyFinalScore.ejs'), {Highscore: req.user.geographyGameHighscore});
})


app.get('/leaderboard', checkAuthenticated, async (req, res) => {
	res.render(path.join(__dirname, '/public/views/leaderboard.ejs'), {
		users: await getAllUsers(),
		userLoggedIn: req.user.username
	});

});


// renders the user profile page and gets the user info to populate to the website.
app.get('/userProfile', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/userProfile.ejs'), {
		avatarImage: req.user.avatarImage,
		namef: req.user.firstname,
		user: req.user.username,
		namel: req.user.lastname,
		pass: req.user.password
	});
})

// allows the user to update their profile through the user profile page.
app.post('/userProfile', upload.single('avatarImage'), async (req, res, next) => {
	const updateData = req.body;
	if (!updateData) {
		res.status(444).send({
			"message": "please provide what you want to update"
		})
	}
	User.findOne({
		username: req.user.username
	}, (err, user) => {

		if (typeof updateData.username !== 'undefined') {
			user.username = updateData.username;
		}

		if (typeof updateData.firstname !== 'undefined') {
			user.firstname = updateData.firstname;
		}

		if (typeof updateData.lastname !== 'undefined') {
			user.lastname = updateData.lastname;
		}

		if (req.file == undefined) {
		} else {
			user.avatarImage = req.file.path;
		}


		if (typeof updateData.password !== '') {
			user.setPassword(req.body.password, function(err,users){
				if(req.body.password == ''){
					next();
				} else {
					User.updateOne({_id: req.user._id }, {hash: users.hash, salt: users.salt} ,
						(err,result) => {
							if(err) {
								console.log(err);
							} else {
								console.log('success');
							}
						})
				}
				
			})
		}
		user.save();
		res.redirect('/login');
	})


});


function checkLogin(req, res, next) {
	req.checkBody('username', 'username is required').notEmpty();
	req.checkBody('password', 'password is required').notEmpty();

	var errors = req.validationErrors();
	
	if(errors) {
		res.render
	}
}


app.post('/login', checkLoggedIn, passport.authenticate("local", {
	successRedirect: '/dashboard',
	failureRedirect: '/login',
	failureFlash: true,
}), function (req, res) {

});

app.get('/register', checkLoggedIn, (req, res) => {
	res.render(path.join(__dirname, '/public/views/signup.ejs'))

})

app.post('/register', checkLoggedIn, (req, res) => {
	console.log(req.file);
	User.register(new User({
		username: req.body.username,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		userType: req.body.usertype = 'user',
		mathGameHighscore: req.body.mathGameHighscore = 0,
		memoryGameHighscore: req.body.memoryGameHighscore = 0,
		geographyGameHighscore: req.body.geographyGameHighscore = 0
	}), req.body.password, function (err, user) {
		if (err) {
			console.log(err);
			return res.redirect('/register')
		}
		passport.authenticate("local")(req, res, function () {
			res.redirect("/login");
		});
	});
});




app.delete('/logout', (req, res) => {
	req.logOut()
	res.redirect('/login')
})

app.get('/newPost', checkAuthenticated, (req, res) => {
	res.render(path.join(__dirname, '/public/views/newPost.ejs'), {
		user: req.user.username
	});
})




app.post('/newPost', upload.single('image'), checkAuthenticated, async (req, res) => {
	if (req.file == undefined) {
		filename = "default-avatar.png";
	}


	let timeline = new Timeline({
		title: req.body.title,
		user: req.user.username,
		description: req.body.description,
		img: req.file.filename
	})

	try {
		timeline = await timeline.save()
		res.redirect('/showTimeline');
	} catch (error) {
		console.log(error)
		res.redirect('/newPost');

	}
});


app.get('/showTimeline', checkAuthenticated, async (req, res) => {
	let timelines = await Timeline.find({
		user: req.user.username
	}).sort({
		timeCreated: 'desc'
	});
	res.render(path.join(__dirname, '/public/views/showTimeline.ejs'), {
		timelines: timelines,
		avatarImage: req.user.avatarImage
	});
	console.log(req.user.avatarImage)
})

app.post("/do-delete", async (req, res) => {
	await Timeline.findByIdAndDelete(req.body._id);
})

app.post("/get-mathscore", ( req, res) => {
	res.send(req.body.mathGameHighscore);
	User.findOne({ username: req.user.username }, (err, user) => {
		if(user.mathGameHighscore < req.body.mathGameHighscore){
			user.mathGameHighscore = req.body.mathGameHighscore;
			user.save();
		}
	})

})

app.post("/get-memoryGame", ( req, res) => {
	res.send(req.body.memoryGameHighscore);
	User.findOne({ username: req.user.username }, (err, user) => {
		if(user.memoryGameHighscore < req.body.memoryGameHighscore){
			user.memoryGameHighscore = req.body.memoryGameHighscore;
			user.save();
		}
	})
})

app.post("/get-geographyGame", ( req, res) => {
	res.send(req.body.geographyGameHighscore);
	User.findOne({ username: req.user.username }, (err, user) => {
			if(user.geographyGameHighscore < req.body.geographyGameHighscore){
				user.geographyGameHighscore = req.body.geographyGameHighscore;
				user.save();
			}
	})
})

// define the first route
app.get("/", function (req, res) {
	res.render(path.join(__dirname, '/public/views/index.ejs'));
});

// checks if the user is logged in through passport js and if not redirects them to login.
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

function checkLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/dashboard')
	}
	next()
}






// start the server listening for requests
app.listen(process.env.PORT || 8000,
() => console.log("Server is running..."));