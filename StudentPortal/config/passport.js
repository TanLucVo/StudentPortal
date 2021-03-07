const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const Student = require('../models/student')
module.exports = function (passport) {
    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newStudent = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                }

                try {
                    let student = await Student.findOne({
                        googleId: profile.id
                    })

                    if (student) {
                        done(null, student)
                        console.log("User da tao")
                    } else {
                        student = await Student.create(newStudent)
                        console.log("User chua tao")
                        done(null, student)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )
    passport.serializeUser((student, done) => {
        done(null, student.id)
      })
    
      passport.deserializeUser((id, done) => {
        Student.findById(id, (err, student) => done(err, student))
      })
}