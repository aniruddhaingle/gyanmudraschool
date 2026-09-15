import { validationResult } from "express-validator";

export function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    message: result.array({ onlyFirstError: true })[0].msg
  });
}
