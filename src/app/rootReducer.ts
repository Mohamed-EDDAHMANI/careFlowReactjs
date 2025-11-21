import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import themeReducer from '../features/theme/themeSlice';
import usersReducer from '../features/user/usersSlice';
import appointmentsReducer from '../features/appointment/appointmentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  users: usersReducer,
  appointments: appointmentsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
