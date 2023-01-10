const express = require('express');
const productHelpers = require('../helpers/product-helpers');
const router = express.Router();

const productHelper=require('../helpers/product-helpers');
const userHelper = require('../helpers/user-helper');
const userHelpers=require('../helpers/user-helper')

const emailDB="admin@example.com";
const passwordDB="123"

/* GET users listing. */


router.get('/add-products',(req,res)=>{
  res.render('admin/add-products',{admin:true})
});
router.post('/add-products',(req,res)=>{
  productHelper.addProduct(req.body).then((id) => {
    let image=req.files.image;
    image.mv ('./public/product-images/'+ id +'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-products",{admin:true})
      }
    });
  })
})


router.get('/users',(req,res)=>{
  userHelpers.getAllUsers().then((users)=>{
    res.render('admin/view-users',{admin:true,users})
  })
  
})
router.get('/products',(req,res)=>{
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{products,admin:true})
  })
})

router.get('/add-user',(req,res)=>{

  res.render('admin/add-user',{admin:true})
});

router.post('/add-user',(req,res)=>{
  userHelpers.addUser(req.body)
  res.redirect('/admin/users')
})

router.get('/',(req,res)=>{
  res.render('admin/admin-login')

})
router.post('/submit',(req,res)=>{
 const{email,password}=req.body;
 if(email==emailDB&&password===passwordDB){
  req.session.adminloggedIn=true;
   res.redirect('/admin/products')
 }else{
  res.redirect('/admin')
 }
})
router.get('/addminlogout',(req,res)=>{
  req.session.adminloggedIn=false;
  res.redirect('/admin')
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/products')
  })
})
router.get('/delete-user/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  userHelpers.deleteUser(proId).then((respone)=>{
    res.redirect('/admin/users')
  })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)

  res.render('admin/edit-product',{product,admin:true})
})
router.get('/edit-user/:id',async (req,res)=>{
  let user=await userHelper.getUserdetail(req.params.id)
  res.render('admin/edit-user',{user,admin:true})
})
router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/products')
  })
})
router.post('/edit-user/:id',(req,res)=>{
  userHelper.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin/users')
  })
})
module.exports = router;
