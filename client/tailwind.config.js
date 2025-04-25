/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {backgroundImage: theme => ({
      'hero-pattern': "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQYdEmdb89KzWM_7DX6KR4sqS1RX0nP3-VFA&s')"
              })
            },
  },
  plugins: [],
}

