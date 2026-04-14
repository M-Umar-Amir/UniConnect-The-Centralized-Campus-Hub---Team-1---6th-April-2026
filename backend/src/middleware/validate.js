
export function validate(validatorFn) {
  return function validationMiddleware(req, _res, next) {
    try {
      validatorFn(req.body, req.query, req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
}
