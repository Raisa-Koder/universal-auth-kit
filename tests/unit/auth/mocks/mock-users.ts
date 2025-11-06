// Example user types
export interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export const mockUsers = {
  admin: { id: "u1", email: "user1@example.com", role: "admin" },
  editor: { id: "u2", email: "user2@example.com", role: "editor" },
};
