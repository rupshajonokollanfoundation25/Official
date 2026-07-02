/* =========================================================
   effects.js — প্রিমিয়াম স্নো পার্টিকেল ব্যাকগ্রাউন্ড ইফেক্ট
   ========================================================= */
(function () {
    const canvas = document.getElementById('ultra-promax-snow');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const maxParticles = width < 768 ? 35 : 70;
    let particles = [];

    const mouse = { x: -1000, y: -1000, radius: 180 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let windTime = 0;

    class UltraPremiumSnow {
        constructor() { this.reset(true); }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? Math.random() * height : -20;
            this.baseRadius = Math.random() * 2.5 + 1;
            this.radius = this.baseRadius;
            this.speedY = (Math.random() * 1.5 + 0.5) * (this.baseRadius * 0.4);
            this.speedX = Math.random() * 1 - 0.5;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.baseOpacity = Math.random() * 0.5 + 0.4;
            this.opacity = this.baseOpacity;
        }

        update() {
            this.wobble += this.wobbleSpeed;
            const globalWind = Math.sin(windTime) * 0.5;

            this.y += this.speedY;
            this.x += this.speedX + Math.cos(this.wobble) * 0.5 + globalWind;

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x += (dx / distance) * force * 4;
                this.y += (dy / distance) * force * 4;
                this.opacity = Math.min(1, this.baseOpacity + force);
            } else {
                this.opacity = this.baseOpacity;
            }

            const distanceFromBottom = height - this.y;
            if (distanceFromBottom < 100) {
                this.opacity = this.baseOpacity * (distanceFromBottom / 100);
            }

            if (this.y > height || this.x < -50 || this.x > width + 50) {
                this.reset(false);
            }
        }

        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(0.4, `rgba(180, 225, 255, ${this.opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(180, 225, 255, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < maxParticles; i++) particles.push(new UltraPremiumSnow());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        windTime += 0.005;
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();
})();
