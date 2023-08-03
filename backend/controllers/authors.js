const router = require('express').Router();
const { Blog } = require('../models');
const { fn, col } = require('sequelize');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('author')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  });

  res.json(blogs);
});

module.exports = router;
