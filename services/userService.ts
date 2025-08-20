// Mock user data based on the UI design
export interface User {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Staff";
  status: "Active" | "Inactive";
  lastLogin: string;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    email: "emily.carter@clinic.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-20 10:00 AM",
  },
  {
    id: 2,
    name: "Dr. David Lee",
    email: "david.lee@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 09:30 AM",
  },
  {
    id: 3,
    name: "Dr. Sarah Jones",
    email: "sarah.jones@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 09:00 AM",
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    email: "michael.brown@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 08:30 AM",
  },
  {
    id: 5,
    name: "Dr. Jessica Wilson",
    email: "jessica.wilson@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 08:00 AM",
  },
  {
    id: 6,
    name: "Dr. Kevin Clark",
    email: "kevin.clark@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 06:30 AM",
  },
  {
    id: 7,
    name: "Dr. Amanda Lewis",
    email: "amanda.lewis@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 06:00 AM",
  },
  {
    id: 8,
    name: "Dr. Christopher Harris",
    email: "christopher.harris@clinic.com",
    role: "Staff",
    status: "Active",
    lastLogin: "2024-01-20 05:30 AM",
  },
];

// Get all users
export const getUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers;
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockUsers.find((user) => user.id === id) || null;
};

// Create new user
export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const newUser: User = {
    ...userData,
    id: Math.max(...mockUsers.map((u) => u.id)) + 1,
  };
  mockUsers.push(newUser);
  return newUser;
};

// Update user
export const updateUser = async (
  id: number,
  userData: Partial<User>
): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((user) => user.id === id);
  if (userIndex === -1) return null;

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
  return mockUsers[userIndex];
};

// Delete user
export const deleteUser = async (id: number): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((user) => user.id === id);
  if (userIndex === -1) return false;

  mockUsers.splice(userIndex, 1);
  return true;
};

// Deactivate user
export const deactivateUser = async (id: number): Promise<User | null> => {
  return updateUser(id, { status: "Inactive" });
};
