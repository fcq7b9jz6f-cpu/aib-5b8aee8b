
import { initScene } from './scene.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Three.js scene
    initScene();

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate sections on scroll
    const sections = document.querySelectorAll('.content-section');

    sections.forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 50 }, 
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
    
    // Animate gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            delay: (index % 2) * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.gallery',
                start: 'top 80%',
            }
        });
    });
});
