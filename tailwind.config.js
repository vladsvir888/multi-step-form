/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.vue', './src/App.vue'],
  theme: {
    extend: {
      animation: {
        rotate: 'rotate 1s infinite'
      },
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(5deg)' },
          '50%': { transform: 'rotate(20deg)' },
          '100%': { transform: 'rotate(5deg)' }
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif']
      },
      backgroundImage: {
        'result-table-gradient': 'linear-gradient(180deg, #00c4b3 0%, #13284a00 100%)',
        check:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj4KICAgIDxwYXRoIGQ9Ik00MzguNiAxMDUuNGMxMi41IDEyLjUgMTIuNSAzMi44IDAgNDUuM2wtMjU2IDI1NmMtMTIuNSAxMi41LTMyLjggMTIuNS00NS4zIDBsLTEyOC0xMjhjLTEyLjUtMTIuNS0xMi41LTMyLjggMC00NS4zczMyLjgtMTIuNSA0NS4zIDBMMTYwIDMzOC43IDM5My40IDEwNS40YzEyLjUtMTIuNSAzMi44LTEyLjUgNDUuMyAweiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+')"
      }
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      'persian-green': '#00a99a',
      'robins-egg-blue': '#00c4b3',
      alto: '#dddddd',
      black: '#000000',
      'black-50': 'rgba(0, 0, 0, 0.5)',
      'blue-zodiac': '#13284a',
      scorpion: '#606060',
      amaranth: '#ec2b59',
      'morning-glory': '#9ee2dc',
      'hokey-pokey': '#00c4b329'
    },
    screens: {
      tablet: '600px',
      laptop: '900px'
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
}
