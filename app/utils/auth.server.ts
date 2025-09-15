
import jwt from 'jsonwebtoken';
import { createCookieSessionStorage, redirect } from 'react-router';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie_secret';

export function generateToken(payload: { userId: number; username: string, auth: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; username: string, auth: string } | null {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string; username: string, auth: string };
    } catch {
        return null;
    }
}

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'auth_token',
        secure: process.env.NODE_ENV === 'production',
        secrets: [COOKIE_SECRET],
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
    },
});

export async function getSession(request: Request) {
    return sessionStorage.getSession(request.headers.get('Cookie'));
}

export async function getUser(request: Request) {
    const session = await getSession(request);
    const token = session.get('token');

    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
}

export async function getUserId(request: Request): Promise<string | null> {
    const user = await getUser(request);
    return user?.userId || null;
}

export async function requireUser(request: Request) {
    const user = await getUser(request);
    if (!user) {
        throw redirect('/login');
    }
    return user;
}

export async function requireUserId(request: Request): Promise<string> {
    const user = await requireUser(request);
    return user.userId;
}

export async function createUserSession(
    userId: number,
    username: string,
    auth: string,
    redirectTo: string = '/'
) {
    const token = generateToken({ userId, username, auth });
    const session = await sessionStorage.getSession();
    session.set('token', token);

    return redirect(redirectTo, {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
        },
    });
}

export async function logout(request: Request) {
    const session = await getSession(request);
    return redirect('/login', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        },
    });
}


