const DBConnection = require('../db')
const mongodb = require('mongodb')
module.exports.getCreateCourse = (req,res) =>{
        res.render('createCourse')
}

module.exports.postCreateCourse  = (req,res) =>{

    const DB = DBConnection.getDb()

    const course = {
      name: req.body.courseName,
      category: req.body.category,
      oneLiner: req.body.oneLine,
      duration: req.body.hours,
      language: req.body.language,
      description:req.body.description,
      lessons:req.body.lessons,
      photo:req.body.photo
    }
    if(req.session.userId){
  
      course.createdBy = mongodb.ObjectID(req.session.userId)
      DB.collection("course").insertOne(course, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });
      
      res.redirect("/api/getAllCourse")
    
    }else{
          res.send({error:"Invalid Session."})
    }
}

module.exports.getUpdateCourse = (req,res) =>{
  const DB = DBConnection.getDb()
  DB.collection("course").find({_id:mongodb.ObjectID(req.query.id)}).toArray(function (err, course) {
      if(course.length){
        console.log('myCourse',course)
        res.render("updateCourse",{course:course[0]})

      }else{
        console.log('not found')
        res.redirect("/api/getAllCourse")
      }
  
  })

}

module.exports.updateCourse = (req,res) =>{

    const DB = DBConnection.getDb()

    const updatedCourse = {
      name: req.body.courseName,
      category: req.body.category,
      oneLiner: req.body.oneLine,
      duration: req.body.hours,
      language: req.body.language,
      description:req.body.description,
      lessons:req.body.lessons,
      photo:req.body.photo
    }
    if(req.session.userId){
  
      DB.collection("course").find({_id:mongodb.ObjectID(req.body.id)}).toArray(function (err, course) {
        if (err) throw err;
  
        if(course.length){
          course.createdBy = mongodb.ObjectID(req.session.userId)
          console.log('')
          DB.collection("course").updateOne({_id:mongodb.ObjectID(req.body.id)}, {$set :updatedCourse}, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
          res.redirect("/api/getAllCourse")
  
          }else{
                res.send({error:"No Course Found"})
              } 
        
      })
    
    }else{
          res.send({error:"Invalid Session."})
    }
}

module.exports.deleteCourse = (req,res) =>{
    const DB = DBConnection.getDb()

  const course = {
    id : req.query.id,
  }
  if(req.session.userId){

    DB.collection("course").deleteOne({_id:mongodb.ObjectID(course.id)},function (err, course) {
      if (err) throw err;
      res.redirect("/api/getAllCourse")
    })
  }else{
        res.send({error:"Invalid Session."})
  }
}

module.exports.getAllCourse = (req,res) =>{
    const DB = DBConnection.getDb()

    if(req.session.userId){
  
      DB.collection("course").find({createdBy:mongodb.ObjectID(req.session.userId)}).toArray(function (err, courses) {
        if (err) throw err;
        res.render('dashboard',{courses : courses})

      })
    }else{
          res.send({error:"Invalid Session."})
    } 
}