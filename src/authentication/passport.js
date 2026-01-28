
 const bcrypt = require("bcryptjs");
 const { Pool } = require("pg");
 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
  });
 const passport = require("passport");
 const LocalStrategy = require("passport-local").Strategy;

 passport.use({ usernameField: "email"},
 new LocalStrategy(async (username, password, done) => {
  try {
   const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
   const user = rows[0];
   const compare = await bcrypt.compare(password, user.password);
 if (!user) {
  return done(null, false);
  }

 if (!compare) {
 return done(null, false);
  }
 return done(null, user);
 } catch (err) {
 done(err);
  }

     })
   );

passport.serializeUser(user, done) {
  done(null, user.user_id);
  }

passport.deserializeUser(user_id, done) {
try {
const { rows } = await pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
const user = rows[0];
done(null, user);
} catch (err) {
 done(err);
}

}


module.exports = passport;
