export interface users  {
  email:string,
  name: string,
  password: string,
  user_type_id: number,
  role: 'admin' | 'teacher' | 'student';
};