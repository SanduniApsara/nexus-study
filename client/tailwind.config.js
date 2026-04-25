/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
        serif:   ['Instrument Serif', 'serif'],
      },
      colors: {
        bg:       '#0a0a0f',
        bg2:      '#111118',
        bg3:      '#1a1a24',
        border:   '#252535',
        borderHi: '#35354a',
        accent:   '#c8f050',
        violet:   '#7b5ea7',
        danger:   '#f05050',
        sky:      '#50b4f0',
        text1:    '#f0f0fa',
        text2:    '#9090a8',
        text3:    '#555568',
      },
      borderRadius: {
        xl2: '18px',
      },
      animation: {
        'fade-up':    'fadeUp 0.4s ease both',
        'fade-in':    'fadeIn 0.3s ease both',
        'pulse-glow': 'pulseGlow 2.4s ease-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,240,80,0.4)' }, '70%': { boxShadow: '0 0 0 10px rgba(200,240,80,0)' } },
      },
    },
  },
  plugins: [],
}
