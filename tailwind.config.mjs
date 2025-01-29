/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ['class'],
  darkMode: ['selector', 'class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  prefix: '',
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		typography: (theme) => ({
  			DEFAULT: {
  				css: {
  					lineHeight: '1.8',
  					fontWeight: '300',
  					color: theme('colors.zinc.700'),
  					letterSpacing: theme('letterSpacing.wide'),
  					a: {
  						fontWeight: '400',
  						color: theme('colors.zinc.900'),
  						textDecoration: 'underline',
  						textDecorationColor: theme('colors.zinc.400/50'),
  						textUnderlineOffset: '3px',
  						textDecorationThickness: '1px',
  						transition: 'all 200ms ease',
  						'&:hover': {
  							color: theme('colors.zinc.900'),
  							textDecorationColor: theme('colors.zinc.900/50')
  						}
  					}
  				}
  			}
  		}),
  		borderWidth: {
  			'5': '5px',
  			'6': '6px'
  		},
  		colors: {
  			shark: {
  				'50': '#f6f8f9',
  				'100': '#ebeff3',
  				'200': '#d3dce4',
  				'300': '#adbecc',
  				'400': '#819baf',
  				'500': '#617f96',
  				'600': '#4d667c',
  				'700': '#3f5365',
  				'800': '#374755',
  				'900': '#313d49',
  				'950': '#232b34'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Switzer',
  				'sans'
  			],
  			mono: [
  				'DM Mono"',
  				'monospace'
  			],
  			secondary: [
  				'Fustat SemiBold", sans',
  				{}
  			]
  		},
  		screens: {
  			xs: '480px'
  		},
  		transitionDuration: {
  			'400': '400ms',
  			'500': '500ms',
  			'600': '600ms',
  			'800': '800ms',
  			'900': '900ms'
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
  			gradient: {
  				to: {
  					backgroundPosition: 'var(--bg-size) 0'
  				}
  			},
  			marquee: {
  				from: {
  					transform: 'translateX(0)'
  				},
  				to: {
  					transform: 'translateX(calc(-100% - var(--gap)))'
  				}
  			},
  			'marquee-vertical': {
  				from: {
  					transform: 'translateY(0)'
  				},
  				to: {
  					transform: 'translateY(calc(-100% - var(--gap)))'
  				}
  			},
  			hide: {
  				from: {
  					opacity: '1'
  				},
  				to: {
  					opacity: '0'
  				}
  			},
  			slideDownAndFade: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(-6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideLeftAndFade: {
  				from: {
  					opacity: '0',
  					transform: 'translateX(6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideUpAndFade: {
  				from: {
  					opacity: '0',
  					transform: 'translateY(6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideRightAndFade: {
  				from: {
  					opacity: '0',
  					transform: 'translateX(-6px)'
  				},
  				to: {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			gradient: 'gradient 8s linear infinite',
  			marquee: 'marquee var(--duration) infinite linear',
  			'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
  			hide: 'hide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideDownAndFade: 'slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideLeftAndFade: 'slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideUpAndFade: 'slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
  			slideRightAndFade: 'slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)'
  		}
  	}
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')]
}
