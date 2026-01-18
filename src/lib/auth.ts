export const authorizedUsers = [
  'ayyapps85@gmail.com',
  'ayyapps4u@gmail.com',
  'ipan85@gmail.com',
  'divyaavino@gmail.com',
  'bhuvanabuzzy@gmail.com',
  'sendabi@gmail.com',
  'apt2025.finserv@gmail.com',
  'ramvijaianand@gmail.com',
  'jeyaraj.l@gmail.com',
  'amarjyotiangan@gmail.com',
  'dhaneshrajathurai@gmail.com',
  'anbu.madhu@gmail.com',
  'chandruxg@gmail.com',
  'visha.chandy@gmail.com',
  'fullbellyvrc@gmail.com'
];

export const attendanceUsers = [
  'ipan85@gmail.com',
  'visha.chandy@gmail.com',
  'chandruxg@gmail.com',
  'anbu.madhu@gmail.com',
  'apt2025.finserv@gmail.com'
  // Add more emails here for users who should see attendance tab
];

export const financeUsers = [
  'ayyapps4u@gmail.com',
  'ipan85@gmail.com',
  'apt2025.finserv@gmail.com',
  'jeyaraj.l@gmail.com',
  'chitty.anand@gmail.com'
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