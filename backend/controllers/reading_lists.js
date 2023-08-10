const router = require('express').Router();

const { Blog, User, ReadingList } = require('../models');

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

module.exports = router;
