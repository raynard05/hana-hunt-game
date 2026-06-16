'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, User, Lock, UserCircle, School, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { registerUser } from '@/app/actions/auth';
import './register.css';

export default function RegisterPage() {
    const [namaLengkap, setNamaLengkap] = useState('');
    const [username, setUsername] = useState('');
    const [kelas, setKelas] = useState('');
    const [absen, setAbsen] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            // Detect if keyboard is open by checking if viewport height decreased
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const windowHeight = window.innerHeight;

            if (viewportHeight < windowHeight * 0.75) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
            }
        };

        const handleFocus = () => {
            setIsKeyboardOpen(true);
            // Scroll the focused input into view
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        };

        const handleBlur = () => {
            setTimeout(() => {
                setIsKeyboardOpen(false);
            }, 100);
        };

        // Listen to visual viewport resize (better for mobile keyboard detection)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        } else {
            window.addEventListener('resize', handleResize);
        }

        // Add focus/blur listeners to all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        });

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            } else {
                window.removeEventListener('resize', handleResize);
            }
            inputs.forEach(input => {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            });
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validasi absen harus angka
        if (isNaN(Number(absen)) || absen === '') {
            setError('Nomer absen kudu angka!');
            return;
        }


        setIsLoading(true);

        try {
            const res = await registerUser({
                namaLengkap,
                username,
                kelas,
                absen,
                password,
            });

            if (!res.success) {
                setError(res.error || 'Gagal ndhaptar pangguna.');
                setIsLoading(false);
                return;
            }

            setSuccessMessage('Ndhaptar kasil! Sampeyan bakal dialihake menyang kaca mlebu...');
            setIsLoading(false);

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (err) {
            console.error('Register submit error:', err);
            setError('Koneksi bermasalah, silakan coba lagi.');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Content Overlay */}
            <div className={`login-content ${isKeyboardOpen ? 'keyboard-open' : ''}`}>
                {/* Lelana Basa Logo */}
                <div className="logo-container">
                    <Image
                        src="/Login_regist_assets/hana_hunt_title.png"
                        alt="Hana Hunt"
                        width={628}
                        height={324}
                        className="logo-image"
                        priority
                        unoptimized
                    />
                </div>

                {/* Register Form */}
                <div className="login-form-container" ref={formRef}>
                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-alert">{error}</div>}
                        {successMessage && <div className="success-alert">{successMessage}</div>}

                        {/* Nama Lengkap Input */}
                        <div className="input-group">
                            <div className="input-wrapper-shadcn">
                                <UserCircle className="input-icon-shadcn" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Jeneng Jangkep"
                                    value={namaLengkap}
                                    onChange={(e) => setNamaLengkap(e.target.value)}
                                    className="input-shadcn"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Username Input */}
                        <div className="input-group">
                            <div className="input-wrapper-shadcn">
                                <User className="input-icon-shadcn" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Username (Tuladha: bagus)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-shadcn"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Kelas Input */}
                        <div className="input-group">
                            <div className="input-wrapper-shadcn">
                                <School className="input-icon-shadcn" size={20} />
                                <Input
                                    type="text"
                                    placeholder="Klas (Tuladha : 7A, 8B)"
                                    value={kelas}
                                    onChange={(e) => setKelas(e.target.value)}
                                    className="input-shadcn"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Absen Input */}
                        <div className="input-group">
                            <div className="input-wrapper-shadcn">
                                <Hash className="input-icon-shadcn" size={20} />
                                <Input
                                    type="number"
                                    placeholder="Nomer Absen"
                                    value={absen}
                                    onChange={(e) => setAbsen(e.target.value)}
                                    className="input-shadcn"
                                    required
                                    min="1"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <div className="input-wrapper-shadcn">
                                <Lock className="input-icon-shadcn" size={20} />
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Kata Sandi"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-shadcn"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="toggle-password-shadcn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        </div>



                        {/* Submit Button */}
                        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                            {isLoading ? 'Ngolah...' : 'Wiwit Lelana'}
                        </Button>

                        {/* Login Link */}
                        <div className="register-link">
                            <span className="register-text">Sudah punya akun? </span>
                            <a href="/" className="register-link-text">
                                Masuk disini
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
