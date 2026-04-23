import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
        }
        
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const sessionPayload = {
            userId: user._id,
            email: user.email,
            fullName: user.fullName,
        };
        
        const session = await encrypt(sessionPayload);

        cookies().set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires,
            sameSite: 'lax',
            path: '/',
        });

        return NextResponse.json({ message: 'Login successful.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred during login.', error: error.message }, { status: 500 });
    }
}