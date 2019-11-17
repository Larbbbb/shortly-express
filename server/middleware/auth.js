const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {

  models.Sessions.create()
    .then(({ insertId }) => {
      return models.Sessions.get({ id: insertId });
    })
    .then((sessionRow) => {
      req.session = sessionRow;
      res.cookie('shortlyid', sessionRow.hash);

      if (req.cookies === undefined || Object.keys(req.cookies).length === 0) {
        // return {userId: };
        throw err;
      } else {
        return models.Sessions.get({hash: req.cookies.shortlyid });
      }
    })
    .then((oldSessionRow) => {

      models.Sessions.update({ hash: res.cookies.shortlyid.value }, { userId: oldSessionRow.userId});

      req.session.userId = oldSessionRow.userId;

      models.Sessions.delete({ id: oldSessionRow.id });

      return models.Users.get({ id: req.session.userId });

    })
    .then((userRow) => {

      req.session.user = { username: userRow.username };
      next();

    })
    .catch(() =>{
      // console.log('errored out');
      next();
    });

};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

