import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        await dbConnect();
        const { fullName, email, password } = await request.json();

        if (!fullName || !email || !password) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'An error occurred during registration.', error: error.message }, { status: 500 });
    }
}