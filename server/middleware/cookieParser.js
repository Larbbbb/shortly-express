const parseCookies = (req, res, next) => {

  if (req.headers.cookie !== undefined) {
    var pieces = req.headers.cookie.split(['; ']);
    var crumbs = [];

    for (var i = 0; i < pieces.length; i++) {
      var crumbs = pieces[i].split(['=']);
      req.cookies[crumbs[0]] = crumbs[1];
    }
  }
  next();
};

module.exports = parseCookies;