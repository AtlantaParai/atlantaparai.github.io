export const authorizedUsers = [
  'ayyapps4u@gmail.com',
  'ipan85@gmail.com',
  'divya@example.com',
  'rajesh@example.com',
  'vijay@example.com'
];

export const attendanceUsers = [
  'ipan85@gmail.com'
  // Add more emails here for users who should see attendance tab
];

export const financeUsers = [
  'ayyapps4u@gmail.com'
  // Add more emails here for users who should see finance tab
];

export const isUserAuthorized = (email: string | null): boolean => {
  if (!email) return false;
  return authorizedUsers.includes(email.toLowerCase());
};

export const hasAttendanceAccess = (email: string | null): boolean => {
  if (!email) return false;
  return attendanceUsers.includes(email.toLowerCase());
};

export const hasFinanceAccess = (email: string | null): boolean => {
  if (!email) return false;
  return financeUsers.includes(email.toLowerCase());
};