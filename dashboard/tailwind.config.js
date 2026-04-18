/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00bfff',
                'neon-cyan': '#00ffff',
                'neon-green': '#00ff88',
                'dark-bg': '#0a0f1c',
                'dark-card': '#181f2a',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'slide-up': 'slideUp 0.8s ease-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'counter': 'counterUp 1.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    'from': { opacity: '0', transform: 'translateY(20px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' }
                },
                slideUp: {
                    'from': { opacity: '0', transform: 'translateY(40px)' },
                    'to': { opacity: '1', transform: 'translateY(0)' }
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 191, 255, 0.8)' }
                },
                counterUp: {
                    'from': { transform: 'scale(0.8)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' }
                }
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
            }
        },
    },
    plugins: [],
}