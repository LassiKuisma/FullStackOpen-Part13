const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const router = require('express').Router();

const { Blog, User } = require('../models');
const { Op } = require('sequelize');

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
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
    attributes: { exclude: ['uderId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
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

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = req.blog;
  if (!blog) {
    return res.status(404).send({ error: 'Blog not found' });
  }
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
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
