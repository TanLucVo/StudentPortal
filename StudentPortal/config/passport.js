const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')
module.exports = function (passport) {

    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                let username = profile._json.email
                username = username.replace('@student.tdtu.edu.vn',"")
                console.log(username)
                const newUser = {
                    userId: profile.id,
                    name: profile.displayName,
                    image: profile.photos[0].value,
                    type: "student",
                    username:username,
                    password:username
                }

                try {
                    let user = await User.findOne({
                        userId: profile.id
                    })
                    
                    if(profile._json.hd !== "student.tdtu.edu.vn"){
                        done(null, false)
                    }else{
                        if (user) {
                            return done(null, user)
                        } else {
                            user = await User.create(newUser)
                            return done(null, user)
                        }
                    }
                    
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true,
        
        },
        async function(req, username, password, done) {
            try {
                let user = await User.findOne({ username:  username, password: password })
                if(username.trim()==="" || password.trim()===""){
                    return done(null, false,{ message: "Username or password not empty" });
                }
                if (!user)
                    return done(null, false,{ message: "Username or password is incorrect" });
                return done(null, user);
                
            } catch (err) {
                console.error(err)
            }
           
        }));
    

    

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
    })

}