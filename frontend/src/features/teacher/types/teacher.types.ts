export interface Teacher {
  id: string;
  schoolId: string;

  fullName: string;
  email: string;
  phone: string;
  password?: string;
  firstLogin?: boolean;

  employeeId: string;

  department: string;
  subject: string;

  qualification: string;
  experienceYears: number;

  joiningDate: string;
  coordinatorFor?: string[];

  status: 'ACTIVE' | 'INACTIVE';

  createdAt: string;
  updatedAt: string;
  
  profilePic?: string;
}

export interface CreateTeacherPayload {
  schoolId: string;

  fullName: string;
  email: string;
  phone: string;

  employeeId: string;

  department: string;
  subject: string;

  qualification: string;
  experienceYears: number;

  joiningDate: string;
  
  profilePic?: string;
}

export interface UpdateTeacherPayload
  extends Partial<CreateTeacherPayload> {
  id: string;
}