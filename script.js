document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // STATE
    // ==========================================
    let DEFAULTS = {};
    let currentData = {};

    // ==========================================
    // LOAD DATA
    // ==========================================
    async function loadData() {
        try {
            const response = await fetch('data.json');
            if (response.ok) {
                DEFAULTS = await response.json();
            }
        } catch (e) {
            console.error("Failed to load data.json", e);
        }
        currentData = structuredClone(DEFAULTS);
        applyToPage(currentData);
    }

    loadData();

    function downloadDataJson(data) {
        const str = JSON.stringify(data, null, 2);
        const blob = new Blob([str], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('data.json has been downloaded! Please commit and push it to your GitHub repository to apply changes globally.');
    }

    // ==========================================
    // APPLY DATA TO PAGE
    // ==========================================
    function applyToPage(data) {
        // Avatar
        document.getElementById('page-avatar').src = data.avatar || 'avatar.webp';
        // Profile text
        document.getElementById('page-handle').textContent = data.handle;
        document.getElementById('page-tagline').textContent = data.tagline;
        // Stats
        document.getElementById('page-stat1-num').textContent = data.stat1Num;
        document.getElementById('page-stat1-label').textContent = data.stat1Label;
        document.getElementById('page-stat2-num').textContent = data.stat2Num;
        document.getElementById('page-stat2-label').textContent = data.stat2Label;
        // Social
        document.getElementById('social-tiktok').href = data.socialTiktok || '#';
        document.getElementById('social-instagram').href = data.socialInstagram || '#';
        document.getElementById('social-youtube').href = data.socialYoutube || '#';
        document.getElementById('social-facebook').href = data.socialFacebook || '#';
        // Background
        const bgLayer = document.getElementById('bg-layer');
        if (data.bgImage) {
            bgLayer.style.backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('${data.bgImage}')`;
            bgLayer.style.backgroundSize = 'cover';
            bgLayer.style.backgroundPosition = 'center';
        } else {
            bgLayer.style.backgroundImage = 'none';
        }
        // Music
        const audio = document.getElementById('bg-music');
        const currentSrc = audio.querySelector('source')?.src || '';
        if (data.musicUrl && data.musicUrl !== currentSrc) {
            audio.querySelector('source').src = data.musicUrl;
            audio.load();
        }
        // Form
        document.getElementById('page-form-title').textContent = data.formTitle;
        document.getElementById('page-form-desc').textContent = data.formDesc;
        document.getElementById('promo-form').action = data.formspree;
        
        // Intro Videos
        if (document.getElementById('intro-video-1')) {
            const v1 = document.getElementById('intro-video-1');
            const v2 = document.getElementById('intro-video-2');
            const v3 = document.getElementById('intro-video-3');
            
            if (v1.src !== (data.introVid1 || '')) { v1.src = data.introVid1 || ''; v1.load(); }
            document.getElementById('intro-vid1-title').innerText = data.introVid1Title || 'Sound Promo';
            document.getElementById('intro-vid1-views').innerText = data.introVid1Views || '';
            document.getElementById('intro-card-1').href = data.introVid1Link || '#';

            if (v2.src !== (data.introVid2 || '')) { v2.src = data.introVid2 || ''; v2.load(); }
            document.getElementById('intro-vid2-title').innerText = data.introVid2Title || 'Sound Promo';
            document.getElementById('intro-vid2-views').innerText = data.introVid2Views || '';
            document.getElementById('intro-card-2').href = data.introVid2Link || '#';

            if (v3.src !== (data.introVid3 || '')) { v3.src = data.introVid3 || ''; v3.load(); }
            document.getElementById('intro-vid3-title').innerText = data.introVid3Title || 'Sound Promo';
            document.getElementById('intro-vid3-views').innerText = data.introVid3Views || '';
            document.getElementById('intro-card-3').href = data.introVid3Link || '#';
        }
        
        // Links
        renderPageLinks(data.links);
        
        // Track Title
        if (document.getElementById('track-title')) {
            document.getElementById('track-title').innerText = data.musicTitle || 'Background Music';
        }
    }

    function renderPageLinks(links) {
        if (!links) links = [];
        const container = document.getElementById('page-links');
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url || '#';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'link-card interactive-hover';
            a.innerHTML = `
                <div class="link-content">
                    <div class="icon-wrapper"><i class="${escapeAttr(link.icon)}"></i></div>
                    <div class="link-text">
                        <span class="link-title">${escapeHtml(link.title)}</span>
                        <span class="link-sub">${escapeHtml(link.sub)}</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right chevron"></i>
            `;
            frag.appendChild(a);
        });
        container.appendChild(frag);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Apply on load
    applyToPage(currentData);

    // ==========================================
    // PASSWORD AUTH (SHA-256 Hashed)
    // ==========================================
    // Default password: "admin" — Change it via the settings panel after first login!
    // SHA-256 hash of "admin":
    const DEFAULT_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
    
    function getPasswordHash() {
        return localStorage.getItem('admin_pw_hash') || DEFAULT_HASH;
    }

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function isAuthenticated() {
        return sessionStorage.getItem('admin_auth') === 'true';
    }

    const loginModal = document.getElementById('login-modal');
    const loginPassword = document.getElementById('login-password');
    const loginSubmit = document.getElementById('login-submit');
    const loginError = document.getElementById('login-error');

    function showLoginModal() {
        loginPassword.value = '';
        loginError.textContent = '';
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => loginPassword.focus(), 300);
    }

    function hideLoginModal() {
        loginModal.classList.remove('active');
        if (!settingsPanel.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    }

    loginSubmit.addEventListener('click', async () => {
        const pw = loginPassword.value;
        if (!pw) { loginError.textContent = 'Please enter a password.'; return; }
        
        const hash = await hashPassword(pw);
        if (hash === getPasswordHash()) {
            sessionStorage.setItem('admin_auth', 'true');
            hideLoginModal();
            openSettings();
        } else {
            loginError.textContent = 'Wrong password.';
            loginPassword.value = '';
            const card = loginModal.querySelector('.login-card');
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
        }
    });

    loginPassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') loginSubmit.click();
    });

    // Close login modal on overlay click
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) hideLoginModal();
    });

    // ==========================================
    // SETTINGS PANEL
    // ==========================================
    const settingsPanel = document.getElementById('settings-panel');
    const settingsOverlay = document.getElementById('settings-overlay');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsClose = document.getElementById('settings-close');

    function openSettings() {
        populateSettingsForm(currentData);
        settingsPanel.classList.add('active');
        settingsOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSettings() {
        settingsPanel.classList.remove('active');
        settingsOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Secret access: Triple-click on footer to open settings
    let clickCount = 0;
    let clickTimer = null;
    const footer = document.querySelector('.footer');

    function triggerSettingsAccess() {
        if (isAuthenticated()) { openSettings(); }
        else { showLoginModal(); }
    }

    footer.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 1) {
            clickTimer = setTimeout(() => { clickCount = 0; }, 600);
        }
        if (clickCount >= 3) {
            clearTimeout(clickTimer);
            clickCount = 0;
            triggerSettingsAccess();
        }
    });
    settingsClose.addEventListener('click', closeSettings);
    settingsOverlay.addEventListener('click', closeSettings);

    // Populate form with current data
    function populateSettingsForm(data) {
        document.getElementById('s-avatar').value = data.avatar || '';
        document.getElementById('s-handle').value = data.handle || '';
        document.getElementById('s-tagline').value = data.tagline || '';
        document.getElementById('s-stat1-num').value = data.stat1Num || '';
        document.getElementById('s-stat1-label').value = data.stat1Label || '';
        document.getElementById('s-stat2-num').value = data.stat2Num || '';
        document.getElementById('s-stat2-label').value = data.stat2Label || '';
        document.getElementById('s-social-tiktok').value = data.socialTiktok || '';
        document.getElementById('s-social-instagram').value = data.socialInstagram || '';
        document.getElementById('s-social-youtube').value = data.socialYoutube || '';
        document.getElementById('s-social-facebook').value = data.socialFacebook || '';
        document.getElementById('s-bg-image').value = data.bgImage || '';
        document.getElementById('s-music-url').value = data.musicUrl || '';
        document.getElementById('s-music-title').value = data.musicTitle || '';
        document.getElementById('s-formspree').value = data.formspree || '';
        document.getElementById('s-form-title').value = data.formTitle || '';
        document.getElementById('s-form-desc').value = data.formDesc || '';
        document.getElementById('s-intro-vid1').value = data.introVid1 || '';
        document.getElementById('s-intro-vid1-title').value = data.introVid1Title || '';
        document.getElementById('s-intro-vid1-views').value = data.introVid1Views || '';
        document.getElementById('s-intro-vid1-link').value = data.introVid1Link || '';
        document.getElementById('s-intro-vid2').value = data.introVid2 || '';
        document.getElementById('s-intro-vid2-title').value = data.introVid2Title || '';
        document.getElementById('s-intro-vid2-views').value = data.introVid2Views || '';
        document.getElementById('s-intro-vid2-link').value = data.introVid2Link || '';
        document.getElementById('s-intro-vid3').value = data.introVid3 || '';
        document.getElementById('s-intro-vid3-title').value = data.introVid3Title || '';
        document.getElementById('s-intro-vid3-views').value = data.introVid3Views || '';
        document.getElementById('s-intro-vid3-link').value = data.introVid3Link || '';
        
        renderLinkEditor(data.links);
    }

    // Link Editor
    function renderLinkEditor(links) {
        const container = document.getElementById('link-cards-editor');
        container.innerHTML = '';
        const frag = document.createDocumentFragment();
        links.forEach((link, index) => {
            const card = document.createElement('div');
            card.className = 'link-editor-card';
            card.innerHTML = `
                <div class="link-editor-header">
                    <span>Link ${index + 1}</span>
                    <button class="link-delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
                <div class="setting-item">
                    <label>Title</label>
                    <input type="text" class="le-title" value="${escapeAttr(link.title)}" placeholder="Link Title">
                </div>
                <div class="setting-item">
                    <label>Subtitle</label>
                    <input type="text" class="le-sub" value="${escapeAttr(link.sub)}" placeholder="Short description">
                </div>
                <div class="setting-item">
                    <label>URL</label>
                    <input type="text" class="le-url" value="${escapeAttr(link.url)}" placeholder="https://...">
                </div>
                <div class="setting-item">
                    <label>Icon Class <span class="setting-hint">(FontAwesome, e.g. fa-brands fa-tiktok)</span></label>
                    <input type="text" class="le-icon" value="${escapeAttr(link.icon)}" placeholder="fa-solid fa-link">
                </div>
            `;
            container.appendChild(card);

            card.querySelector('.link-delete-btn').addEventListener('click', () => {
                card.remove();
            });
        });
        container.appendChild(frag);
    }

    function escapeAttr(str) { return (str || '').replace(/"/g, '&quot;'); }

    // Add Link
    document.getElementById('add-link-btn').addEventListener('click', () => {
        const container = document.getElementById('link-cards-editor');
        const count = container.children.length;
        const card = document.createElement('div');
        card.className = 'link-editor-card';
        card.innerHTML = `
            <div class="link-editor-header">
                <span>Link ${count + 1}</span>
                <button class="link-delete-btn"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            <div class="setting-item">
                <label>Title</label>
                <input type="text" class="le-title" value="" placeholder="Link Title">
            </div>
            <div class="setting-item">
                <label>Subtitle</label>
                <input type="text" class="le-sub" value="" placeholder="Short description">
            </div>
            <div class="setting-item">
                <label>URL</label>
                <input type="text" class="le-url" value="" placeholder="https://...">
            </div>
            <div class="setting-item">
                <label>Icon Class <span class="setting-hint">(FontAwesome, e.g. fa-brands fa-tiktok)</span></label>
                <input type="text" class="le-icon" value="fa-solid fa-link" placeholder="fa-solid fa-link">
            </div>
        `;
        container.appendChild(card);
        card.querySelector('.link-delete-btn').addEventListener('click', () => card.remove());
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Save
    document.getElementById('settings-save').addEventListener('click', async () => {
        // Handle password change first
        const newPw = document.getElementById('s-new-password').value;
        const confirmPw = document.getElementById('s-confirm-password').value;
        const pwStatus = document.getElementById('pw-change-status');
        
        if (newPw) {
            if (newPw !== confirmPw) {
                pwStatus.style.color = '#FF3B30';
                pwStatus.textContent = 'Passwords do not match.';
                return; // Don't save anything
            }
            if (newPw.length < 4) {
                pwStatus.style.color = '#FF3B30';
                pwStatus.textContent = 'Password must be at least 4 characters.';
                return;
            }
            const newHash = await hashPassword(newPw);
            localStorage.setItem('admin_pw_hash', newHash);
            pwStatus.style.color = '#34C759';
            pwStatus.textContent = 'Password updated!';
        }

        // Clear password fields
        document.getElementById('s-new-password').value = '';
        document.getElementById('s-confirm-password').value = '';

        // Collect links from editor
        const linkCards = document.querySelectorAll('.link-editor-card');
        const links = [];
        linkCards.forEach(card => {
            links.push({
                title: card.querySelector('.le-title').value,
                sub: card.querySelector('.le-sub').value,
                url: card.querySelector('.le-url').value,
                icon: card.querySelector('.le-icon').value || 'fa-solid fa-link',
            });
        });

        currentData = {
            avatar: document.getElementById('s-avatar').value,
            handle: document.getElementById('s-handle').value,
            tagline: document.getElementById('s-tagline').value,
            stat1Num: document.getElementById('s-stat1-num').value,
            stat1Label: document.getElementById('s-stat1-label').value,
            stat2Num: document.getElementById('s-stat2-num').value,
            stat2Label: document.getElementById('s-stat2-label').value,
            socialTiktok: document.getElementById('s-social-tiktok').value,
            socialInstagram: document.getElementById('s-social-instagram').value,
            socialYoutube: document.getElementById('s-social-youtube').value,
            socialFacebook: document.getElementById('s-social-facebook').value,
            bgImage: document.getElementById('s-bg-image').value,
            musicUrl: document.getElementById('s-music-url').value,
            musicTitle: document.getElementById('s-music-title').value,
            formspree: document.getElementById('s-formspree').value,
            formTitle: document.getElementById('s-form-title').value,
            formDesc: document.getElementById('s-form-desc').value,
            introVid1: document.getElementById('s-intro-vid1').value,
            introVid1Title: document.getElementById('s-intro-vid1-title').value,
            introVid1Views: document.getElementById('s-intro-vid1-views').value,
            introVid1Link: document.getElementById('s-intro-vid1-link').value,
            introVid2: document.getElementById('s-intro-vid2').value,
            introVid2Title: document.getElementById('s-intro-vid2-title').value,
            introVid2Views: document.getElementById('s-intro-vid2-views').value,
            introVid2Link: document.getElementById('s-intro-vid2-link').value,
            introVid3: document.getElementById('s-intro-vid3').value,
            introVid3Title: document.getElementById('s-intro-vid3-title').value,
            introVid3Views: document.getElementById('s-intro-vid3-views').value,
            introVid3Link: document.getElementById('s-intro-vid3-link').value,
            links: links,
        };
        
        localStorage.setItem('linkpage_data', JSON.stringify(currentData));
        downloadDataJson(currentData);

        applyToPage(currentData);
        closeSettings();
    });

    // Test Intro
    document.getElementById('settings-test-intro').addEventListener('click', () => {
        sessionStorage.removeItem('intro_played');
        location.reload();
    });

    // Reset
    document.getElementById('settings-reset').addEventListener('click', () => {
        if (confirm('Reset to currently published global settings?')) {
            localStorage.removeItem('linkpage_data');
            currentData = structuredClone(DEFAULTS);
            applyToPage(currentData);
            closeSettings();
        }
    });

    // ==========================================
    // THEME SWITCHER
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) { htmlEl.setAttribute('data-theme', 'light'); updateThemeIcon('light'); }
    }

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }

    // ==========================================
    // AUDIO PLAYER
    // ==========================================
    const audio = document.getElementById('bg-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playPauseIcon = playPauseBtn.querySelector('i');
    const muteBtn = document.getElementById('mute-btn');
    const muteIcon = muteBtn.querySelector('i');
    const volumeSlider = document.getElementById('volume-slider');

    audio.volume = volumeSlider.value;

    function updatePlayIcon() {
        playPauseIcon.className = audio.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    }

    // Try to autoplay on load (might be blocked by browser)
    // We defer actual audio start to the Intro button if it's playing!
    function handleAudioStartup() {
        audio.play().then(() => updatePlayIcon()).catch(() => {
            const startAudio = () => {
                audio.play();
                updatePlayIcon();
                document.removeEventListener('click', startAudio);
            };
            document.addEventListener('click', startAudio);
        });
    }

    // ==========================================
    // INTRO SEQUENCE LOGIC
    // ==========================================
    const introOverlay = document.getElementById('intro-overlay');
    const introEnterBtn = document.getElementById('intro-enter-btn');

    if (!sessionStorage.getItem('intro_played')) {
        // Show intro
        introOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Start animation after a short delay so videos can load
        setTimeout(() => {
            introOverlay.classList.add('playing');
            document.querySelectorAll('.intro-vid-card video').forEach(v => {
                v.play().catch(e => console.log('Autoplay prevented', e));
            });
        }, 100);

        introEnterBtn.addEventListener('click', () => {
            introOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            sessionStorage.setItem('intro_played', 'true');
            
            document.querySelectorAll('.intro-vid-card video').forEach(v => {
                v.pause();
                v.removeAttribute('src'); // Free memory
                v.load();
            });

            // Starting audio from this button click will bypass autoplay blocks!
            audio.play().then(() => updatePlayIcon()).catch(e => console.log(e));
        });
    } else {
        // Intro already played this session
        introOverlay.classList.add('hidden');
        handleAudioStartup();
    }

    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from firing
        if (audio.paused) { audio.play(); updatePlayIcon(); }
        else { audio.pause(); updatePlayIcon(); }
    });
    muteBtn.addEventListener('click', (e) => { 
        e.stopPropagation();
        audio.muted = !audio.muted; 
        updateVolumeIcon(); 
    });
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
        if (audio.volume > 0) audio.muted = false;
        updateVolumeIcon();
    });
    function updateVolumeIcon() {
        if (audio.muted || audio.volume == 0) muteIcon.className = 'fa-solid fa-volume-xmark';
        else if (audio.volume < 0.5) muteIcon.className = 'fa-solid fa-volume-low';
        else muteIcon.className = 'fa-solid fa-volume-high';
    }

    const trackCurrent = document.getElementById('track-current');
    const trackTotal = document.getElementById('track-total');
    const trackProgressFill = document.getElementById('track-progress-fill');
    
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const currentMins = Math.floor(audio.currentTime / 60);
        const currentSecs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
        const totalMins = Math.floor(audio.duration / 60);
        const totalSecs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
        
        trackCurrent.innerText = `${currentMins}:${currentSecs}`;
        trackTotal.innerText = `${totalMins}:${totalSecs}`;
        
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        trackProgressFill.style.width = `${progressPercent}%`;
    });

    // ==========================================
    // FORM HANDLER
    // ==========================================
    const form = document.getElementById('promo-form');
    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = btnText.innerText;
        btnText.innerText = 'Sending...';
        submitBtn.style.opacity = '0.6';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const formspreeUrl = currentData.formspree || 'https://formspree.io/f/your_formspree_id';
            
            // If they haven't set up a Formspree ID, just show demo message
            if (formspreeUrl.includes('your_formspree_id') || formspreeUrl.trim() === '') {
                setTimeout(() => {
                    statusDiv.innerText = "Please set a valid Formspree URL in settings.";
                    statusDiv.className = 'form-status error';
                    btnText.innerText = originalText;
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                    setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
                }, 1000);
                return;
            }

            const response = await fetch(formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusDiv.innerText = "Request sent successfully!";
                statusDiv.className = 'form-status success';
                form.reset();
                const selectEvent = new Event('change');
                document.getElementById('budget').dispatchEvent(selectEvent);
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, 'errors')) {
                    statusDiv.innerText = data.errors.map(err => err.message).join(", ");
                } else {
                    statusDiv.innerText = "Oops! There was a problem submitting your form";
                }
                statusDiv.className = 'form-status error';
            }
        } catch (error) {
            statusDiv.innerText = "Oops! There was a network problem.";
            statusDiv.className = 'form-status error';
        }

        btnText.innerText = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
    });

    const selectEl = document.getElementById('budget');
    selectEl.addEventListener('change', function() {
        if (this.value !== "") this.classList.add('has-value');
        else this.classList.remove('has-value');
    });

    // ==========================================
    // SOCIAL PREVIEW MODAL
    // ==========================================
    const socialPreviewModal = document.getElementById('social-preview-modal');
    const previewClose = document.getElementById('preview-close');
    const previewPlatformIcon = document.getElementById('preview-platform-icon');
    const previewAvatarImg = document.getElementById('preview-avatar-img');
    const previewHandle = document.getElementById('preview-handle');
    const previewTagline = document.getElementById('preview-tagline');
    const previewStat1Num = document.getElementById('preview-stat1-num');
    const previewStat1Label = document.getElementById('preview-stat1-label');
    const previewStat2Num = document.getElementById('preview-stat2-num');
    const previewStat2Label = document.getElementById('preview-stat2-label');
    const previewLinkBtn = document.getElementById('preview-link-btn');

    function openSocialPreview(platform, url, iconClass) {
        if (!url || url === '#' || url === '') return; // Don't open if no URL

        // Populate modal
        previewPlatformIcon.innerHTML = `<i class="${iconClass}"></i>`;
        previewAvatarImg.src = currentData.avatar;
        previewHandle.textContent = currentData.handle;
        
        if (platform === 'tiktok') previewTagline.textContent = "Check out my latest sound promos!";
        else if (platform === 'instagram') previewTagline.textContent = "Follow me for behind the scenes!";
        else if (platform === 'youtube') previewTagline.textContent = "Subscribe for full videos & mixes!";
        else if (platform === 'facebook') previewTagline.textContent = "Connect with me on Facebook!";
        else previewTagline.textContent = currentData.tagline;

        previewStat1Num.textContent = currentData.stat1Num;
        previewStat1Label.textContent = currentData.stat1Label;
        previewStat2Num.textContent = currentData.stat2Num;
        previewStat2Label.textContent = currentData.stat2Label;
        
        previewLinkBtn.href = url;

        // Show modal
        socialPreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSocialPreview() {
        socialPreviewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    previewClose.addEventListener('click', closeSocialPreview);
    socialPreviewModal.addEventListener('click', (e) => {
        if (e.target === socialPreviewModal) closeSocialPreview();
    });

    // Intercept clicks on social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const url = icon.getAttribute('href');
            if (url && url !== '#') {
                e.preventDefault();
                let platform = '';
                let iconClass = '';
                if (icon.classList.contains('tiktok')) { platform = 'tiktok'; iconClass = 'fa-brands fa-tiktok'; }
                else if (icon.classList.contains('instagram')) { platform = 'instagram'; iconClass = 'fa-brands fa-instagram'; }
                else if (icon.classList.contains('youtube')) { platform = 'youtube'; iconClass = 'fa-brands fa-youtube'; }
                else if (icon.classList.contains('facebook')) { platform = 'facebook'; iconClass = 'fa-brands fa-facebook-f'; }
                
                openSocialPreview(platform, url, iconClass);
            }
        });
    });

});


    // Mobile Swipe Logic for Intro
    let touchStartY = 0;
    let touchEndY = 0;
    let currentMobileCardIndex = 0;
    const introCards = document.querySelectorAll('.intro-vid-card');

    if (introOverlay) {
        introOverlay.addEventListener('touchstart', e => {
            if (window.innerWidth > 768) return;
            touchStartY = e.changedTouches[0].screenY;
        }, {passive: true});

        introOverlay.addEventListener('touchend', e => {
            if (window.innerWidth > 768) return;
            touchEndY = e.changedTouches[0].screenY;
            const deltaY = touchEndY - touchStartY;
            
            // Swipe UP (next card)
            if (deltaY < -40) {
                if (currentMobileCardIndex < introCards.length) {
                    introCards[currentMobileCardIndex].classList.add('swiped-up');
                    currentMobileCardIndex++;
                    if (currentMobileCardIndex >= introCards.length) {
                        setTimeout(() => {
                            if (introEnterBtn) introEnterBtn.click();
                        }, 400);
                    }
                }
            }
            // Swipe DOWN (dismiss entire intro)
            else if (deltaY > 40) {
                if (introEnterBtn) introEnterBtn.click();
            }
        }, {passive: true});
        
        introCards.forEach(card => {
            card.addEventListener('click', e => {
                if (window.innerWidth <= 768 && Math.abs(touchEndY - touchStartY) > 20) {
                    e.preventDefault();
                }
            });
        });
    }
