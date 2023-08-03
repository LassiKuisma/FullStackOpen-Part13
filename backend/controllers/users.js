const router = require('express').Router();

const { User, Blog } = require('../models');

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
  const user = await User.findByPk(req.params.id);
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

module.exports = router;
