export interface AuthUser {
  id: string;
  name: string;
  email: string;
  branchId: string;
  roleId: string;
  roleName: string;
  permissions: string[];
  scope: "own" | "branch" | "all";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
