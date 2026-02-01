
 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
  });
 const passport = require("passport");
 const LocalStrategy = require("passport-local").Strategy;

 passport.use(
 new LocalStrategy({ usernameField: "email"}, async (email, password, done) => {
  try {
   const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
   const user = rows[0];
  if (!user) {
  return done(null, false, { message: "The user with the email does not exist"});
  }
   const compare = await bcrypt.compare(password, user.password);

 if (!compare) {
 return done(null, false, { message: "Incorrect password"});
  }
 return done(null, user);
 } catch (err) {
 done(err);
  }

     })
   );

passport.serializeUser( (user, done) => {
  done(null, user.user_id);
  });

passport.deserializeUser( async (user_id, done) => {
try {
const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
const user = rows[0];
done(null, user);
} catch (err) {
 done(err);
}

});


module.exports = passport;
