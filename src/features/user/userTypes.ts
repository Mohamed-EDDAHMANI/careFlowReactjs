export interface User {
  _id: string;
  name: string;
  email: string;
  roleId: {
    _id: string;
    name: string;
  };
  status: string;
  cin?: string;
  birthDate?: string;
  suspendedAt?: string;
  suspendReason?: string;
  createdAt: string;
  updatedAt: string;
  permissions: {
    [key: string]: boolean;
  };
}

export interface UsersState {
  users: User[];
  doctors: User[];
  loading: boolean;
  error: string | null;
}