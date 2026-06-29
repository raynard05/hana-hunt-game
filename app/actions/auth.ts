'use server';

import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { cookies } from 'next/headers';
/**
 * Hash password using Node's PBKDF2 algorithm.
 */
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored PBKDF2 hash.
 */
function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, hash] = parts;
    const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === checkHash;
  } catch (error) {
    console.error('Verify password error:', error);
    return false;
  }
}

export async function registerUser(data: {
  namaLengkap: string;
  username: string;
  kelas: string;
  absen: string | number;
  password: string;
}) {
  try {
    const { namaLengkap, username, kelas, absen, password } = data;

    if (!namaLengkap || !username || !kelas || !absen || !password) {
      return { success: false, error: 'Kabeh data kudu diisi!' };
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check if user already exists in db
    const { data: existingUser, error: checkError } = await supabase
      .from('user_account')
      .select('id')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (checkError) {
      console.error('Check user error:', checkError);
      return { success: false, error: 'Gagal mriksa username ing database.' };
    }

    if (existingUser) {
      return { success: false, error: 'Username wis dienggo dening pangguna liyane!' };
    }

    const hashedPassword = hashPassword(password);
    const numericAbsen = parseInt(String(absen), 10);

    if (isNaN(numericAbsen)) {
      return { success: false, error: 'Nomer absen kudu angka!' };
    }

    const { error: insertError } = await supabase
      .from('user_account')
      .insert({
        nama_lengkap: namaLengkap,
        username: cleanUsername,
        kelas: kelas,
        nomor_absen: numericAbsen,
        kata_sandi: hashedPassword,
      });

    if (insertError) {
      console.error('Insert user error:', insertError);
      return { success: false, error: 'Gagal nyimpen data pangguna menyang database.' };
    }
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(existingUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return { success: true, user: existingUser };
  } catch (error: any) {
    console.error('Registration action error:', error);
    return { success: false, error: 'Terjadi kesalahan sistem, silakan coba lagi.' };
  }
}

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  try {
    const { username, password } = data;

    if (!username || !password) {
      return { success: false, error: 'Username lan kata sandi kudu diisi!' };
    }

    const cleanUsername = username.trim().toLowerCase();

    // Fetch user details from database
    const { data: user, error: fetchError } = await supabase
      .from('user_account')
      .select('*')
      .eq('username', cleanUsername)
      .maybeSingle();

    if (fetchError) {
      console.error('Fetch user error:', fetchError);
      return { success: false, error: 'Gagal nyambung menyang database.' };
    }

    if (!user) {
      return { success: false, error: 'Username utawa kata sandi salah!' };
    }

    const isValid = verifyPassword(password, user.kata_sandi);
    if (!isValid) {
      return { success: false, error: 'Username utawa kata sandi salah!' };
    }
    // 3. Prepare user data (excluding password)
    const sessionUser = {
      id: user.id,
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      kelas: user.kelas,
      nomor_absen: user.nomor_absen,
    };

    // 4. Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_session', JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { success: true, user: sessionUser };

  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: 'Terjadi kesalahan sistem, silakan coba lagi.' };
  }


}
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('user_session');
  return { success: true };
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('user_session')
    if (!session || !session.value) {
      return null;
    }
    return JSON.parse(session.value);
  } catch {
    return null;
  }
}

