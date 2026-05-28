export type Student = {
  id: string;

  schoolId: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  firstLogin: boolean;

  className: string;

  rollNumber: string;

  attendance: number;

  // Additional optional profile details
  fatherName?: string;
  motherName?: string;
  address?: string;
  phone?: string;
  fatherPhone?: string;
  motherPhone?: string;
  profilePic?: string;
};