/** @format */

const menuConfig = {
  admin: [
    {
      title: "Class",
      links: [{ label: "Manage Class", path: "/dashboard/class/manage" }],
    },
    {
      title: "Subject",
      links: [{ label: "Manage Subject", path: "/dashboard/subject/manage" }],
    },
    {
      title: "Teacher",
      links: [{ label: "Manage Teacher", path: "/dashboard/teacher/manage" }],
    },
    {
      title: "Parent",
      links: [{ label: "Manage Parent", path: "/dashboard/parent/manage" }],
    },
    {
      title: "Student",
      links: [{ label: "Manage Student", path: "/dashboard/student/manage" }],
    },
    {
      title: "PTM",
      links: [{ label: "Manage PTM", path: "/dashboard/ptm/manage" }],
    },
  ],
  teacher: [
    {
      title: "Attendance",
      links: [{ label: "View Attendance", path: "/dashboard/attendance/view" }],
    },
  ],
  student: [
    {
      title: "Attendance",
      links: [{ label: "View Attendance", path: "/dashboard/attendance/view" }],
    },
  ],
  parent: [
    {
      title: "Attendance",
      links: [{ label: "View Attendance", path: "/dashboard/attendance/view" }],
    },
  ],
};
export const getMenuLinks = (role) => {
  return menuConfig[role] || [];
};
