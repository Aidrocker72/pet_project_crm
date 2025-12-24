import * as yup from 'yup';
import { VALIDATION_PATTERNS } from './validation-patterns';
import { CUSTOMER_ERROR_MESSAGES } from './error-messages';

export const CUSTOMER_VALIDATION_SCHEMA = yup.object({
  name: yup
    .string()
    .required(CUSTOMER_ERROR_MESSAGES.NAME_REQUIRED)
    .min(2, CUSTOMER_ERROR_MESSAGES.NAME_MIN_LENGTH),
 email: yup
    .string()
    .email(CUSTOMER_ERROR_MESSAGES.EMAIL_INVALID)
    .required(CUSTOMER_ERROR_MESSAGES.EMAIL_REQUIRED),
  phone: yup
    .string()
    .matches(VALIDATION_PATTERNS.PHONE, CUSTOMER_ERROR_MESSAGES.PHONE_INVALID)
    .nullable(),
  company: yup.string(),
  position: yup.string(),
  notes: yup.string()
});
