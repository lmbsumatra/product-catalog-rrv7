import { eq } from "drizzle-orm";
import { db } from "~/db/config";
import { users } from "~/db/models/User";
import type { User } from "~/db/schemas";


export async function FindUserByUsername(username: string): Promise<User | null> {
    const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username));

    const user = result[0] ?? null;
    return user;

}