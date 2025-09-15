import { FindUserByUsername } from "~/services/users/findUserByUsername";
import { comparePasswords } from "./comparePasswords";
import type { User } from "~/db/schemas";

export async function authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await FindUserByUsername(username);
    if (!user) return null;

    const isValid = await comparePasswords(password, user.password);
    return isValid ? user : null;
}