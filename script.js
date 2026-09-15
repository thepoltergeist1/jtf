
const canvas = document.getElementById("fun-canvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    const palettes = [
        ["#e8b54d", "#e85c4a", "#f2ece4"],
        ["#7fd8be", "#e8b54d", "#f2ece4"],
        ["#c792ea", "#7fd8be", "#f2ece4"],
        ["#f28fad", "#e8b54d", "#7fd8be"],
    ];
    let paletteIndex = 0;

    let width, height;
    let dots = [];
    const DOT_COUNT = 70;
    const mouse = { x: null, y: null, radius: 140 };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function makeDots() {
        dots = [];
        for (let i = 0; i < DOT_COUNT; i++) {
            dots.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: 1.5 + Math.random() * 2.5,
                color: palettes[paletteIndex][i % palettes[paletteIndex].length],
            });
        }
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        for (const d of dots) {

            d.x += d.vx;
            d.y += d.vy;

            if (d.x < -10) d.x = width + 10;
            if (d.x > width + 10) d.x = -10;
            if (d.y < -10) d.y = height + 10;
            if (d.y > height + 10) d.y = -10;


            if (mouse.x !== null) {
                const dx = d.x - mouse.x;
                const dy = d.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    d.x += (dx / (dist || 1)) * force * 2.2;
                    d.y += (dy / (dist || 1)) * force * 2.2;
                }
            }

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.color;
            ctx.globalAlpha = 0.85;
            ctx.fill();
        }


        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = "#f2ece4";
        ctx.lineWidth = 1;
        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < 90) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        requestAnimationFrame(step);
    }

    window.addEventListener("resize", () => {
        resize();
    });

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    const shuffleBtn = document.getElementById("shuffle-btn");
    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            paletteIndex = (paletteIndex + 1) % palettes.length;
            dots.forEach((d, i) => {
                d.color = palettes[paletteIndex][i % palettes[paletteIndex].length];
            });
            document.documentElement.style.setProperty("--accent", palettes[paletteIndex][0]);
        });
    }

    resize();
    makeDots();
    step();
}

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
}


const lightbox = document.getElementById("lightbox");
if (lightbox) {
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");

    document.querySelectorAll(".memory-photo").forEach((btn) => {
        btn.addEventListener("click", () => {
            const img = btn.querySelector("img");
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = btn.dataset.caption || img.alt;
            lightbox.classList.add("is-open");
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("is-open");
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}