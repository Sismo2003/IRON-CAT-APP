const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    fontFamily: {
      'public': ['"Public Sans", sans-serif'],
      'tourney': ['"Tourney", sans-serif'],
      'remix': ['remixicon']
    },
    container: {
      center: true,
    },
    extend: {
      fontSize: {
        sm: '0.8125rem', // 13px
        base: '0.875rem', // 14px
        15: '0.9375rem', // 15px
        16: '1rem', // 16px
        'vertical-menu-item-font-size': '0.875rem',
      },
      colors: {
        body: colors.slate[800],
        'body-bg': colors.slate[100],
        'body-bordered': colors.white,

        // Sidebar light
        'vertical-menu': colors.white,
        'vertical-menu-border': colors.slate[200],
        'vertical-menu-item': colors.slate[400],
        'vertical-menu-item-hover': colors.blue[500],
        'vertical-menu-item-bg-hover': colors.blue[50],
        'vertical-menu-item-active': colors.blue[500],
        'vertical-menu-item-bg-active': colors.blue[50],
        'vertical-menu-sub-item': colors.slate[400],
        'vertical-menu-sub-item-hover': colors.blue[500],
        'vertical-menu-sub-item-active': colors.blue[500],

        // Sidebar dark
        'vertical-menu-dark': colors.slate[900],
        'vertical-menu-border-dark': colors.slate[900],
        'vertical-menu-item-dark': colors.slate[500],
        'vertical-menu-item-hover-dark': colors.blue[500],
        'vertical-menu-item-bg-hover-dark': colors.slate[800],
        'vertical-menu-item-active-dark': colors.blue[500],
        'vertical-menu-item-bg-active-dark': colors.slate[800],
        'vertical-menu-sub-item-dark': colors.slate[500],
        'vertical-menu-sub-item-hover-dark': colors.blue[500],
        'vertical-menu-sub-item-active-dark': colors.blue[500],

        // Sidebar brand
        'vertical-menu-brand': colors.blue[900],
        'vertical-menu-border-brand': colors.blue[900],
        'vertical-menu-item-brand': colors.blue[300],
        'vertical-menu-item-hover-brand': colors.blue[50],
        'vertical-menu-item-bg-hover-brand': '#224097',
        'vertical-menu-item-active-brand': colors.blue[50],
        'vertical-menu-item-bg-active-brand': '#224097',
        'vertical-menu-sub-item-brand': '#a4bbfd',
        'vertical-menu-sub-item-hover-brand': colors.blue[50],
        'vertical-menu-sub-item-active-brand': colors.blue[50],

        // Sidebar modern
        'vertical-menu-to-modern': colors.blue[900],
        'vertical-menu-form-modern': colors.green[900],
        'vertical-menu-border-modern': colors.blue[900],
        'vertical-menu-item-modern': 'rgba(255, 255, 255, 0.60)',
        'vertical-menu-item-hover-modern': 'rgba(255, 255, 255)',
        'vertical-menu-item-bg-hover-modern': 'rgba(255, 255, 255, 0.06)',
        'vertical-menu-item-active-modern': colors.blue[50],
        'vertical-menu-item-bg-active-modern': 'rgba(255, 255, 255, 0.06)',
        'vertical-menu-sub-item-modern': 'rgba(255, 255, 255, 0.50)',
        'vertical-menu-sub-item-hover-modern': colors.white,
        'vertical-menu-sub-item-active-modern': colors.white,

        // Topbar
        'topbar': colors.white,
        'topbar-border': colors.slate[200],
        'topbar-item': colors.slate[700],
        'topbar-item-hover': colors.slate[800],
        'topbar-item-bg-hover': colors.slate[100],

        'topbar-dark': colors.slate[900],
        'topbar-border-dark': colors.slate[700],
        'topbar-item-dark': colors.slate[400],
        'topbar-item-hover-dark': colors.slate[100],
        'topbar-item-bg-hover-dark': colors.slate[800],

        'topbar-brand': colors.blue[900],
        'topbar-border-brand': colors.blue[800],
        'topbar-item-brand': '#a4bbfd',
        'topbar-item-hover-brand': colors.white,
        'topbar-item-bg-hover-brand': '#224097',

        'topbar-modern': colors.white,
      },
      spacing: {
        'header': '4.375rem', // 70px
        'vertical-menu': '16.25rem', // 260px
        'vertical-menu-md': '10.3125rem', // 165px
        'vertical-menu-sm': '4.375rem', // 70px
      },
      maxWidth: {
        'boxed': '87.5rem', // 1400px
      },
      minHeight: {
        'sm': '1650px', // 1650px
      },
      zIndex: {
        'drawer': '1050',
      },
      backgroundImage: {
        'auth-pattern': "url('/assets/images/auth-bg.jpg')",
        'auth-pattern-dark': "url('/assets/images/auth-bg-dark.jpg')",
      },
      animation: {
        'icons': 'iconsAnimation 50s',
        'progress': 'progressAnimation 2s',
      },
      keyframes: {
        iconsAnimation: {
          'to': { strokeDashoffset: '500' }
        },
        progressAnimation: {
          '0%': {
            width: '0'
          }
        }
      },
      aspectRatio: {
        '1/1': '1 / 1',
        '4/3': '4 / 3',
        '16/9': '16 / 9',
        '21/9': '21 / 9',
      },
      clipPath: {
        'triangle': 'polygon(50% 0%, 0% 100%, 100% 100%)',
      },
    },
  }
};
