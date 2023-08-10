const router = require('express').Router();

const { Blog, User, ReadingList } = require('../models');

const { tokenExtractor } = require('../util/tokenExtractor');

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

router.put('/:id', tokenExtractor, async (req, res) => {
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

  const user = await User.findByPk(req.decodedToken.id);

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const entry = await ReadingList.findOne({
    where: {
      userId: user.id,
      blogId: blog.id,
    },
  });

  entry.read = markedAsRead;
  await entry.save();

  res.json(entry);
});

module.exports = router;
