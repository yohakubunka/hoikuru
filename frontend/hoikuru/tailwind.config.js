/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", // ページディレクトリ
    "./app/**/*.{js,ts,jsx,tsx}", // ページディレクトリ
    "./components/**/*.{js,ts,jsx,tsx}", // コンポーネントディレクトリ
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};