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
      title: "Mark Attendance",
      links: [{ label: "Mark Attendance", path: "/dashboard/attendance/mark" }],
    },
    {
      title: "View Attendance",
      links: [
        { label: "View Attendance", path: "/dashboard/teacher/attendance" },
      ],
    },
  ],
  student: [
    {
      title: "View Attendance",
      links: [
        { label: "View Attendance", path: "/dashboard/student/attendance" },
      ],
    },
  ],
  parent: [
    {
      title: "View Attendance",
      links: [
        { label: "View Attendance", path: "/dashboard/parent/attendance" },
      ],
    },
  ],
};
export const getMenuLinks = (role) => {
  return menuConfig[role] || [];
};
