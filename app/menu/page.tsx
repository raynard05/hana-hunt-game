'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import './menu.css';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import Link from "next/link";




export default function MenuPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isValidating, setIsvalidating] = useState(true);
    const router = useRouter();


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();
                if (!user) {
                    router.push('/');
                } else {
                    setCurrentUser(user);
                    setIsvalidating(false);
                }
            } catch (err) {
                console.error("auth verification error : ", err);
                router.push('/')
            }
        }; checkAuth();
    }, [router])


    const handleLogout = async () => {
        console.log("logging out....")
        try {
            await logoutUser();
            localStorage.removeItem('user_session');

        } catch (err) {
            console.error("Logout error ")
        }
        router.push("/")
    };



    if (isValidating) {
        return (
            <div className="menu-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#FFF8E1', fontSize: '20px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    Loading...
                </div>
            </div>
        )
    }
    return (
        <div className="menu-container">
            <div className="menu-content">
                <div className="menu-logo-container">
                    <Image src="" alt="hana-menu" width={500} height={300} className="menu-logo-img" priority></Image>
                </div>
            </div>
            <div className="menu-wrapper">
                {/* Card 1: CP dan Materi */}
        <Link href="/cp-materi" className="menu-card-link card-cp">
          <img 
            src={''} 
            alt="CP dan Materi" 
            className="menu-card-image"
          />
        </Link>

        {/* Card 2: Latar Belakang */}
        <Link href="/latar-belakang" className="menu-card-link card-latar">
          <img 
            src={''} 
            alt="Latar Belakang" 
            className="menu-card-image"
          />
        </Link>

        {/* Card 3: Profil Pengembang */}
        <Link href="" className="menu-card-link card-profil">
          <img 
            src={'./'} 
            alt="Profil Pengembang" 
            className="menu-card-image"
          />
        </Link>
            </div>

        </div>

    );
}