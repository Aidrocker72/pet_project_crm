import * as yup from 'yup';
import { VALIDATION_PATTERNS } from './validation-patterns';
import { ERROR_MESSAGES } from './error-messages';

export const CUSTOMER_VALIDATION_SCHEMA = yup.object({
  name: yup
    .string()
    .required(ERROR_MESSAGES.NAME_REQUIRED)
    .min(2, ERROR_MESSAGES.NAME_MIN_LENGTH),
 email: yup
    .string()
    .email(ERROR_MESSAGES.EMAIL_INVALID)
    .required(ERROR_MESSAGES.EMAIL_REQUIRED),
  phone: yup
    .string()
    .matches(VALIDATION_PATTERNS.PHONE, ERROR_MESSAGES.PHONE_INVALID)
    .nullable()
    .required(ERROR_MESSAGES.PHONE_INVALID),
  company: yup.string(),
  position: yup.string(),
  notes: yup.string()
});
