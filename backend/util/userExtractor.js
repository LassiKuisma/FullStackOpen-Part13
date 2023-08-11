const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const { User, Session } = require('../models');

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' });
  }

  const token = authorization.substring(7);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findByPk(decodedToken.id);

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const session = await Session.findByPk(user.id);
  if (!session || session.token !== token) {
    return res.status(401).send({ error: 'Expired token' });
  }

  req.user = user;

  next();
};

module.exports = {
  userExtractor,
};
