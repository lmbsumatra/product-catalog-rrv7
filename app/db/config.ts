import mysql from "mysql2"
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schemas/index"

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "NewPassword",
    database: "product_catalog",
})

export const db = drizzle(connection, { schema, mode: 'default' })