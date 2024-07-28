// start by installing npm i passport passport-local passport-local-mongoose mongoose express-session uuid multer


var express = require('express');
var expressSession=require('express-session')
var router = express.Router();
const userModel=require('./users')
const postModel=require("./post")
const passport=require('passport')
const localStrategy=require('passport-local')
const upload=require('./multer')
passport.use(new localStrategy(userModel.authenticate()))

router.get('/', function(req, res) {
  res.render('index', {footer: false});
});

router.get('/login', function(req, res) {
  res.render('login', {footer: false});
});


// req.session ek object generate krta hai and when we write req.session.user means is object mein user name se ek key store hai jiski value yeh return krega 
router.get('/feed', isLoggedIn, async function(req, res) {
  const user=await userModel.findOne({username:req.session.passport.user})
  // jo field ka name hai in mongoose modle woh populate ke within likhna ahi
  const posts=await postModel.find().populate("user")
  res.render('feed', {footer: true,posts,user});
});

router.get('/profile',isLoggedIn, async function(req, res) {
  
  const user=await userModel.findOne({username:req.session.passport.user}).populate("posts")
  res.render('profile', {footer: true,user});
});

router.get('/search', isLoggedIn,function(req, res) {
  res.render('search', {footer: true});
});
router.get("/like/post/:id",isLoggedIn,async function(req,res){
  const user=await userModel.findOne({username:req.session.passport.user})
const post=await postModel.findOne({_id:req.params.id})

if(post.likes.indexOf((user._id)===-1)){
  post.likes.push(user._id)
}
else{
  post.likes.splice(post.likes.indexOf(user._id),1)
}
await post.save()
res.redirect("/feed")
})

router.get('/edit',isLoggedIn,async function(req, res) {
 
  const user=await userModel.findOne({username:req.session.passport.user})
  res.render('edit', {footer: true,user});
});

router.get('/upload', isLoggedIn,function(req, res) {
  res.render('upload', { footer: true, post: { caption: "" } });
});
router.get('/username/:username', isLoggedIn, async function(req, res) {
  // i stands for case insensitive,^means shuruvat aisi ho,$ mean ending kaisi hogi
  const regex =new RegExp(`^${req.params.username}`,'i')
 const users= await userModel.find({username:regex})
res.json(users)
});


// second parameter mein middle ware intervene krta hai depending on succes or failure
router.post('/login',passport.authenticate("local",{
  successRedirect:'/profile',
  failureRedirect:'/login'

}) ,function(req,res){})
router.post('/register',function(req,res){
  var userData=new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    profileImage:req.body.profileImage
    
  })
// pehli line ki wajah se user ka account bn gya
userModel.register(userData,req.body.password).then(function(registereduser){
  
  // is line se account bnte hi woh login hogya
  passport.authenticate("local")(req,res,function(){
    
    // account bnne ke baad woh gya profile route pe
    res.redirect('/profile')
  })

})
})

//next likhna zruri hai
router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err){
      return next(err)
    }
    res.redirect('/')
  })

})





// Handle file upload
// jo input mein name diya hai wohi upload.single mein likhna
router.post('/update', upload.single('image'), async (req, res)=> {
 
  
// Access the uploaded file details via req. file
const user=await userModel.findOneAndUpdate(
// req.body.name given in formfield sends input given in form to backend
// iske syntax parameters mein {kuch bhu unique sa},{data},{new:true}
  {username:req.session.passport.user},
  {username:req.body.username,name:req.body.name,bio:req.body.bio},
  {new:true}
  );
  if(req.file){
    // uploaded img lene ke liye req.file.filename
    user.profileImage=req.file.filename
  }

await user.save()
res.redirect('/profile')





});
router.post("/upload",isLoggedIn,upload.single('image'),async (req,res)=>{
  const user=await userModel.findOne({username:req.session.passport.user})
  const post=await postModel.create({
    picture:req.file.filename,
    // post ko user ki id denui hai
    user:user._id,
    caption:req.body.caption
  })
  // user ko bhi post ki id ddeni hai
  user.posts.push(post._id)
  await user.save()
  res.redirect("/feed")
})

// login ho toh aage bdo nhi toh wapis jao 
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
return next()
  }
  res.redirect('/')
}

module.exports = router;
