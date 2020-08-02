const isNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash('error', 'Sorry, but you are already logged in!');
      res.redirect('/');
    } else {
      return next();
    }
  };
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'Sorry, but you must be registered first!');
      res.redirect('/');
    }
  };

  module.exports = {isNotAuthenticated: isNotAuthenticated, isAuthenticated: isAuthenticated}

  