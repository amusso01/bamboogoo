import Swiper from 'swiper'
import { Autoplay, Thumbs, EffectFade } from 'swiper/modules'

function initHeroSlider() {
	document.arrive(
		'.fdry-slider-hero__swiper',
		{ existing: true },
		function (heroSlider) {
			if (!heroSlider.swiper) {
				const sliderContainer = heroSlider.closest('.fdry-slider-hero')
				const paginationItems = sliderContainer.querySelectorAll(
					'.fdry-slider-hero__pagination-item'
				)
				const progressBars = sliderContainer.querySelectorAll(
					'.fdry-slider-hero__progress-bar-fill'
				)

				// Get timing from data attributes
				const slideSpeed = parseInt(heroSlider.dataset.fadeDuration) || 1000
				const autoplayDelay = parseInt(heroSlider.dataset.autoplayDelay) || 3000

				// Set CSS variable for fade duration
				heroSlider.style.setProperty('--fade-duration', `${slideSpeed}ms`)

				// Check if we have multiple slides
				const hasMultipleSlides = paginationItems.length > 0

				function updateProgressBar(slideIndex) {
					if (!hasMultipleSlides) return

					// Calculate the actual slide index (handle loop mode)
					const currentIndex = slideIndex % paginationItems.length

					// Reset all progress bars immediately
					progressBars.forEach((bar, index) => {
						if (index !== currentIndex) {
							bar.style.transition = 'none'
							bar.style.width = '0'
						}
					})

					// Remove active class from all items
					paginationItems.forEach((item) => {
						item.classList.remove('active')
					})

					// Get current bar and item
					const currentBar = progressBars[currentIndex]
					const currentItem = paginationItems[currentIndex]

					if (currentItem && currentBar) {
						// Reset current bar first
						currentBar.style.transition = 'none'
						currentBar.style.width = '0'

						// Add active class
						currentItem.classList.add('active')

						// Force reflow
						void currentBar.offsetWidth

						// Progress bar should fill during: autoplayDelay + slideSpeed
						// So it reaches 100% exactly when the NEXT slide starts fading
						const totalDuration = autoplayDelay + slideSpeed

						// Start progress bar animation after a small delay
						requestAnimationFrame(() => {
							requestAnimationFrame(() => {
								currentBar.style.transition = `width ${totalDuration}ms linear`
								currentBar.style.width = '100%'
							})
						})
					}
				}

				// Configure swiper options based on slide count
				const swiperOptions = {
					speed: 1000,
					slidesPerView: 1,
					spaceBetween: 0,
					loop: hasMultipleSlides,
					allowTouchMove: false,
					preventClicks: false,
					preventClicksPropagation: false,
					simulateTouch: false,
					modules: [EffectFade],
					effect: 'fade',
					fadeEffect: {
						crossFade: true,
					},
				}

				// Only add autoplay if we have multiple slides
				if (hasMultipleSlides) {
					swiperOptions.modules.push(Autoplay)
					swiperOptions.autoplay = {
						delay: autoplayDelay,
						disableOnInteraction: false,
					}
					swiperOptions.on = {
						autoplayStart: function () {
							// Start progress bar when autoplay actually starts
							// This ensures perfect sync between autoplay countdown and progress bar
							updateProgressBar(this.realIndex)
						},
						slideChangeTransitionStart: function () {
							// Start progress bar when slide starts fading
							// This makes the new bar start filling during the fade
							updateProgressBar(this.realIndex)
						},
					}
				}

				const swiper = new Swiper(heroSlider, swiperOptions)
			}
		}
	)
}

function initProductMediaGallery() {
	document.arrive(
		'.swiper-product-gallery',
		{ existing: true },
		function (gallerySlider) {
			if (!gallerySlider.swiper) {
				const galleryContainer = gallerySlider.closest(
					'.fdry-product-media-gallery'
				)
				const thumbnailSlider = galleryContainer.querySelector(
					'.swiper-product-thumbnails'
				)

				// Check if thumbnail slider exists
				if (!thumbnailSlider) {
					console.warn('Product media gallery: Thumbnail slider not found')
					return
				}

				// Initialize thumbnail slider first
				const thumbsSwiper = new Swiper(thumbnailSlider, {
					modules: [Thumbs],
					loop: true,
					slidesPerView: 'auto',
					spaceBetween: 12,
					direction: 'horizontal',
					watchSlidesProgress: true,

					breakpoints: {
						750: {
							slidesPerView: 'auto',
							direction: 'vertical',
						},
					},
				})

				// Initialize main gallery slider with thumbs
				const gallerySwiper = new Swiper(gallerySlider, {
					modules: [Thumbs],
					loop: true,
					slidesPerView: 1,
					spaceBetween: 0,
					thumbs: {
						swiper: thumbsSwiper,
					},
				})
			}
		}
	)
}

function initSliderSection() {
	document.arrive(
		'.fdry-slider-section__slides',
		{ existing: true },
		function (sliderSection) {
			if (!sliderSection.swiper) {
				const swiper = new Swiper(sliderSection, {
					slidesPerView: 3.2,
					spaceBetween: 32,
					rewind: true,
					breakpoints: {
						320: {
							slidesPerView: 1.1,
							spaceBetween: 16,
						},
						750: {
							slidesPerView: 2.2,
							spaceBetween: 24,
						},
						990: {
							slidesPerView: 3.2,
							spaceBetween: 32,
						},
					},
				})
			}
		}
	)
}

function initBlogShowcase() {
	document.arrive(
		'.fdry-blog-showcase__articles',
		{ existing: true },
		function (blogShowcase) {
			if (!blogShowcase.swiper) {
				const swiper = new Swiper(blogShowcase, {
					slidesPerView: 'auto',
					spaceBetween: 24,
					rewind: true,
					breakpoints: {
						320: {
							slidesPerView: 1.15,
							spaceBetween: 16,
						},
						750: {
							slidesPerView: 'auto',
							spaceBetween: 20,
						},
						990: {
							slidesPerView: 'auto',
							spaceBetween: 24,
						},
					},
				})
			}
		}
	)
}

export default function siteSlider() {
	initHeroSlider()
	initProductMediaGallery()
	initSliderSection()
	initBlogShowcase()
}
