'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { loginUser } from '@/app/actions/auth';
import './login.css';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setIsLoading(true);

    try {
      const res = await loginUser({ username, password });
      if (!res.success) {
        setError(res.error || 'Terjadi kesalahan saat masuk.');
        setIsLoading(false);
        return;
      }

      // Store user info in localStorage for client-side state
      if (res.user) {
        localStorage.setItem('user_session', JSON.stringify(res.user));
      }

      router.push('/menu');
    } catch (err) {
      console.error('Submit error:', err);
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

        {/* Login Form */}
        <div className="login-form-container" ref={formRef}>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-alert">{error}</div>}

            {/* Username Input */}
            <div className="input-group">
              <div className="input-wrapper-shadcn">
                <User className="input-icon-shadcn" size={20} />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-shadcn"
                  required
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

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <Label className="remember-me">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="checkbox-label">Ingat Saya</span>
              </Label>
              <a href="#" className="forgot-password">
                Lupa Kata Sandi?
              </a>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? 'Mriksa...' : 'Wiwiti'}
            </Button>

            {/* Register Link */}
            <div className="register-link">
              <span className="register-text">Belum punya akun? </span>
              <a href="/register" className="register-link-text">
                Daftar disini
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
