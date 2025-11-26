import Lenis from 'lenis'
// Import GSAP and ScrollTrigger
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

/**
 * Initializes smooth scrolling functionality
 * Sets up Lenis for smooth scrolling and integrates with GSAP ScrollTrigger
 */
export function initSmoothScroll() {
	// Don't initialize in the Shopify editor
	if (window.Shopify && window.Shopify.designMode) return

	// Initialize a new Lenis instance for smooth scrolling
	const lenis = new Lenis({
		duration: 1.2,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		wheelMultiplier: 1,
		smoothTouch: false,
		touchMultiplier: 2,
		anchors: true,
	})

	// Expose lenis globally for sections to access
	window.lenisScroller = lenis

	// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
	lenis.on('scroll', ScrollTrigger.update)

	// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
	// This ensures Lenis's smooth scroll animation updates on each GSAP tick
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000) // Convert time from seconds to milliseconds
	})

	// Disable lag smoothing in GSAP to prevent any delay in scroll animations
	gsap.ticker.lagSmoothing(0)

	// ScrollTrigger.create({
	// 	trigger: 'main',
	// 	start: 'top top',
	// 	end: 'bottom bottom',
	// 	onEnter: () =>
	// 		console.log('ScrollTrigger integration working: onEnter triggered'),
	// 	onLeaveBack: () =>
	// 		console.log('ScrollTrigger integration working: onLeaveBack triggered'),
	// 	markers: true,
	// })
}
