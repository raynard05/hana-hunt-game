'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MusicProps {
    className?: string;
    style?: React.CSSProperties;
}

// Module-level global background music player (persists across Next.js page transitions)
let globalAudio: HTMLAudioElement | null = null;

function getGlobalAudio() {
    if (typeof window === 'undefined') return null;
    if (!globalAudio) {
        globalAudio = new Audio('/default.mp3');
        globalAudio.loop = true;
    }
    return globalAudio;
}

export default function Music({ className, style }: MusicProps) {
    const [isSoundOn, setIsSoundOn] = useState(true);

    // Load sound setting and sync music playback state on mount
    useEffect(() => {
        const savedSound = localStorage.getItem('isSoundOn');
        const soundEnabled = savedSound !== 'false'; // Default to true if not set
        setIsSoundOn(soundEnabled);

        if (savedSound === null) {
            localStorage.setItem('isSoundOn', 'true');
        }

        // Play or pause background music based on loaded state
        const audio = getGlobalAudio();
        if (audio) {
            if (soundEnabled) {
                audio.play().catch(() => {
                    // Catch and ignore browser autoplay blocks
                });
            } else {
                audio.pause();
            }
        }

        // Sync button icon and audio state when toggled from other pages/components
        const handleToggleEvent = () => {
            const currentVal = localStorage.getItem('isSoundOn');
            const enabled = currentVal !== 'false';
            setIsSoundOn(enabled);

            const audio = getGlobalAudio();
            if (audio) {
                if (enabled) {
                    audio.play().catch(() => { });
                } else {
                    audio.pause();
                }
            }
        };

        const handlePauseBgMusic = () => {
            const audio = getGlobalAudio();
            if (audio) {
                audio.pause();
            }
        };

        const handleResumeBgMusic = () => {
            const savedSound = localStorage.getItem('isSoundOn');
            const enabled = savedSound !== 'false';
            if (enabled) {
                const audio = getGlobalAudio();
                if (audio) {
                    audio.play().catch(() => { });
                }
            }
        };

        window.addEventListener('soundToggle', handleToggleEvent);
        window.addEventListener('pauseBackgroundMusic', handlePauseBgMusic);
        window.addEventListener('resumeBackgroundMusic', handleResumeBgMusic);

        return () => {
            window.removeEventListener('soundToggle', handleToggleEvent);
            window.removeEventListener('pauseBackgroundMusic', handlePauseBgMusic);
            window.removeEventListener('resumeBackgroundMusic', handleResumeBgMusic);
        };
    }, []);

    const toggleSound = () => {
        const newSoundState = !isSoundOn;
        setIsSoundOn(newSoundState);
        localStorage.setItem('isSoundOn', String(newSoundState));

        // Play or pause the global audio element
        const audio = getGlobalAudio();
        if (audio) {
            if (newSoundState) {
                audio.play().catch((err) => {
                    console.warn('Playback failed:', err);
                });
            } else {
                audio.pause();
            }
        }

        // Dispatch event to sync state across other components and audio-players
        window.dispatchEvent(new Event('soundToggle'));
    };

    return (
        <button
            onClick={toggleSound}
            type="button"
            className={className}
            style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                outline: 'none',
                ...(!className && !style?.position ? { position: 'relative' } : {}),
                ...style
            }}
            aria-label="Toggle Sound"
        >
            <Image
                src={isSoundOn ? '/main_assets/sound_on.webp' : '/main_assets/sound_off.webp'}
                alt="Sound Toggle"
                fill
                sizes="80px"
                className="icon-img"
                priority
                unoptimized
            />
        </button>
    );
}
