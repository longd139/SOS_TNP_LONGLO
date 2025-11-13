import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

export const convertTo24Hour = (time12h) => {
  if (!time12h) return "";

  if (/^([01]\d|2[0-3]):([0-5]\d)$/.test(time12h)) {
    return time12h;
  }

  const time12hRegex = /^(\d{1,2}):(\d{2})\s*(SA|CH)$/i;
  const match = time12h.match(time12hRegex);

  if (!match) return time12h;

  let [, hours, minutes, ampm] = match;
  hours = parseInt(hours, 10);

  if (ampm.toUpperCase() === "CH" && hours !== 12) {
    hours += 12;
  } else if (ampm.toUpperCase() === "SA" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
};

export const createWorkScheduleSchema = yup.object().shape({
  diaDiem: yup.string().required("Địa điểm không được để trống"),
  tenCanBo: yup.string().required("Tên cán bộ không được để trống"),
  ngayTiepDan: yup
    .date()
    .required("Ngày tiếp dân không được để trống")
    .test(
      "not-past-date",
      "Không thể chọn ngày trong quá khứ",
      function (value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
    ),
  batDau: yup
    .string()
    .required("Giờ bắt đầu không được để trống")
    .test("validTime", "Giờ bắt đầu không hợp lệ", (value) => {
      if (!value) return false;
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(value);
    })
    .test(
      "not-past-time",
      "Không thể chọn giờ trong quá khứ",
      function (value) {
        const { ngayTiepDan } = this.parent;
        if (!value || !ngayTiepDan) return true;

        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
          const [hours, minutes] = value.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime <= now) {
            return this.createError({
              message: "Giờ bắt đầu phải là thời điểm trong tương lai",
            });
          }
        }

        return true;
      }
    )
    .test(
      "startBeforeEnd",
      "Giờ bắt đầu phải trước giờ kết thúc",
      function (value) {
        const { ketThuc } = this.parent;
        if (!value || !ketThuc) return true;
        const startTime24h = convertTo24Hour(value);
        const endTime24h = convertTo24Hour(ketThuc);
        return startTime24h < endTime24h;
      }
    ),
  ketThuc: yup
    .string()
    .required("Giờ kết thúc không được để trống")
    .test("validTime", "Giờ kết thúc không hợp lệ", (value) => {
      if (!value) return false;
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(value);
    })
    .test(
      "not-past-time",
      "Không thể chọn giờ trong quá khứ",
      function (value) {
        const { ngayTiepDan } = this.parent;
        if (!value || !ngayTiepDan) return true;

        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
          const time24h = convertTo24Hour(value);
          const [hours, minutes] = time24h.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime <= now) {
            return this.createError({
              message: "Giờ kết thúc phải là thời điểm trong tương lai",
            });
          }
        }

        return true;
      }
    )
    .test(
      "endAfterStart",
      "Giờ kết thúc phải sau giờ bắt đầu",
      function (value) {
        const { batDau } = this.parent;
        if (!value || !batDau) return true;
        const startTime24h = convertTo24Hour(batDau);
        const endTime24h = convertTo24Hour(value);
        return endTime24h > startTime24h;
      }
    ),
});

export const updateWorkScheduleSchema = yup.object().shape({
  diaDiem: yup.string().required("Địa điểm không được để trống"),
  tenCanBo: yup.string().required("Tên cán bộ không được để trống"),
  ngayTiepDan: yup
    .date()
    .required("Ngày tiếp dân không được để trống")
    .test(
      "not-past-date",
      "Không thể chọn ngày trong quá khứ",
      function (value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      }
    )
    .test(
      "edit-only-future-date",
      "Khi chỉnh sửa lịch, chỉ được chọn ngày trong tương lai",
      function (value) {
        if (!value) return true;

        const originalDate = this.options.context?.originalDate;
        if (!originalDate) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          return this.createError({
            message: "Khi chỉnh sửa lịch, không được chọn ngày trong quá khứ",
          });
        }

        return true;
      }
    )
    .test(
      "cannot-edit-past-schedule",
      "Không thể chỉnh sửa lịch công tác đã qua",
      function (value) {
        const originalDate = this.options.context?.originalDate;
        const originalStartTime = this.options.context?.originalStartTime;

        if (!originalDate) return true;

        const now = new Date();
        const original = new Date(originalDate);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        original.setHours(0, 0, 0, 0);

        if (original < today) {
          return this.createError({
            message: "Không thể chỉnh sửa lịch công tác đã qua ngày hiện tại",
          });
        }

        if (originalStartTime && original.getTime() === today.getTime()) {
          const originalStartTime24h = convertTo24Hour(originalStartTime);
          const [hours, minutes] = originalStartTime24h.split(":").map(Number);
          const originalDateTime = new Date(originalDate);
          originalDateTime.setHours(hours, minutes, 0, 0);

          if (originalDateTime <= now) {
            return this.createError({
              message:
                "Không thể chỉnh sửa lịch tiếp dân đã bắt đầu hoặc đã kết thúc",
            });
          }
        }

        return true;
      }
    ),
  batDau: yup
    .string()
    .required("Giờ bắt đầu không được để trống")
    .test("validTime", "Giờ bắt đầu không hợp lệ", (value) => {
      if (!value) return false;
      const time24h = convertTo24Hour(value);
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(time24h);
    })
    .test(
      "edit-future-time-today",
      "Giờ bắt đầu phải là thời điểm trong tương lai",
      function (value) {
        if (!value) return true;

        const { ngayTiepDan } = this.parent;
        const originalDate = this.options.context?.originalDate;

        if (!originalDate || !ngayTiepDan) return true;

        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
          const time24h = convertTo24Hour(value);
          const [hours, minutes] = time24h.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime <= now) {
            return this.createError({
              message:
                "Khi chỉnh sửa lịch về ngày hiện tại, giờ bắt đầu phải là thời điểm trong tương lai",
            });
          }
        }

        return true;
      }
    )
    .test(
      "startBeforeEnd",
      "Giờ bắt đầu phải trước giờ kết thúc",
      function (value) {
        const { ketThuc } = this.parent;
        if (!value || !ketThuc) return true;
        const startTime24h = convertTo24Hour(value);
        const endTime24h = convertTo24Hour(ketThuc);
        return startTime24h < endTime24h;
      }
    ),
  ketThuc: yup
    .string()
    .required("Giờ kết thúc không được để trống")
    .test("validTime", "Giờ kết thúc không hợp lệ", (value) => {
      if (!value) return false;
      const time24h = convertTo24Hour(value);
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      return timeRegex.test(time24h);
    })
    .test(
      "edit-future-time-today",
      "Giờ kết thúc phải là thời điểm trong tương lai",
      function (value) {
        if (!value) return true;

        const { ngayTiepDan } = this.parent;
        const originalDate = this.options.context?.originalDate;

        if (!originalDate || !ngayTiepDan) return true;

        const now = new Date();
        const selectedDate = new Date(ngayTiepDan);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate.getTime() === today.getTime()) {
          const time24h = convertTo24Hour(value);
          const [hours, minutes] = time24h.split(":").map(Number);
          const selectedDateTime = new Date();
          selectedDateTime.setHours(hours, minutes, 0, 0);

          if (selectedDateTime <= now) {
            return this.createError({
              message:
                "Khi chỉnh sửa lịch về ngày hiện tại, giờ kết thúc phải là thời điểm trong tương lai",
            });
          }
        }

        return true;
      }
    )
    .test(
      "endAfterStart",
      "Giờ kết thúc phải sau giờ bắt đầu",
      function (value) {
        const { batDau } = this.parent;
        if (!value || !batDau) return true;
        const startTime24h = convertTo24Hour(batDau);
        const endTime24h = convertTo24Hour(value);
        return endTime24h > startTime24h;
      }
    ),
});

export async function validateCreateWorkScheduleForm(data) {
  const result = await validateSchema(createWorkScheduleSchema, data);
  return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateWorkScheduleForm(
  data,
  originalDate = null,
  originalStartTime = null
) {
  const context = originalDate
    ? { originalDate, originalStartTime }
    : undefined;
  const result = await validateSchema(updateWorkScheduleSchema, data, {
    context,
  });
  return { isValid: result.valid, errors: result.errors };
}

export function isPastDate(date) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
}

export function isPastSchedule(date, startTime) {
  if (!date || !startTime) return false;

  const now = new Date();
  const scheduleDate = new Date(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);

  if (scheduleDate < today) return true;
  if (scheduleDate > today) return false;

  const startTime24h = convertTo24Hour(startTime);
  const [hours, minutes] = startTime24h.split(":").map(Number);
  const scheduleDateTime = new Date(date);
  scheduleDateTime.setHours(hours, minutes, 0, 0);

  return scheduleDateTime <= now;
}

export function canEditWorkSchedule(originalDate, originalStartTime = null) {
  if (!originalStartTime) {
    return !isPastDate(originalDate);
  }

  return !isPastSchedule(originalDate, originalStartTime);
}
