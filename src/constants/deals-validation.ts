import * as yup from 'yup';
import { DEAL_ERROR_MESSAGES } from './error-messages';

export const DEALS_VALIDATION_SCHEMA = yup.object({
  title: yup.string().required(DEAL_ERROR_MESSAGES.TITLE_REQUIRED).min(2, DEAL_ERROR_MESSAGES.TITLE_MIN_LENGTH),
  description: yup.string(),
  customerId: yup.string().required(DEAL_ERROR_MESSAGES.CUSTOMER_REQUIRED),
  pipelineId: yup.string().required(DEAL_ERROR_MESSAGES.PIPELINE_REQUIRED),
 stageId: yup.string().required(DEAL_ERROR_MESSAGES.STAGE_REQUIRED),
  value: yup.number().positive(DEAL_ERROR_MESSAGES.VALUE_POSITIVE).required(DEAL_ERROR_MESSAGES.VALUE_REQUIRED),
  probability: yup.number().min(0, DEAL_ERROR_MESSAGES.PROBABILITY_MIN).max(100, DEAL_ERROR_MESSAGES.PROBABILITY_MAX).required(DEAL_ERROR_MESSAGES.PROBABILITY_REQUIRED),
  closeDate: yup.date()
});
