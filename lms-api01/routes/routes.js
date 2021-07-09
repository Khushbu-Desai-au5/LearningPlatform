const express = require("express")
const router = express.Router();
const userController = require("../controllers/user")
const courseController = require('../controllers/course')

//<-----------------Home Route -------------->
router.get("/", userController.gotoHomePage)

router.get("/home", userController.homePage)

//<----------------- User Route -------------->
router.post("/api/register", userController.registerUser)
router.post("/api/login", userController.login)
router.get("/api/changeProfile", userController.getChangeProfile)
router.post("/api/changeProfile", userController.putChangeProfile)
router.post("/api/changePassword", userController.changePassword)
router.get("/api/logout",userController.logout)

//<----------------- Course Route -------------->
router.get("/api/createCourse", courseController.getCreateCourse)
router.post("/api/createCourse", courseController.postCreateCourse)

router.get("/api/updateCourse", courseController.getUpdateCourse)
router.post("/api/updateCourse", courseController.updateCourse)

router.get("/api/deleteCourse", courseController.deleteCourse)
router.get("/api/getAllCourse", courseController.getAllCourse)


module.exports = router;