const { check, validationResult } = require('express-validator');

const validateCreatePlayer = [
  check('name')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Name can not be empty!')
    .isLength({ min: 2 })
    .withMessage('Minimum 2 characters required!')
    .escape(),

  check('jersey').trim().not().isEmpty().withMessage('No jersey?').escape(),

  check('position').trim().not().isEmpty().withMessage('No position?').escape(),

  check('team').trim().not().isEmpty().withMessage('No team?').escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

const validateGetPlayer = [
  check('q')
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  validateCreatePlayer,
  validateGetPlayer
};
