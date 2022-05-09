require('dotenv').config();
var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
var bcrypt = require('bcryptjs');

var User = require('../models/user');


router.post('/create-account', async function(req, res, next){
  //Get Form Values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  //Form Validation
  // req.checkBody('name', 'Name field is required').notEmpty();
  // req.checkBody('email', 'Email field is required').notEmpty();
  // req.checkBody('email', 'Email is not valid').isEmail();
  // req.checkBody('username', 'Username field is required').notEmpty();
  // req.checkBody('password', 'Password field is required').notEmpty();
  // req.checkBody('password2', 'Passwords do not match ').equals(req.body.password);

  //Check for errors
  // var errors = req.validationErrors();

  // if(errors){
  //   res.send('register',{
  //     errors : errors,
  //     name: name,
  //     email: email,
  //     username: username,
  //     password: password,
  //     password2: password2
  //   });
  // }else{
    try {
      debugger;
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
 
    var newUser =  new User({
      name: name,
      email: email,
      username: username,
      password: hashedPassword
    });
      newUser = await newUser.save();
      return res.status(200).json({success: true, message: "Account created successfully"});
  }catch (e) {
    console.log(e);  
    return res.status(500).json({success: false, error: "Internal server error"});
    
  }    
});
router.post('/login', async(req,res)=>{
  const user = await User.findOne({username: req.body.username});
  if(user === null){
    return res.status(400).send('Cannot find user');
  }
  try{
    if (await bcrypt.compare(req.body.password, user.password)){
      const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
      res.status(200).json({success: true, token: accessToken});

      console.log("Authentication successful");
      res.redirect('/dashboard');
    }
  }catch(e){
    console.log(e);
    res.status(500).send("Some internal error");
  }
})


function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

router.get('/dashboard', authenticateToken, async (req, reply) => {
  return reply.send({});
});
module.exports = router;
