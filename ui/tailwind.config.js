const defaultTheme = require('tailwindcss/defaultTheme');

const colors = defaultTheme.colors;

module.exports = {
  purge: [],
  content: ["./src/**/*.{html,js}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        background: '#E5E5E5',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: {
          ...colors.gray,
          bg: '#E9E9E9'
        },
        red: {
          ...colors.red,
          primary: '#D33658',
          'primary-light': '#DE4B39'
        },
        yellow: colors.yellow,
        primary: {
          default: '#1c4bed',
        },
        blue: {
          accent: '#0047AB',
          100: '#ebf8ff',
          200: '#bee3f8',
          300: '#90cdf4',
          400: '#63b3ed',
          500: '#3BADE4',
          600: '#3182ce',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#2a4365',
          light: '#76C7CF',
        },
      },
      fill: {
        blue: '#3B5997',
      },
      spacing: {
        px: '1px',
        0: '0',
        1: '0.4rem',
        2: '0.8rem',
        3: '1.2rem',
        4: '1.6rem',
        5: '2rem',
        6: '2.4rem',
        8: '2.8rem',
        9: '3rem',
        10: '3.2rem',
        12: '3.6rem',
        16: '4rem',
        18: '4.4rem',
        20: '4.8rem',
        22: '5.2rem',
        24: '5.6rem',
        26: '6rem',
        28: '6.4rem',
        29: '6.8rem',
        31: '7rem',
        32: '8rem',
        40: '10rem',
        48: '12rem',
        56: '14rem',
        64: '16rem',
        74: '20rem',
        75: '21rem',
        76: '22rem',
        78: '24rem',
        80: '26.4rem',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        sm: ['1.2rem', '2.0rem'],
        base: ['1.4rem', '2.2rem'],
        lg: ['1.6rem', '2.0rem'],
        section: ['2rem', '2.0rem'],
        xl: ['3rem', '3.8rem'],
        xxl: ['3.6rem', '4rem'],
        label: ['1.4rem', '2.8rem'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
