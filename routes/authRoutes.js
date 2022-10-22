const { Router } = require("express"),
  router = Router(),
  authController = require("../controllers/authController");

// router.get("/signup", () => {});
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

module.exports = router;
