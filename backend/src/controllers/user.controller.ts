import type { Context } from 'hono';
import { PrismaClient } from '../generated/prisma/index.js';
import { z } from 'zod';
import { CreateUser, fetchUser, updateProfile } from '../models/user.model.ts';
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import cloudinary from '../util/cloudinary.js';
dotenv.config();

const prisma = new PrismaClient();
const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(7),
  });
  
export async function createUserController(c: Context) {
    const body = await c.req.json();
    const parsed = userSchema.safeParse(body);
  
    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400);
    }
  
    const { email, password } = parsed.data;
  
    try {
      const insertId = await CreateUser(email, password);
  
      const token = jwt.sign(
        { UserId: insertId, email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );
  
      return c.json({
        message: 'User created successfully',
        token,
        user: {
          UserId: insertId,
          email,
        },
      });
    } catch (err) {
      console.error(err);
      return c.json({ error: 'Something went wrong' }, 500);
    }
}

export async function loginUserController(c: Context) {
  const { email, password } = await c.req.json();

  const user = await prisma.user.findUnique({
    where: {
      UserEmail: email,
    },
  });

  if (!user) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  const match = await bcrypt.compare(password, user.UserPassword);
  if (!match) {
    return c.json({ message: 'Invalid credentials' }, 401);
  }

  const token = jwt.sign(
    { id: user.UserId, email: user.UserEmail },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return c.json({
    message: 'Login successful',
    token,
    user: {
      UserId: user.UserId,
      email: user.UserEmail,
    },
  });
}

export async function fetchProfileController(c: Context) {
  try {
    const user = c.get('user'); 
    const profile = await fetchUser(user.id);
    return c.json(profile);

    } catch (err) {
      console.error(err);
      return c.json({ error: 'Failed to fetch profile' }, 500);
    }
}

export async function updateProfileController(c: Context) {
  try {
    const user = c.get('user');
    const body = await c.req.json();

    await updateProfile(user.id, {
      NewName: body.name,
      NewEmail: body.email,
      NewPicture: body.User_picture,
    });

    return c.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
}

export async function uploadProfilePicController(c: Context) {
  const body = await c.req.parseBody(); 
  const file = body.image as File;

  if (!file) {
    return c.json({ error: 'No file uploaded' }, 400);
  }
  const MAX_SIZE = 20 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return c.json({ error: 'File too large. Max size is 20MB.' }, 400);
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataUri = `data:${file.type};base64,${base64}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'winniethepoop/profile',
      transformation: [{ width: 200, height: 200, crop: 'fill' }],
    });

    return c.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
}
