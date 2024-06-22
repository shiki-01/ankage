import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import svelteUx from "svelte-ux/plugins/tailwind.cjs";
import colors from "tailwindcss/colors"

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		'./node_modules/svelte-ux/**/*.{svelte,js}'
	],
	safelist: ["dark"],
	theme: {
		"light": {
			"color-scheme": "light",
			"primary": "#5E81AC",
			"secondary": "#81A1C1",
			"accent": "#88C0D0",
			"neutral": "#4C566A",
			"info": "#B48EAD",
			"success": "#A3BE8C",
			"warning": "#EBCB8B",
			"danger": "#BF616A",
			"surface-100": "#ECEFF4",
			"surface-200": "#E5E9F0",
			"surface-300": "#D8DEE9"
		},
		"dark": {
			"color-scheme": "dark",
			"primary": "#1C4E80",
			"secondary": "#7C909A",
			"accent": "#EA6947",
			"neutral": "#23282E",
			"info": "#0091D5",
			"success": "#6BB187",
			"warning": "#DBAE59",
			"danger": "#AC3E31",
			"surface-100": "#202020"
		},
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)"
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			}
		}
	},
	plugins: [
		svelteUx,  // uses hsl() color space by default. To use oklch(), use: svelteUx({ colorSpace: 'oklch' }),
	  ]
};

export default config;