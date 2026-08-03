import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

const auditLogFilterSchema = yup.object().shape({
  search: yup
    .string()
    .nullable()
    .notRequired()
    .trim(),
  from: yup
    .string()
    .nullable()
    .notRequired()
    .test('valid-date', 'Ngày bắt đầu không hợp lệ', value => {
      if (!value || value.trim() === '') return true;
      return !isNaN(Date.parse(value));
    })
    .test('not-future', 'Ngày bắt đầu không được là ngày trong tương lai', value => {
      if (!value || value.trim() === '') return true;
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return new Date(value) <= today;
    }),
  to: yup
    .string()
    .nullable()
    .notRequired()
    .test('valid-date', 'Ngày kết thúc không hợp lệ', value => {
      if (!value || value.trim() === '') return true;
      return !isNaN(Date.parse(value));
    })
    .test('not-future', 'Ngày kết thúc không được là ngày trong tương lai', value => {
      if (!value || value.trim() === '') return true;
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return new Date(value) <= today;
    })
    .test('date-range', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
      const { from } = this.parent;
      if (!from || !value || from.trim() === '' || value.trim() === '') return true;
      return new Date(value) >= new Date(from);
    }),
});

export async function validateAuditLogFilter(data) {
  const result = await validateSchema(auditLogFilterSchema, data);
  return { isValid: result.valid, errors: result.errors };
}
