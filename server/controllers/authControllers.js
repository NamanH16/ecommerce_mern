const User = require("../models/User");
const jwt = require("jsonwebtoken"); //we require the jsonwebtoken in our file to 
//create the JSON Web Tokens we need to store to verify whether a user has been authenticated.
const config = require("config");
const bcrypt = require('bcrypt');

// Registration function 
module.exports.signup = (req,res) => {
    const { name, email, password } = req.body; //deconstruct the name, email and password fields from the request body, 
                                                //which is being passed over to us with the API request.
    if(!name || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }

    User.findOne({email})
    .then(user => {
        if(user) return res.status(400).json({msg: 'User already exists'});

        const newUser = new User({ name, email, password });

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save() // Saving the user in the database
                    .then(user => {
                        jwt.sign(
                            { id: user._id },
                            config.get('jwtsecret'), // we need to create a signed JWT token to be stored in the local storage. 
                            { expiresIn: 3600 }, // We create the token by providing the user id, a JWT secret and the expiry time.
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,  // We then send the token as a response along with the user details without the password
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email
                                    }
                                });
                            }
                        )
                    });
            })
        })
    })
}

module.exports.login = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }
    User.findOne({email})
        .then(user => {
            if(!user) return res.status(400).json({msg: 'User does not exist'});

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'});

                    jwt.sign(
                        { id: user._id },
                        config.get('jwtsecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                })
        })
}

// retrieves a user object from a database based on the id property of the authenticated user in the req object. 
// The retrieved user object is then returned in a JSON response to the client 
module.exports.get_user = (req,res) => {
    User.findById(req.user.id)
        .select('-password') // the password property removed from the object using the select method.
        .then(user => res.json(user));
}