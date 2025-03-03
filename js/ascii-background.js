// ASCII Fireworks Background for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        font: 8,  // Base font size
        ascii: '@#S%?*+;:,.',
        sample: 1,
        color: true,
        // Color palette for the ASCII art (dark purples and greys)
        colorPalette: [
            { r: 74, g: 20, b: 140 },  // Dark purple
            { r: 94, g: 53, b: 177 },  // Medium purple
            { r: 113, g: 75, b: 181 }, // Light purple
            { r: 58, g: 58, b: 60 },   // Dark grey
            { r: 88, g: 88, b: 91 }    // Medium grey
        ]
    };

    // Canvas setup
    const canvas = document.getElementById('ascii-canvas');
    if (!canvas) {
        console.error('ASCII canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const offscreen = document.createElement('canvas');
    const offscreenCtx = offscreen.getContext('2d', { willReadFrequently: true });
    
    // Video setup
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.loop = true;
    video.src = 'https://assets.codepen.io/605876/firework.mp4';
    
    // Original video dimensions (16:9 aspect ratio for the fireworks video)
    const videoAspectRatio = 200 / 9;
    
    // Determine appropriate font size based on screen width
    function getResponsiveFontSize() {
        const width = window.innerWidth;
        if (width <= 480) {
            return 6; // Smaller font for mobile
        } else if (width <= 768) {
            return 7; // Medium font for tablets
        } else {
            return 8; // Default font size for larger screens
        }
    }
    
    // Get color based on brightness
    function getColor(brightness) {
        // Map brightness to color palette index
        // Brighter pixels get more purple tones, darker pixels get grey tones
        let colorIndex;
        if (brightness > 200) {
            colorIndex = 2; // Light purple for brightest spots
        } else if (brightness > 150) {
            colorIndex = 1; // Medium purple
        } else if (brightness > 100) {
            colorIndex = 0; // Dark purple
        } else if (brightness > 50) {
            colorIndex = 3; // Dark grey
        } else {
            colorIndex = 4; // Medium grey
        }
        
        const color = config.colorPalette[colorIndex];
        return color;
    }
    
    // Set canvas size to match hero section while maintaining aspect ratio
    function resizeCanvas() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const { width, height } = heroSection.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            
            // Update font size based on screen width
            config.font = getResponsiveFontSize();
            
            // Calculate dimensions that maintain aspect ratio and cover the container
            let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
            const containerAspectRatio = width / height;
            
            if (containerAspectRatio > videoAspectRatio) {
                // Container is wider than video
                drawWidth = width;
                drawHeight = width / videoAspectRatio;
                offsetY = (height - drawHeight) / 2;
            } else {
                // Container is taller than video
                drawHeight = height;
                drawWidth = height * videoAspectRatio;
                offsetX = (width - drawWidth) / 2;
            }
            
            // Store these values for use in rendering
            config.drawDimensions = {
                width: drawWidth,
                height: drawHeight,
                offsetX: offsetX,
                offsetY: offsetY
            };
            
            // Set offscreen canvas to match the drawing dimensions
            offscreen.width = width;
            offscreen.height = height;
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(resizeCanvas, 250));
    
    // Debounce function to limit resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Simplified ASCII rendering for better performance
    function renderAscii() {
        // Clear canvases
        offscreenCtx.clearRect(0, 0, offscreen.width, offscreen.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw video to offscreen canvas with proper aspect ratio
        const { width, height, offsetX, offsetY } = config.drawDimensions;
        offscreenCtx.drawImage(video, offsetX, offsetY, width, height);
        
        // Get image data
        const imageData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        
        // ASCII conversion
        const cellWidth = config.font;
        const cellHeight = config.font;
        const numCols = Math.floor(offscreen.width / cellWidth);
        const numRows = Math.floor(offscreen.height / cellHeight);
        
        ctx.font = `${config.font}px monospace`;
        
        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numCols; x++) {
                const posX = x * cellWidth;
                const posY = y * cellHeight;
                
                // Sample the center of each cell for better performance
                const centerX = posX + Math.floor(cellWidth / 2);
                const centerY = posY + Math.floor(cellHeight / 2);
                
                if (centerX < offscreen.width && centerY < offscreen.height) {
                    const offset = (centerY * offscreen.width + centerX) * 4;
                    const red = imageData.data[offset];
                    const green = imageData.data[offset + 1];
                    const blue = imageData.data[offset + 2];
                    const brightness = (red + green + blue) / 3;
                    
                    // Only render if brightness is above threshold
                    if (brightness > 30) {
                        const charIndex = Math.floor((brightness / 256) * config.ascii.length);
                        const char = config.ascii[charIndex] || ' ';
                        
                        // Get color from palette based on brightness
                        const color = getColor(brightness);
                        
                        // Apply opacity based on brightness
                        const opacity = Math.min(0.85, brightness / 255 + 0.3);
                        
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                        ctx.fillText(char, posX, posY + cellHeight);
                    }
                }
            }
        }
        
        // Request next frame
        requestAnimationFrame(renderAscii);
    }
    
    // Initialize
    function init() {
        resizeCanvas();
        
        // Start video playback
        video.play().then(() => {
            console.log('Video playback started');
            // Start rendering
            renderAscii();
        }).catch(error => {
            console.error('Error playing video:', error);
        });
    }
    
    // Start when video is ready
    video.addEventListener('loadeddata', () => {
        console.log('Video loaded');
        init();
    });
    
    // Fallback in case the video doesn't load
    setTimeout(() => {
        if (video.readyState === 0) {
            console.log('Video load timeout - trying to initialize anyway');
            init();
        }
    }, 3000);
}); 