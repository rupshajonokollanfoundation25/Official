<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - RJ Foundation</title>

    <!-- Premium Font & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="icon" type="image/png" href="favicon.png">

    <style>
        :root {
            --primary: #00e5ff;
            --secondary: #1de9b6;
            --dark-bg: #0b132b;
            --card-bg: rgba(255, 255, 255, 0.05);
            --glass-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: radial-gradient(circle at top right, #1c2541, #0b132b);
            color: var(--text-main);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }

        /* Animated Background Orbs */
        body::before, body::after {
            content: '';
            position: fixed;
            border-radius: 50%;
            filter: blur(100px);
            z-index: -1;
            animation: floatOrb 10s infinite alternate ease-in-out;
        }
        body::before {
            width: 400px;
            height: 400px;
            background: rgba(0, 229, 255, 0.15);
            top: -100px;
            left: -100px;
        }
        body::after {
            width: 500px;
            height: 500px;
            background: rgba(29, 233, 182, 0.1);
            bottom: -150px;
            right: -100px;
            animation-delay: -5s;
        }

        @keyframes floatOrb {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }

        .container {
            max-width: 1100px;
            margin: 120px auto 60px; /* Space for fixed nav */
            padding: 0 20px;
        }

        /* ----------------------------------
           ULTRA NAVIGATION & SUBSCRIBE BTN
        ----------------------------------- */
        .ultra-nav {
            position: fixed;
            top: 20px;
            left: 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            pointer-events: none;
        }

        .smart-sub-btn {
            pointer-events: auto;
            position: relative;
            padding: 10px 28px;
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 50px;
            color: #fff;
            font-size: 15px;
            font-weight: 600;
            text-transform: uppercase;
            text-decoration: none;
            letter-spacing: 1.5px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .smart-sub-btn:hover {
            transform: translateY(-3px) scale(1.03);
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 15px 40px rgba(0, 229, 255, 0.3);
            border-color: rgba(0, 229, 255, 0.5);
        }

        .smart-sub-btn::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
            transition: all 0.4s ease;
            transform: translateX(-50%);
        }

        .smart-sub-btn:hover::after { width: 80%; }

        /* ----------------------------------
           PREMIUM CUSTOM AUDIO PLAYER
        ----------------------------------- */
        .audio-wrapper {
            display: flex;
            justify-content: center;
            margin-bottom: 50px;
            animation: slideUp 0.8s ease backwards;
        }

        .pro-audio-player {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 20px;
            padding: 20px 30px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            gap: 15px;
            position: relative;
            overflow: hidden;
        }

        .pro-audio-player::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }

        .audio-header {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-main);
            font-weight: 600;
            font-size: 16px;
        }

        .audio-header i { color: var(--primary); font-size: 20px; }

        .audio-controls-row {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .play-pause {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            color: #000;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, box-shadow 0.2s;
            flex-shrink: 0;
        }

        .play-pause:hover {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
        }

        .progress-wrapper { flex-grow: 1; }

        .progress-area {
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            cursor: pointer;
            position: relative;
            margin-bottom: 8px;
        }

        .progress-bar {
            height: 100%;
            width: 0%;
            background: var(--primary);
            border-radius: 10px;
            position: relative;
            box-shadow: 0 0 10px var(--primary);
        }

        .progress-bar::before {
            content: '';
            position: absolute;
            right: -5px;
            top: -4px;
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }

        .timers {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 500;
        }

        .volume-container {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-muted);
            font-size: 14px;
        }

        #volume-slider {
            width: 80px;
            accent-color: var(--secondary);
            cursor: pointer;
        }

        /* ----------------------------------
           ABOUT & VISION CARDS
        ----------------------------------- */
        .about-card {
            background: var(--card-bg);
            backdrop-filter: blur(15px);
            border-radius: 30px;
            padding: 50px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            margin-bottom: 60px;
            text-align: center;
            animation: slideUp 1s ease backwards;
            animation-delay: 0.2s;
        }

        .about-card h2 {
            font-size: 32px;
            margin-bottom: 25px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(90deg, #fff, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .about-card p {
            font-size: 18px;
            line-height: 1.8;
            color: var(--text-muted);
            font-weight: 400;
            max-width: 800px;
            margin: 0 auto;
        }

        .section-title {
            text-align: center;
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 40px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 2px;
            animation: slideUp 1s ease backwards;
            animation-delay: 0.3s;
        }

        .vision-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
        }

        .vision-item {
            background: var(--card-bg);
            backdrop-filter: blur(10px);
            padding: 40px 30px;
            border-radius: 24px;
            border: 1px solid var(--glass-border);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            animation: slideUp 1s ease backwards;
        }

        /* Staggered animations */
        .vision-item:nth-child(1) { animation-delay: 0.4s; }
        .vision-item:nth-child(2) { animation-delay: 0.5s; }
        .vision-item:nth-child(3) { animation-delay: 0.6s; }
        .vision-item:nth-child(4) { animation-delay: 0.7s; }
        .vision-item:nth-child(5) { animation-delay: 0.8s; }

        .vision-item:hover {
            transform: translateY(-15px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 229, 255, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(0, 229, 255, 0.05);
        }

        .icon-box {
            width: 80px;
            height: 80px;
            background: rgba(0, 229, 255, 0.1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 229, 255, 0.2);
            transition: all 0.3s ease;
        }

        .vision-item:hover .icon-box {
            background: var(--primary);
            box-shadow: 0 0 20px var(--primary);
            transform: scale(1.1) rotate(5deg);
        }

        .vision-item:hover .icon-box i { color: #000; }

        .icon-box i {
            font-size: 32px;
            color: var(--primary);
            transition: all 0.3s ease;
        }

        .vision-item h4 {
            margin-bottom: 15px;
            color: #fff;
            font-size: 22px;
            font-weight: 600;
        }

        .vision-item p {
            font-size: 15px;
            color: var(--text-muted);
            line-height: 1.7;
        }

        /* ----------------------------------
           SMART SCROLL TO TOP
        ----------------------------------- */
        #newScrollTop {
            position: fixed;
            right: 25px;
            bottom: 40px; /* Positioned at bottom instead of middle for better UX */
            background: rgba(0, 229, 255, 0.1);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            color: white;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 1px solid rgba(0, 229, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            opacity: 0;
            visibility: hidden;
            transform: translateY(50px);
        }

        #newScrollTop.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        #newScrollTop:hover {
            background: var(--primary);
            color: #000;
            box-shadow: 0 0 20px var(--primary);
            transform: translateY(-5px);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .about-card { padding: 30px 20px; }
            .about-card h2 { font-size: 24px; }
            .about-card p { font-size: 15px; }
            .section-title { font-size: 28px; }
            .pro-audio-player { max-width: 100%; }
        }
    </style>
</head>
<body>

    <!-- Ultra Navigation / Subscribe -->
    <nav class="ultra-nav">
        <a href="/subscribe/" class="smart-sub-btn">
            Subscribe Now
        </a>
    </nav>

    <div class="container">

        <!-- Premium Custom Audio Player -->
        <div class="audio-wrapper">
            <div class="pro-audio-player">
                <div class="audio-header">
                    <i class="fas fa-headphones-alt"></i>
                    <span>Listen to Our Story</span>
                </div>

                <div class="audio-controls-row">
                    <button class="play-pause" title="Play/Pause">
                        <i class="fas fa-play"></i>
                    </button>

                    <div class="progress-wrapper">
                        <div class="progress-area">
                            <div class="progress-bar"></div>
                        </div>
                        <div class="timers">
                            <span class="current">0:00</span>
                            <span class="duration">0:00</span>
                        </div>
                    </div>
                </div>

                <div class="volume-container">
                    <i class="fas fa-volume-up"></i>
                    <input type="range" id="volume-slider" min="0" max="100" value="100">
                </div>

                <!-- Hidden Native Audio Tag -->
                <audio id="main-audio" src="about.mp3"></audio>
            </div>
        </div>

        <!-- Foundation Overview Card -->
        <div class="about-card">
            <h2><i class="fas fa-shield-heart"></i> Foundation Overview</h2>
            <p><strong>RJ Foundation (Rupsha Janakalyan Foundation)</strong> is a humanitarian, non-political, and charitable organization. We are working relentlessly with dedication and passion to bring smiles to the faces of the underprivileged and marginalized people in our society.</p>
        </div>

        <h2 class="section-title">Our Vision & Mission</h2>

        <!-- Grid Items -->
        <div class="vision-grid">

            <div class="vision-item">
                <div class="icon-box"><i class="fas fa-handshake"></i></div>
                <h4>Non-Political</h4>
                <p>Our foundation is strictly non-political. We serve humanity by rising above all party lines and personal beliefs.</p>
            </div>

            <div class="vision-item">
                <div class="icon-box"><i class="fas fa-chart-line"></i></div>
                <h4>Improving Lives</h4>
                <p>Our primary goal is to uplift and improve the living standards of helpless and impoverished individuals.</p>
            </div>

            <div class="vision-item">
                <div class="icon-box"><i class="fas fa-bullhorn"></i></div>
                <h4>Raising Awareness</h4>
                <p>We are committed to increasing social awareness and ensuring all types of humanitarian aid reach those in need.</p>
            </div>

            <div class="vision-item">
                <div class="icon-box"><i class="fas fa-cloud-rain"></i></div>
                <h4>Disaster Relief</h4>
                <p>We stand firmly beside vulnerable families during natural disasters, striving to alleviate their suffering and losses.</p>
            </div>

            <div class="vision-item">
                <div class="icon-box"><i class="fas fa-medal"></i></div>
                <h4>Sports & Culture</h4>
                <p>We organize sports and cultural events to promote healthy recreation and foster unity among the youth.</p>
            </div>

        </div>
    </div>

    <!-- Smart Scroll to Top -->
    <div id="newScrollTop" title="Go to Top">
        <i class="fas fa-chevron-up" style="font-size: 20px;"></i>
    </div>

    <!-- Scripts -->
    <script>
        // ----------------------------------------------------
        // 1. SMART SCROLL TO TOP LOGIC
        // ----------------------------------------------------
        const scrollTopBtn = document.getElementById('newScrollTop');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // ----------------------------------------------------
        // 2. NAV BUTTON ANIMATION (Haptic & Scroll)
        // ----------------------------------------------------
        const subBtn = document.querySelector('.smart-sub-btn');

        subBtn.addEventListener('mouseenter', () => {
            if (window.navigator.vibrate) {
                window.navigator.vibrate(15);
            }
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                subBtn.style.transform = 'scale(0.9)';
                subBtn.style.opacity = '0.8';
            } else {
                subBtn.style.transform = 'scale(1)';
                subBtn.style.opacity = '1';
            }
        });

        // ----------------------------------------------------
        // 3. PREMIUM CUSTOM AUDIO PLAYER LOGIC
        // ----------------------------------------------------
        const mainAudio = document.querySelector("#main-audio");
        const playPauseBtn = document.querySelector(".play-pause");
        const playPauseIcon = playPauseBtn.querySelector("i");
        const progressBar = document.querySelector(".progress-bar");
        const progressArea = document.querySelector(".progress-area");
        const volumeSlider = document.querySelector("#volume-slider");
        const musicDuration = document.querySelector(".duration");
        const musicCurrentTime = document.querySelector(".current");

        // Format Time Function (e.g., 65 -> 1:05)
        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            let min = Math.floor(time / 60);
            let sec = Math.floor(time % 60);
            if (sec < 10) sec = `0${sec}`;
            return `${min}:${sec}`;
        };

        // Load Duration on Metadata Load
        mainAudio.addEventListener("loadedmetadata", () => {
            musicDuration.innerText = formatTime(mainAudio.duration);
        });

        // Play / Pause toggle
        playPauseBtn.addEventListener("click", () => {
            const isPlaying = playPauseBtn.classList.contains("playing");
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });

        function playMusic() {
            playPauseBtn.classList.add("playing");
            playPauseIcon.classList.replace("fa-play", "fa-pause");
            mainAudio.play();
            // Subtle pulse animation when playing
            playPauseBtn.style.animation = "pulse 2s infinite";
        }

        function pauseMusic() {
            playPauseBtn.classList.remove("playing");
            playPauseIcon.classList.replace("fa-pause", "fa-play");
            mainAudio.pause();
            playPauseBtn.style.animation = "none";
        }

        // Update Progress Bar & Time
        mainAudio.addEventListener("timeupdate", (e) => {
            const currentTime = e.target.currentTime;
            const duration = e.target.duration;
            if (duration > 0) {
                let progressWidth = (currentTime / duration) * 100;
                progressBar.style.width = `${progressWidth}%`;
                musicCurrentTime.innerText = formatTime(currentTime);
            }
        });

        // Reset icon when audio ends
        mainAudio.addEventListener("ended", () => {
            pauseMusic();
            progressBar.style.width = `0%`;
            musicCurrentTime.innerText = "0:00";
        });

        // Seek Audio on Progress Bar Click
        progressArea.addEventListener("click", (e) => {
            let progressWidthVal = progressArea.clientWidth;
            let clickedOffSetX = e.offsetX;
            let songDuration = mainAudio.duration;
            mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
            if (!playPauseBtn.classList.contains("playing")) {
                playMusic();
            }
        });

        // Volume Control
        volumeSlider.addEventListener("input", (e) => {
            let volumeVal = e.target.value / 100;
            mainAudio.volume = volumeVal;

            // Update Volume Icon based on level
            const volIcon = document.querySelector(".volume-container i");
            if (volumeVal === 0) {
                volIcon.className = "fas fa-volume-mute";
            } else if (volumeVal < 0.5) {
                volIcon.className = "fas fa-volume-down";
            } else {
                volIcon.className = "fas fa-volume-up";
            }
        });

    </script>
</body>
</html>