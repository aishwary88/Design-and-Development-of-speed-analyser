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
                'neon-orange': '#ff9800',
                'neon-red': '#ff4757',
            },
            animation: {
                'counter': 'counterUp 1.5s ease-out',
                'data-flow': 'dataFlow 3s ease-in-out infinite',
                'scan-line': 'scanLine 2s linear infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
            },
            keyframes: {
                counterUp: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                dataFlow: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
                scanLine: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)' },
                    '50%': { boxShadow: '0 0 40px rgba(0, 191, 255, 0.8)' },
                },
            },
        },
    },
    plugins: [],
}
