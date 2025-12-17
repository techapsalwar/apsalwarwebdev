import { useAppearance } from '@/hooks/use-appearance';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function ThemeToggle({ className }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(false);

    // Sync local state with appearance hook
    useEffect(() => {
        if (appearance === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(systemDark);
        } else {
            setIsDark(appearance === 'dark');
        }
    }, [appearance]);

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        updateAppearance(newMode);
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative flex h-9 w-16 items-center rounded-full border border-slate-200 bg-slate-100 p-1 shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400/50 dark:border-slate-700 dark:bg-slate-900",
                className
            )}
            aria-label="Toggle theme"
        >
            {/* Sliding Indicator */}
            <motion.div
                className="absolute h-7 w-7 rounded-full bg-white shadow-sm dark:bg-slate-800"
                initial={false}
                animate={{
                    x: isDark ? 28 : 0,
                    backgroundColor: isDark ? '#1e293b' : '#ffffff' // slate-800 : white
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
            >
                {/* Icons inside the slider for seamless effect (optional, or keep them static outside) */}
                <div className="flex h-full w-full items-center justify-center">
                    <motion.div
                        initial={false}
                        animate={{ opacity: isDark ? 1 : 0, scale: isDark ? 1 : 0.5, rotate: isDark ? 0 : 90 }}
                        className="absolute"
                    >
                        <Moon className="h-4 w-4 text-indigo-400" fill="currentColor" />
                    </motion.div>
                    <motion.div
                        initial={false}
                        animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.5 : 1, rotate: isDark ? -90 : 0 }}
                        className="absolute"
                    >
                        <Sun className="h-4 w-4 text-amber-500" fill="currentColor" />
                    </motion.div>
                </div>
            </motion.div>

            {/* Static Background Icons (Optional, for "track" effect) */}
            <div className="flex w-full justify-between px-2">
                <span className="sr-only">Light</span>
                <span className="sr-only">Dark</span>
            </div>
        </button>
    );
}
