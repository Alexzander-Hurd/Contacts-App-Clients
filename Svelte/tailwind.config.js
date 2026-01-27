/**@type {import('tailwindcss').Config')} */
export default {
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#7e22ce',
				'background-light': '#f3f0f7',
				'background-dark': '#1a0f1f',
				'card-light': '#ffffff',
				'card-dark': '#2d1b36'
			},
			fontFamily: {
				display: ['Inter']
			},
			borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' }
		}
	}
};
