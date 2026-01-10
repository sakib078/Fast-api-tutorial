export interface UsertoRegister {
    email: string;
    password: string;
    is_active: boolean;
    is_superuser: boolean;
    is_verified: boolean;
}


export interface currentUser {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}
