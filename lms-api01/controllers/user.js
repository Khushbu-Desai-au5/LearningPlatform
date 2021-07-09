const DBConnection = require('../db')
const mongodb = require('mongodb')

module.exports.gotoHomePage = (req,res) =>{
    res.render('index')
}

module.exports.homePage = (req,res) => {
    console.log('req',req.query)
    if(req.query.isRegSuccessful){
        res.render('login',{
            isRegSuccessful : req.query.isRegSuccessful
        })
    }else {
        res.render('login',{isRegSuccessful:false})
    }
    
}


module.exports.registerUser = (req, res) => {
    const DB = DBConnection.getDb()
  
  //  console.log('DB',DB)
    var user = {
      name: req.body.name,
      type: req.body.type,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    }
  
    if (user.password !== user.confirmPassword) {
      res.render('login.ejs', {
        isRegSuccessful : false,  
        message: 'Password and Confrim Password does not match.'});

      return
    }
    //console.log(instructors)
    DB.collection("user").find({ email: user.email }).toArray(function (err, users) {
      if (err) {
        console.log("error in find instructor", err)
        res.send(400)
      }
      else {
        console.log('user is ',users)
        if (users.length) {
          res.render('login.ejs', {
            isRegSuccessful : false,  
            message: 'User Already Exists.'});

        }else{
  
          DB.collection('user').insertOne(user)
          .then(result => {
            res.render('login.ejs', {
                isRegSuccessful : true,
                message: 'User Successfully Registerd.'});
        })
          .catch(error => res.send(error))
        }
    }
  })
}

module.exports.login = (req,res) => {
    const DB = DBConnection.getDb()

    var user = {
      email: req.body.email,
      password: req.body.password,
    }
    //console.log(instructors)
    DB.collection("user").find({ email: user.email }).toArray(function (err, users) {
      if (err) {
        console.log("error in find instructor", err)
      }
      else {
        console.log(users)
        if(users.length && 
          users[0].password === user.password ){
            req.session.userId = users[0]._id
          //  res.send(200)
          DB.collection("course").find({createdBy:mongodb.ObjectID(req.session.userId)}).toArray(function (err,courses){
            console.log('courses',courses)
            res.render('dashboard',{courses : courses})

          })
          }else{
            res.send({error:"Invalid passowrd."})
          } 
  
  
        
        }
        // res.render("getinstructor", {
        //     instructors: instructors
        // })
      
    })
  
}


module.exports.getChangeProfile = (req,res) =>{
    const DB = DBConnection.getDb()

    console.log(req.session)
    if(req.session.userId){
      
      //console.log(instructors)
      DB.collection("user").find({ _id: mongodb.ObjectID(req.session.userId) }).toArray(function (err, users) {
        if (err) {
          console.log("error in find instructor", err)
        }
        else {
          if(users.length){ 
                 res.render("editProfile",{users:users[0]})
            
                }else{
                  res.send({error:"Invalid Session."})
                }
          }
      })
    }else{
      res.send({error:"user not loggged in."})
    }
    
}


module.exports.putChangeProfile = (req,res) =>{
    const DB = DBConnection.getDb()

    const updatedUser = {
      name: req.body.name,
      email: req.body.email
    }
    if(req.session.userId){
      
      //console.log(instructors)
      DB.collection("user").find({ _id: mongodb.ObjectID(req.session.userId) }).toArray(function (err, users) {
        if (err) {
          console.log("error in find user", err)
        }
        else {
          console.log(users)
          if(users.length){ 
                
            DB.collection("user").findOneAndUpdate({_id:mongodb.ObjectID(req.session.userId)}, {$set: updatedUser}, { returnOriginal: false },function(err, result) {
              if (err) throw err;
              res.render("editProfile",{users:result.value})

            });
                }else{
                  res.send({error:"Invalid Session."})
                }
          }
          
        })
    }else{
      res.send({error:"user not loggged in."})
    }
    
}

module.exports.changePassword = (req,res) =>{
    const DB = DBConnection.getDb()

  const updatedUser = {
    password: req.body.psw,
    confirmPassword: req.body.confirmpsw
  }
  if (updatedUser.password !== updatedUser.confirmPassword) {
    res.send({ error: "Password and Confirm Password does not match." })
    return
  }
  // console.log(req.session)
  if(req.session.userId){
    
    //console.log(instructors)
    DB.collection("user").find({ _id: mongodb.ObjectID(req.session.userId) }).toArray(function (err, users) {
      if (err) {
        console.log("error in find user", err)
      }
      else {
        if(users.length){ 
              
          DB.collection("user").findOneAndUpdate({_id:mongodb.ObjectID(req.session.userId)}, {$set :updatedUser}, { returnOriginal: false }, function(err, result) {
            if (err) throw err;
            console.log('result',result)
            res.render("editProfile",{users:result.value})
          });
              }else{
                res.send({error:"Invalid Session."})
              }  
            }   
    })
  }else{
    res.send({error:"user not loggged in."})
  }
  
}

module.exports.logout = (req,res) =>{
  req.session.destroy(); 
  res.render('index')
}