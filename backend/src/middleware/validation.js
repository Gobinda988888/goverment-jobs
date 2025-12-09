const Joi = require('joi');

/**
 * Validation middleware using Joi
 */

// Job validation schema
const jobSchema = Joi.object({
  title: Joi.string().required().trim().min(5).max(200),
  organization: Joi.string().required().trim(),
  department: Joi.string().trim().allow(''),
  notificationText: Joi.string().required().min(50),
  notificationUrl: Joi.string().uri().allow(''),
  applicationUrl: Joi.string().uri().allow(''),
  pdfUrl: Joi.string().uri().allow(''),
  category: Joi.string().valid(
    'Engineering',
    'Teaching',
    'Police',
    'Medical',
    'Banking',
    'Railway',
    'Administrative',
    'Other'
  ),
  status: Joi.string().valid('upcoming', 'active', 'closed', 'result_declared'),
  isFeatured: Joi.boolean(),
  isVerified: Joi.boolean()
});

// MongoDB ObjectId validation
const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

/**
 * Validate job creation/update data
 */
exports.validateJob = (req, res, next) => {
  const { error } = jobSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }

  next();
};

/**
 * Validate MongoDB ObjectId in params
 */
exports.validateJobId = (req, res, next) => {
  const { error } = objectIdSchema.validate(req.params.id);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid job ID format'
    });
  }

  next();
};

/**
 * Validate query parameters
 */
exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        errors
      });
    }

    next();
  };
};
