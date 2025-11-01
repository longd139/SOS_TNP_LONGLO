import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import proceduresReducer from '../features/procedures/proceduresSlice';
import usersReducer from '../features/users/usersSlice';
import contactReducer from '../features/contact/contactSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        procedures: proceduresReducer,
        users: usersReducer,
        contact: contactReducer,
    },
});
