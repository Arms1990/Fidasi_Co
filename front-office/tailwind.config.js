const colors = require('tailwindcss/colors');

module.exports = {
    prefix: '',
    purge: {
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      colors: {
        ...colors,
        primary: {
          '50': '#fef9f3',
          '100': '#fef3e6',
          '200': '#fbe2c1',
          '300': '#f9d19b',
          '400': '#f5ae51',
          '500': '#F08B06',
          '600': '#d87d05',
          '700': '#b46805',
          '800': '#905304',
          '900': '#764403'
        },
        secondary: colors.yellow,
        neutral: colors.gray
      },
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),require('@tailwindcss/line-clamp'),require('@tailwindcss/typography')],
};
