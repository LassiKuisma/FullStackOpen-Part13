const router = require('express').Router();

const { Blog, User, ReadingList } = require('../models');

const { userExtractor } = require('../util/userExtractor');

router.post('/', async (req, res) => {
  const userId = req.body.userId;
  const blogId = req.body.blogId;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const blog = await Blog.findByPk(blogId);

  if (!blog) {
    return res.status(404).send({ error: 'Blog not found' });
  }

  const listItem = await ReadingList.create({
    userId: user.id,
    blogId: blog.id,
    read: false,
  });

  res.json(listItem);
});

router.put('/:id', userExtractor, async (req, res) => {
  const markedAsRead = req.body.read;

  if (markedAsRead === undefined) {
    return res.status(400).send({
      error: "Request didn't specify whether to mark blog as read or unread",
    });
  }

  const blogId = req.params.id;

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(404).send({ error: 'Blog not found' });
  }

  const user = req.user;

  const entry = await ReadingList.findOne({
    where: {
      userId: user.id,
      blogId: blog.id,
    },
  });

  if (!entry) {
    return res.status(404).send({ error: 'Entry not found' });
  }

  entry.read = markedAsRead;
  await entry.save();

  res.json(entry);
});

module.exports = router;
