import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import proceduresReducer from '../features/procedures/proceduresSlice';
import usersReducer from '../features/users/usersSlice';
import newsReducer from '../features/news/newsSlice';
import categoriesReducer from '../features/categories/categoriesSlice';
import contactReducer from '../features/contact/contactSlice';
import userProfileReducer from '../features/userProfile/userProfileSlice';
import templatesReducer from '../features/templates/templatesSlice';
import areasReducer from '../features/areas/areasSlice';
import workScheduleReducer from '../features/workSchedule/workScheduleSlice';
import reportAreaReducer from '../features/reportAreas/reportAreasSlice';
import reportsReducer from '../features/reports/reportSlice';
import governmentReducer from '../features/government/governmentSlice';
import statisticalReportReducer from '../features/statisticalReport/statisticalReportSlice';
import roleReducer from '../features/roles/roleSlice';
import permissionReducer from '../features/permissions/permissionSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        procedures: proceduresReducer,
        users: usersReducer,
        news: newsReducer,
        categories: categoriesReducer,
        contact: contactReducer,
        userProfile: userProfileReducer,
        templates: templatesReducer,
        areas: areasReducer,
        workSchedule: workScheduleReducer,
        reportArea: reportAreaReducer,
        reports: reportsReducer,
        government: governmentReducer,
        statisticalReport: statisticalReportReducer,
        role: roleReducer,
        permission: permissionReducer,
    },
});
