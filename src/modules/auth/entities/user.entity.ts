import type { Role } from '../../../common/enums/role.enum';

export class User {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string;
  roles: Role[];
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}
