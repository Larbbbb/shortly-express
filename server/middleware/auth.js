const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {


  models.Sessions.create()
    .then(({ insertId }) => {
      return models.Sessions.get({ id: insertId });
    })
    .then((sessionRow) => {
      req.session = sessionRow;
      res.cookies['shortlyid'] = { value: sessionRow.hash };

      if (Object.keys(req.cookies).length === 0) {
        throw err;
      } else {
        return models.Sessions.get({hash: req.cookies.shortlyid });
      }
    })
    .then((oldSessionRow) => {

      models.Sessions.update({ hash: res.cookies.shortlyid.value }, { userId: oldSessionRow.userId});

      req.session.userId = oldSessionRow.userId;

      return models.Users.get({ id: oldSessionRow.userId });

    })
    .then((userRow) => {

      req.session.user = { username: userRow.username };
      next();

    })
    .catch(() =>{
      next();
    });

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

