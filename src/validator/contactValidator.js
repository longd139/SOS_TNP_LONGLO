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
        .required('Giờ bắt đầu buổi sáng không được để trống'),

      den: yup
        .string()
        .required('Giờ kết thúc buổi sáng không được để trống'),
    }),

    buoi_chieu: yup.object().shape({
      tu: yup
        .string()
        .required('Giờ bắt đầu buổi chiều không được để trống'),

      den: yup
        .string()
        .required('Giờ kết thúc buổi chiều không được để trống'),
    }),

    ghi_chu: yup
      .string()
      .nullable(),
  }),

  linkGoogleMap: yup
    .string()
    .required('Link Google Map không được để trống'),
});

export const contactUpdateSchema = contactSchema;

export async function validateContact(data) {
    console.log('validateUyBan called with:', data);
    const result = await validateSchema(contactSchema, data);
    console.log('Validation result:', result);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateContact(data) {
    console.log('validateUpdateContact called with:', data);
    const result = await validateSchema(contactUpdateSchema, data);
    console.log('Validation result:', result);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateContactForm(uyBanData, isEditMode = false) {
    console.log('validateContactForm called with:', { uyBanData, isEditMode });
    
    const schema = isEditMode ? contactUpdateSchema : contactSchema;
    
    console.log('Schema selected:', isEditMode ? 'update' : 'create');
    
    const result = await validateSchema(schema, uyBanData);
    console.log('Validation result:', result);
    
    return { isValid: result.valid, errors: result.errors };
}