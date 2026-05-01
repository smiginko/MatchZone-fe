import { UserRoleEnum } from './user-role-enum';

export interface UserModel {
    name: string;
    email?: string;
    account?: string;
    role?: UserRoleEnum;
}
