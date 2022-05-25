const express = require("express");
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// user model

const User = require('../models/User');


router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));




// register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body; //destructuring

    let errors = [];

    // check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // check password length
    if (password.length < 6) {
        errors.push({ msg: 'password should be at least 6 charaters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation pass
        User.findOne({ email: email })
            .then(usersd => {
                if (usersd) {
                    // user exists
                    errors.push({ msg: 'User already exists' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newuser = new User({
                        name,
                        email,
                        password
                    });


                    // hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newuser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //  set password to hash
                            newuser.password = hash;
                            //  save user
                            newuser.save()
                                .then(usersd => {
                                    req.flash('success_msg', 'You are now registered');
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err))
                        }))
                }
            })
    }
});

// login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// logout handle
router.get('/logout', (req, res) => {
    req.logOut(err => {
        if (err) {
            throw err;
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });

});

module.exports = router;
