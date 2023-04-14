import { Role } from "./role";

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    resetLink: string;
    tenant: Array<any>;
    token?: string;
}
