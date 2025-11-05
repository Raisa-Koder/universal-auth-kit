import { UserAdapter } from "@/src/auth/adapters/user-adapter";
import { mockUsers, User } from "./mock-users";



// Runtime claims
export const runtimeClaimsExample = { role: "super-editor", temporary: true };

// Mock adapters
export class AdminAdapter implements UserAdapter<User> {
  async validateUser(identifier: string, secret: string) {
    if (identifier === "valid_user" && secret === "valid_pass") return mockUsers.admin;
    return null;
  }
}

export class EditorAdapter implements UserAdapter<User> {
  async validateUser(identifier: string, secret: string) {
    if (identifier === "user2" && secret === "pass2") return mockUsers.editor;
    return null;
  }
}

export class InvalidAdapter implements UserAdapter<any> {
  async validateUser() { return null; }
}