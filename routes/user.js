const { response } = require('express');
var express = require('express');
const session = require('express-session');
const router = express.Router();
const productHelpers=require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helper')

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  let userd=req.session.user
  productHelpers.getAllProducts().then((products)=>{
    res.render('user/view-products',{products,user:true,userd})
  })
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{"logginErr":req.session.logginErr,"loginvalid":req.session.user1})
    req.session.logginErr=false;
    req.session.user1=false;
  }
  
});
router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response){
      req.session.user1=true;
      res.redirect('/login')
    }else{
    
    res.render('user/signup-success')
    }
   
  })
})
router.post('/login',(req,res)=>{

  userHelpers.doLogin(req.body).then((response)=>{
    if(response){
      req.session.loggedIn=true
      req.session.user=response.user

      res.redirect('/')
    }
    else{
      res.redirect('/login')
    }
  })
})
router.get('/logout',verifyLogin,(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',(req,res)=>{
  res.render('user/cart')
})

router.get('/back',(req,res)=>{
  res.redirect('/login')
})

module.exports = router;
