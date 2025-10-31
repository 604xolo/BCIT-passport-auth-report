// models/userModel.ts
export interface User {
  id: number;
  name: string;
  email?: string;                          // <- make optional to allow GitHub users with no public email
  password?: string;
  role: "user" | "admin";
  avatarUrl?: string;
  provider?: "local" | "github";
}

const database: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "admin",
    provider: "local",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user",
    provider: "local",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user",
    provider: "local",
  },
];

let nextId = 4;

export const userModel = {
  all(): User[] {
    return database;
  },

  findOne(email: string): User {
    const user = database.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    throw new Error(`Couldn't find user with email: ${email}`);
  },

  findOneByEmail(email: string): User | undefined {
    return database.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  },

  findById(id: number): User {
    const user = database.find((u) => u.id === id);
    if (user) return user;
    throw new Error(`Couldn't find user with id: ${id}`);
  },

  createFromGithub(data: { name: string; email?: string; avatarUrl?: string }): User {
    const newUser: User = {
      id: nextId++,
      name: data.name,
      email: data.email, // may be undefined if user hides email on GitHub
      role: "user",
      avatarUrl: data.avatarUrl,
      provider: "github",
    };
    database.push(newUser);
    return newUser;
  },
};

export { database };
