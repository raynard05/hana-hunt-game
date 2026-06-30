'use client';

import { useState, useEffect } from "react";
import Image from 'next/image';
import './menu.css';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logoutUser } from "@/app/actions/auth";
import Link from "next/link";
import Music from "@/components/Music";



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


    const handleInfo = () => {
        console.log('Info clicked');
        router.push("./info")
    };


    const handleStart = () => {
        console.log('Game clicked');
        router.push("./game")
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
                    <Image src="/menu_assets/menu-logo.webp" alt="hana-menu" width={500} height={300} className="menu-logo-img" priority></Image>
                </div>

                <div className="menu-wrapper">

                    <Link href="/cp_page" className="menu-card-link card-cp">
                        <picture >
                            <source media="(max-width: 480px)" srcSet="menu_assets/cp_mobile.png" />
                            <img
                                src={'menu_assets/cp.webp'}
                                alt="CP dan Materi"
                                className="menu-card-image"
                            />
                        </picture>

                    </Link>


                    <Link href="/latar" className="menu-card-link card-latar">
                        <picture>
                            <source media="(max-width: 480px)" srcSet="menu_assets/latar_mobile.png" />


                            <img
                                src={'/menu_assets/latar_belakang.webp'}
                                alt="Latar Belakang"
                                className="menu-card-image"
                            />
                        </picture>
                    </Link>


                    <Link href="/profil" className="menu-card-link card-profil">
                        <picture>
                            <source media="(max-width: 480px)" srcSet="menu_assets/profil_mobile.png" />

                            <img
                                src={'/menu_assets/dev.webp'}
                                alt="Profil Pengembang"
                                className="menu-card-image"
                            />

                        </picture>
                    </Link>
                </div>

            </div>

            <button className="info-btn" onClick={handleInfo} type="button" aria-label="Information">
                <Image src="/menu_assets/information.webp" alt="Information" fill sizes="80px" className="icon-img" priority />
            </button>

            <Music className="sound-btn" />

            {/* Logout button placed in bottom right */}
            <button className="logout-btn" onClick={handleLogout} type="button" aria-label="Log Out">
                <Image src="/menu_assets/logout.webp" alt="Log Out" fill sizes="80px" className="icon-img" priority />
            </button>

            <button className="gamebtn" onClick={handleStart} type="button" >
                Wiwiti Sinau
            </button>

        </div>

    );
}