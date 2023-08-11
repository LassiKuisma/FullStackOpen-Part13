const router = require('express').Router();

const { Blog, User } = require('../models');
const { Op } = require('sequelize');

const { userExtractor } = require('../util/userExtractor');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%' + req.query.search + '%',
          },
        },
        {
          author: {
            [Op.iLike]: '%' + req.query.search + '%',
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', userExtractor, async (req, res) => {
  const user = req.user;

  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
  });
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

router.delete('/:id', userExtractor, blogFinder, async (req, res) => {
  const user = req.user;
  const blog = req.blog;
  if (!blog) {
    return res.status(404).send({ error: 'Blog not found' });
  }

  const canDelete = blog.userId === user.id;
  if (canDelete) {
    await blog.destroy();
    return res.status(204).end();
  } else {
    return res
      .status(401)
      .send({ error: 'Cannot delete blogs created by others' });
  }
});

module.exports = router;
