import { FindUserById } from "./findUserById";
import { db } from "~/db/config";
import bcrypt from "bcryptjs";
import { type RegisterFormData } from "~/db/schemas/Auth";
import { users } from "~/db/models/User";

export async function createUser(userData: RegisterFormData) {
    
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const newUser = {
            username: userData.username,
            password: hashedPassword,
        };

        const insertResult = await db
            .insert(users)
            .values(newUser)
            .$returningId();

        if (!insertResult || insertResult.length === 0) {
            throw new Error("Failed to create user - no ID returned from database");
        }

        const { id } = insertResult[0];

        const result = await FindUserById(id);

        if (!result) {
            throw new Error(`User with id ${id} not found after creation`);
        }

        return result;
    } catch (error) {
        console.error("Error in createUser:", error);
    }
}