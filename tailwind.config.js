const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: true,
    content: ['./index.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      blue: colors.blue,
      lightblue: colors.lightBlue,
      purple: colors.purple,
      green: colors.green,
      red: colors.rose,
      yellow: colors.amber
    },
    extend: {
      height: {
        '50vh': '50vh'
      }
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last']
    }
  },
  plugins: [],
}