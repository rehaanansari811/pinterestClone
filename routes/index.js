var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require("./multer");
const postModel = require('./post');



passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { nav: false });
});

// register page
router.get('/register', function (req, res, next) {
  res.render('register', { nav: false });
});

// profile page
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user =
    await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts");
  res.render('profile', { user, nav: true });
});

// feed page
router.get('/feed', isLoggedIn, async function (req, res, next) {
  const user = await userModel.find({ username: req.session.passport.user })
  const posts = await postModel.find().populate("user")
  res.render('feed', { user,posts, nav: true });
});

// my all post page
router.get('/user/posts', isLoggedIn, async function (req, res, next) {
  const user = 
  await userModel
  .findOne({ username: req.session.passport.user })
  .populate("posts");
  res.render('usersPost', { user, nav: true });
});

// my detailed pin page
router.get('/image-details/:id', isLoggedIn, async function (req, res, next) {
  const elem = req.params.id;
  res.render('detailedPost',{elem, nav: true});
});

// add post page
router.get('/addpost', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('addpost', { user, nav: true });
});

// Creating a post
router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  })
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


// file upload route
router.post('/fileupload', isLoggedIn, upload.single("profileImage"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect("/profile");
});

// register the user
router.post('/register', function (req, res, next) {
  const user = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.number,
    name: req.body.name
  })

  userModel.register(user, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  })
});

// login the user
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
}), function (req, res, next) {
})

// logout feature
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect("/");
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
