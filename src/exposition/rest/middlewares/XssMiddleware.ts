/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction,Request, Response } from "express";
import { isArray,isPlainObject, isString } from "lodash";
import xss from "xss";

interface AnyObject {
  [key: string]: any;
}

type SanitizedValue = string | AnyObject | any[];

const sanitizeString = (data: string): string => xss(data);

const sanitizeArray = (array: any[]): SanitizedValue[] =>
  array.map((value) => sanitizeValue(value));

const sanitizeObject = (object: AnyObject): AnyObject => {
  const sanitizedObject: AnyObject = {};
  Object.keys(object).forEach((key) => {
    sanitizedObject[key] = sanitizeValue(object[key]);
  });
  return sanitizedObject;
};

const sanitizeValue = (value: any): SanitizedValue => {
  let sanitizedValue: SanitizedValue;
  if (isArray(value)) {
    sanitizedValue = sanitizeArray(value);
  } else if (isPlainObject(value)) {
    sanitizedValue = sanitizeObject(value);
  } else if (isString(value)) {
    sanitizedValue = sanitizeString(value);
  } else {
    sanitizedValue = value;
  }
  return sanitizedValue;
};

/**
 * Nettoie la requête entrante pour prévenir des failles XSS
 * @param {Object} req - La requête
 * @param {Object} _res - La réponse
 * @param {function} next - Le middleware suivant
 */
const preventXss = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.headers) {
    req.headers = sanitizeObject(req.headers);
  }
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

export default preventXss;
