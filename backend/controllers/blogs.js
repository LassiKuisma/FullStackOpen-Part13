const router = require('express').Router();

const { Blog } = require('../models');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

router.get('/:id', blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.put('/:id', blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    blog.likes = Number(req.body.likes);
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.delete('/:id', blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    await blog.destroy();
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

module.exports = router;
