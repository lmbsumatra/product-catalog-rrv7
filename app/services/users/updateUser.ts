import { eq } from "drizzle-orm"
import { db } from "~/db/config"
import { users } from "~/db/models/User"

type UpdateUserI = {
    userId: number
    data: { username?: string, password?: string, auth?: string, isBlocked?: boolean }
}

export async function UpdateUser({ userId, data }: UpdateUserI) {
    const user = await db.update(users).set(data).where(eq(users.id, userId))

    return user
}