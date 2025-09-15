import { FindUserByUsername } from "~/services/users/findUserByUsername";
import { comparePasswords } from "./comparePasswords";
import type { User } from "~/db/schemas";

type AuthUserI = {
    user?: User,
    message?: string,
}

export async function authenticateUser(username: string, password: string): Promise<AuthUserI | null> {
    const user = await FindUserByUsername(username);
    if (!user) return null;

    if (user.isBlocked) {
        return { message: "You are blocked from logging in" };
    }

    const isValid = await comparePasswords(password, user.password);
    if (!isValid) {
        return { message: "Invalid creds" };
    }

    return { user };
}