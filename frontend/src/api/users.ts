export interface User {
  _id: string;
  name: string;
  profilePictureURL?: string;
}

export async function getUser(userId: string): Promise<User> {
  const res = await fetch(`/api/user/${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user with ID ${userId}`);
  }
  return await res.json();
}
