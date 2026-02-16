// ===== INTRO SCREEN ELEMENTS =====
const introScreen = document.getElementById("intro-screen");
const arrangementsContainer = document.getElementById("arrangements-container");
const headline = document.getElementById("headline");
const hero = document.getElementById("hero");
const middle = document.querySelector(".middle");
const left = document.querySelector(".left");
const right = document.querySelector(".right");

// ===== VIEWPORT =====
let vw = window.innerWidth;
let vh = window.innerHeight;

function updateViewport() {
    vw = window.innerWidth;
    vh = window.innerHeight;
}
updateViewport();
window.addEventListener("resize", updateViewport);
window.addEventListener("orientationchange", updateViewport);

// ===== INTRO ENTRANCE ANIMATION =====
requestAnimationFrame(() => {
    headline.classList.add("visible");
});

// ===== MOUSE TRACKING ON INTRO =====
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
const INTENSITY = 0.07;

document.addEventListener("mousemove", (e) => {
    if (!introScreen.classList.contains("active")) return;
    
    const nx = (e.clientX / vw - 0.5);
    const ny = (e.clientY / vh - 0.5);
    const maxOffset = Math.min(vw, vh) * INTENSITY;

    targetX = nx * maxOffset;
    targetY = ny * maxOffset;
});

function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    if (hero) {
        hero.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    requestAnimationFrame(animate);
}
animate();

// ===== SCROLL EASTER EGG ON INTRO =====
let state = 1; // 0 = "explain better", 1 = "speak louder"
let isTransitioning = false;

// Initialize with "speak louder"
middle.textContent = "speak louder";

document.addEventListener("wheel", (e) => {
    if (!introScreen.classList.contains("active")) return;
    
    e.preventDefault();
    
    if (isTransitioning) return;
    
    if (e.deltaY > 0 && state === 1) {
        // Scroll down: speak → explain
        isTransitioning = true;
        state = 0;
        
        middle.style.transition = "transform 0.4s ease";
        middle.style.transform = "translateY(-100%)";
        
        setTimeout(() => {
            left.classList.remove("expanded");
            right.classList.remove("expanded");
        }, 50);
        
        setTimeout(() => {
            middle.textContent = "explain better";
            middle.style.transition = "none";
            middle.style.transform = "translateY(100%)";
            requestAnimationFrame(() => {
                middle.style.transition = "transform 0.4s ease";
                middle.style.transform = "translateY(0)";
                setTimeout(() => { isTransitioning = false; }, 400);
            });
        }, 400);
        
    } else if (e.deltaY < 0 && state === 0) {
        // Scroll up: explain → speak
        isTransitioning = true;
        state = 1;
        
        middle.style.transition = "transform 0.4s ease";
        middle.style.transform = "translateY(100%)";
        
        setTimeout(() => {
            left.classList.add("expanded");
            right.classList.add("expanded");
        }, 50);
        
        setTimeout(() => {
            middle.textContent = "speak louder";
            middle.style.transition = "none";
            middle.style.transform = "translateY(-100%)";
            requestAnimationFrame(() => {
                middle.style.transition = "transform 0.4s ease";
                middle.style.transform = "translateY(0)";
                setTimeout(() => { isTransitioning = false; }, 400);
            });
        }, 400);
    }
}, { passive: false });

// ===== ARRANGEMENTS MANAGEMENT =====
const arrangements = document.querySelectorAll('.arrangement');
const totalArrangements = arrangements.length;
let currentIndex = 0;
let onIntroScreen = true;

function showArrangement(index) {
    // Get the currently active arrangement (if any)
    const currentArrangement = document.querySelector('.arrangement.active');
    
    if (currentArrangement) {
        // Get all media elements in current arrangement
        const currentMedia = Array.from(currentArrangement.querySelectorAll('video, img'));
        
        // Shuffle them randomly for fade out
        const shuffledOutMedia = currentMedia.sort(() => Math.random() - 0.5);
        
        // Fade out each media element sequentially
        shuffledOutMedia.forEach((media, i) => {
            setTimeout(() => {
                media.classList.remove('fade-in');
                // Pause videos when they fade out
                if (media.tagName === 'VIDEO') {
                    // Pause after fade completes (0.4s)
                    setTimeout(() => media.pause(), 400);
                }
            }, i * 500); // 500ms = 0.5 seconds between each
        });
        
        // Calculate total fade out time (0.4s fade duration)
        const fadeOutTime = (shuffledOutMedia.length * 500) + 400; // last element + its 0.4s fade
        
        // Wait for fade out to complete before switching arrangements
        setTimeout(() => {
            currentArrangement.classList.remove('active');
            startNewArrangement(index);
        }, fadeOutTime);
    } else {
        // No current arrangement, start immediately
        startNewArrangement(index);
    }
}

function startNewArrangement(index) {
    // Add active class to new arrangement
    arrangements[index].classList.add('active');
    
    // Get all media elements in this arrangement
    const mediaElements = Array.from(arrangements[index].querySelectorAll('video, img'));
    
    // Shuffle the media elements randomly
    const shuffledMedia = mediaElements.sort(() => Math.random() - 0.5);
    
    // Fade in each media element sequentially with 0.5s delay between each
    // Add 100ms initial delay so the first element also animates in smoothly
    shuffledMedia.forEach((media, i) => {
        setTimeout(() => {
            media.classList.add('fade-in');
            // If it's a video, play it when it fades in
            if (media.tagName === 'VIDEO') {
                media.play();
            }
        }, 100 + (i * 500)); // 100ms initial delay + 500ms between each
    });
}

function nextArrangement() {
    currentIndex++;
    if (currentIndex >= totalArrangements) {
        currentIndex = 0; // Loop back to first arrangement
    }
    showArrangement(currentIndex);
}

function transitionToArrangements() {
    onIntroScreen = false;
    introScreen.classList.remove('active');
    arrangementsContainer.classList.add('active');
    startNewArrangement(currentIndex);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (event) => {
    if (event.key === 'e' || event.key === 'E') {
        if (onIntroScreen) {
            // Transition from intro to arrangements
            transitionToArrangements();
        } else {
            // Cycle through arrangements
            nextArrangement();
        }
    }
});

// ===== INITIALIZE =====
// Intro screen starts active (set in HTML)
// Arrangements container starts hidden
// First arrangement is set to active for when we transition

// Remove any default active states from arrangements on load
arrangements.forEach(arr => {
    arr.classList.remove('active');
    arr.querySelectorAll('video, img').forEach(media => {
        media.classList.remove('fade-in');
    });
});