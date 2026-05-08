import { redirect } from 'next/navigation';

export default function AttendancePage() {
  // Default to student attendance
  redirect('/admin/attendance/student');
}
