import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import authReducer from './auth/authSlice'
import contactReducer from './user/contact/contactSlice'
import complaintReducer from './user/complaint/complaintSlice'
import logbookReducer from './user/logbook/logbookSlice'
import notificationReducer from './user/notification/notificationSlice'
import socketReducer from './shared/socket/socketSlice'
import adminDashboardReducer from './admin/dashboard/dashboardSlice'
import adminLogbookReducer from './admin/logbook/logbookSlice'
import adminComplaintReducer from './admin/complaint/complaintSlice'
import adminAnnouncementReducer from './admin/announcement/announcementSlice'
import adminProfileReducer from './admin/profile/profileSlice'
import adminNotificationReducer from './admin/notification/notificationSlice'
import adminPaymentsHandleReducer from './admin/payment/paymentSlice'
import  userpaymentReducer from './user/payment/paymentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    complaint: complaintReducer,
    logbook: logbookReducer,
    notification: notificationReducer,
    contact: contactReducer,
    socket: socketReducer,
    adminDashboard: adminDashboardReducer,
    adminLogbook: adminLogbookReducer,
    adminComplaint: adminComplaintReducer,
    adminProfile: adminProfileReducer,
    adminNotifications:adminNotificationReducer,
    adminAnnouncements: adminAnnouncementReducer,
    userPayments: userpaymentReducer,
    adminPaymentsHandle: adminPaymentsHandleReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket object in serialization check
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }),
})