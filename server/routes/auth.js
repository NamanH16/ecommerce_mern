const { Router } = require('express');
const authController = require("../controllers/authControllers");
const router = Router();
const auth = require("../middleware/auth");

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.get('/user', auth, authController.get_user);

/*Now, you may be wondering that we missed the logout route, but we do not need it. We will be using Local Storage for storing our JWT 
Token which handles it on the client side so we will handle logout of users on client side directly. We do not need to deal with server
for this purpose. */

module.exports = router;

/*
1. register — This route handles a post request in which a user provides his name, email and password for registering in our system.
2. login — This route handles the user login part of the website. It allows users to log in and check whether the credentials are correct.
3. user — This route is a get request, and we try to retrieve whether a user is logged in or not using this route.
*/