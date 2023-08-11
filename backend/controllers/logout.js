const router = require('express').Router();
const { userExtractor } = require('../util/userExtractor');
const { Session } = require('../models');

router.delete('/', userExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.user.id,
    },
  });

  return res.status(204).end();
});

module.exports = router;
