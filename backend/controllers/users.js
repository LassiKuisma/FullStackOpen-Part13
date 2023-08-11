const router = require('express').Router();

const { User, Blog, Session } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.get('/:id', async (req, res) => {
  const where = {};

  if (req.query.read) {
    where.read = req.query.read === 'true';
  }

  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] },
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read'],
          where,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/:username', async (req, res) => {
  const newName = req.body.name;
  if (!newName) {
    return res.status(400).send({ error: 'new name missing' });
  }

  const username = req.params.username;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    return res.status(404).end();
  }

  user.name = newName;
  await user.save();

  res.json(user);
});

router.put('/:id/ban', async (req, res) => {
  const setBanned = req.body.banned;

  if (setBanned === undefined) {
    return res.status(400).send({ error: 'missing whether to ban or unban' });
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  user.disabled = setBanned;
  await user.save();

  if (setBanned) {
    // remove login token
    await Session.destroy({
      where: {
        userId: user.id,
      },
    });
  }

  return res.status(204).end();
});

module.exports = router;
