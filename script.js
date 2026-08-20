document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // DEFAULT DATA (used when nothing is saved)
    // ==========================================
    const DEFAULTS = {
        avatar: 'avatar.jpg',
        handle: 'xyz.taimo',
        tagline: 'TikTok Sound Promotions',
        stat1Num: '815K', stat1Label: 'Followers',
        stat2Num: '50.9M', stat2Label: 'Likes',
        socialTiktok: 'https://tiktok.com/@xyz.taimo',
        socialInstagram: '#',
        socialYoutube: '#',
        bgImage: '',
        musicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db807e4d88.mp3?filename=lofi-study-112191.mp3',
        formspree: 'https://formspree.io/f/your_formspree_id',
        formTitle: 'Business Inquiry',
        formDesc: 'Sound promotion & collaboration requests.',
        links: [
            { icon: 'fa-brands fa-tiktok', title: 'TikTok', sub: '@xyz.taimo', url: 'https://tiktok.com/@xyz.taimo' },
            { icon: 'fa-solid fa-chart-line', title: 'Latest Promotion', sub: 'Current campaign', url: '#' },
            { icon: 'fa-brands fa-spotify', title: 'Spotify', sub: 'Curated playlist', url: '#' },
            { icon: 'fa-solid fa-briefcase', title: 'Media Kit', sub: 'Rates & reach', url: '#' },
        ]
    };

    // ==========================================
    // LOAD DATA
    // ==========================================
    function loadData() {
        const saved = localStorage.getItem('linkpage_data');
        if (saved) {
            try { return { ...DEFAULTS, ...JSON.parse(saved) }; }
            catch(e) { return { ...DEFAULTS }; }
        }
        return { ...DEFAULTS };
    }

    function saveData(data) {
        localStorage.setItem('linkpage_data', JSON.stringify(data));
    }

    let currentData = loadData();

    // ==========================================
    // APPLY DATA TO PAGE
    // ==========================================
    function applyToPage(data) {
        // Avatar
        document.getElementById('page-avatar').src = data.avatar || 'avatar.jpg';
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
        // Background
        const bgLayer = document.getElementById('bg-layer');
        if (data.bgImage) {
            bgLayer.style.backgroundImage = `url('${data.bgImage}')`;
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
        // Links
        renderPageLinks(data.links);
    }

    function renderPageLinks(links) {
        const container = document.getElementById('page-links');
        container.innerHTML = '';
        links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url || '#';
            a.target = '_blank';
            a.className = 'link-card interactive-hover';
            a.innerHTML = `
                <div class="link-content">
                    <div class="icon-wrapper"><i class="${link.icon}"></i></div>
                    <div class="link-text">
                        <span class="link-title">${escapeHtml(link.title)}</span>
                        <span class="link-sub">${escapeHtml(link.sub)}</span>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right chevron"></i>
            `;
            container.appendChild(a);
        });
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
        document.getElementById('s-bg-image').value = data.bgImage || '';
        document.getElementById('s-music-url').value = data.musicUrl || '';
        document.getElementById('s-formspree').value = data.formspree || '';
        document.getElementById('s-form-title').value = data.formTitle || '';
        document.getElementById('s-form-desc').value = data.formDesc || '';
        renderLinkEditor(data.links);
    }

    // Link Editor
    function renderLinkEditor(links) {
        const container = document.getElementById('link-cards-editor');
        container.innerHTML = '';
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
            bgImage: document.getElementById('s-bg-image').value,
            musicUrl: document.getElementById('s-music-url').value,
            formspree: document.getElementById('s-formspree').value,
            formTitle: document.getElementById('s-form-title').value,
            formDesc: document.getElementById('s-form-desc').value,
            links: links,
        };

        saveData(currentData);
        applyToPage(currentData);
        closeSettings();
    });

    // Reset
    document.getElementById('settings-reset').addEventListener('click', () => {
        if (confirm('Reset all settings and password to default?')) {
            localStorage.removeItem('linkpage_data');
            localStorage.removeItem('admin_pw_hash');
            sessionStorage.removeItem('admin_auth');
            currentData = { ...DEFAULTS, links: [...DEFAULTS.links] };
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

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); playPauseIcon.className = 'fa-solid fa-pause'; }
        else { audio.pause(); playPauseIcon.className = 'fa-solid fa-play'; }
    });
    muteBtn.addEventListener('click', () => { audio.muted = !audio.muted; updateVolumeIcon(); });
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
                
                openSocialPreview(platform, url, iconClass);
            }
        });
    });

});
