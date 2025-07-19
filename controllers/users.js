const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    console.log("Signup attempt:", req.body);
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log("User registered successfully:", registeredUser.username);
    req.login(registeredUser, (err) => {
      if (err) {
        console.log("Login error after signup:", err);
        return next(err);
      }
      console.log("User logged in successfully after signup");
      req.flash("success", "Welcome to wanderlust!");
      res.redirect("/listings");
    });
  } catch (error) {
    console.log("Signup error:", error.message);
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  console.log("User logged in:", req.user.username);
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl; // Clear the redirect URL from session
  console.log("Redirecting to:", redirectUrl);
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};
