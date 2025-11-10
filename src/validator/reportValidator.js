import * as yup from 'yup';
import { validateSchema } from "../utils/validationUtils";

export const reportSchema = yup.object().shape({
    selectedStatus: yup.string().required('Trạng thái là bắt buộc'),
    responseContent: yup.string().required('Nội dung phản hồi là bắt buộc'),
    expectedResponseDate: yup
        .date()
        .required('Thời gian phản hồi dự kiến là bắt buộc')
        .test(
            'is-future-date',
            'Thời gian phản hồi dự kiến phải sau ngày hiện tại',
            (value) => {
                if (!value) return true;
                return value > new Date();
            }
        ),
    expectedCompletionDate: yup
        .date()
        .required('Thời gian hoàn thành dự kiến là bắt buộc')
        .test(
            'is-after-expected-response-date',
            'Thời gian hoàn thành dự kiến phải sau thời gian phản hồi dự kiến',
            function (value) {
                const { expectedResponseDate } = this.parent;
                if (!value || !expectedResponseDate) return true;
                return value > expectedResponseDate;
            }
        ),
});

export async function validateReport(data) {
    const result = await validateSchema(reportSchema, data);
            
    return { isValid: result.valid, errors: result.errors };
}