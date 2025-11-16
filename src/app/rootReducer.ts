import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// import userReducer from '../features/user/userSlice';
// import appointmentReducer from '../features/appointments/appointmentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // user: userReducer,
  // appointments: appointmentReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
