
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				trndsky: {
					blue: '#2E86DE',      // Bird's head blue
					yellow: '#F9CA24',    // Bird's chest yellow
					red: '#EA5455',       // Bird's body red/orange
					green: '#26A69A',     // Bird's feathers green
					lightblue: '#7CC6FE', // Lighter blue shade
					gray: '#F5F7FA',      // Light background gray
					darkblue: '#1A5DAD',  // Darker blue for contrast
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-100%)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'bounce-slow': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-15px)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.85',
						transform: 'scale(0.98)'
					}
				},
				'grow': {
					'from': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'to': {
						transform: 'scale(1)',
						opacity: '1'
					}
				},
				'spin-slow': {
					'from': {
						transform: 'rotate(0deg)'
					},
					'to': {
						transform: 'rotate(360deg)'
					}
				},
				'shine': {
					'100%': {
						left: '125%',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-in': 'slide-in 0.8s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'bounce-slow': 'bounce-slow 3.5s ease-in-out infinite',
				'float': 'float 5s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'grow': 'grow 0.4s ease-out',
				'spin-slow': 'spin-slow 8s linear infinite',
				'shine': 'shine 1.5s',
			},
			transitionProperty: {
				'height': 'height',
				'spacing': 'margin, padding',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'hero-blue': 'linear-gradient(135deg, #2E86DE 0%, #7CC6FE 100%)',
				'card-yellow': 'linear-gradient(135deg, #F9CA24 0%, #FFEDAC 100%)',
				'accent-red': 'linear-gradient(135deg, #EA5455 0%, #FEB692 100%)',
				'success-green': 'linear-gradient(135deg, #26A69A 0%, #81E6D9 100%)',
				'dual-tone': 'linear-gradient(135deg, #2E86DE 0%, #F9CA24 100%)',
				'tri-tone': 'linear-gradient(135deg, #2E86DE 0%, #26A69A 50%, #F9CA24 100%)',
			},
			boxShadow: {
				'soft-lg': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
				'soft-xl': '0 20px 35px -15px rgba(0, 0, 0, 0.1)',
				'soft-2xl': '0 25px 45px -20px rgba(0, 0, 0, 0.1)',
				'blue-glow': '0 0 15px rgba(46, 134, 222, 0.4)',
				'yellow-glow': '0 0 15px rgba(249, 202, 36, 0.4)',
				'red-glow': '0 0 15px rgba(234, 84, 85, 0.4)',
				'green-glow': '0 0 15px rgba(38, 166, 154, 0.4)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

