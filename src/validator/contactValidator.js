import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";


export const contactSchema = yup.object().shape({
  tenDonVi: yup
    .string()
    .required('Tên đơn vị không được để trống'),

  diaChi: yup
    .string()
    .required('Địa chỉ không được để trống'),

  soDienThoai: yup
    .string()
    .required('Số điện thoại không được để trống'),

  email: yup
    .string()
    .required('Email không được để trống'),

  gioLamViec: yup.object().shape({
    buoi_sang: yup.object().shape({
      tu: yup
        .string()
        .required('Giờ bắt đầu buổi sáng không được để trống')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ phải có định dạng HH:mm (ví dụ: 07:30)'),

      den: yup
        .string()
        .required('Giờ kết thúc buổi sáng không được để trống')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ phải có định dạng HH:mm (ví dụ: 11:30)')
        .test('is-after-start', 'Giờ kết thúc phải sau giờ bắt đầu', function(value) {
          const { tu } = this.parent;
          if (!tu || !value) return true;
          const [startHour, startMin] = tu.split(':').map(Number);
          const [endHour, endMin] = value.split(':').map(Number);
          const startTotal = startHour * 60 + startMin;
          const endTotal = endHour * 60 + endMin;
          return endTotal > startTotal;
        }),
    }),

    buoi_chieu: yup.object().shape({
      tu: yup
        .string()
        .required('Giờ bắt đầu buổi chiều không được để trống')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ phải có định dạng HH:mm (ví dụ: 13:00)'),

      den: yup
        .string()
        .required('Giờ kết thúc buổi chiều không được để trống')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ phải có định dạng HH:mm (ví dụ: 17:00)')
        .test('is-after-start', 'Giờ kết thúc phải sau giờ bắt đầu', function(value) {
          const { tu } = this.parent;
          if (!tu || !value) return true;
          const [startHour, startMin] = tu.split(':').map(Number);
          const [endHour, endMin] = value.split(':').map(Number);
          const startTotal = startHour * 60 + startMin;
          const endTotal = endHour * 60 + endMin;
          return endTotal > startTotal;
        }),
    }),

    ghi_chu: yup
      .string()
      .nullable()
      .transform((value) => value === '' ? null : value),
  }),

  linkGoogleMap: yup
    .string()
    .required('Link Google Map không được để trống'),
});

export const contactUpdateSchema = contactSchema;

export async function validateContact(data) {
    const result = await validateSchema(contactSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateContact(data) {
    const result = await validateSchema(contactUpdateSchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateContactForm(uyBanData, isEditMode = false) {
    
    const schema = isEditMode ? contactUpdateSchema : contactSchema;
        
    const result = await validateSchema(schema, uyBanData);
    console.log('Validation result:', result);
    
    return { isValid: result.valid, errors: result.errors };
}