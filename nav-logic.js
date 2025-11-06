  function initNavLogic() {

        
  
            
            // --- Global Data (Countries & Languages) ---
            const countries = [
                { name: "Global", sub: "🌎", isGlobal: true, slug: 'global', langCode: 'en' },
                { name: "Argentina", sub: "", slug: 'ar', langCode: 'es' },
                { name: "Australia & New Zealand", sub: "", slug: 'au', langCode: 'en' },
                { name: "Belgium", sub: "", slug: 'be', langCode: 'fr' },
                { name: "Brazil", sub: "Brasil", slug: 'br', langCode: 'pt' },
                { name: "Canada", sub: "(English)", slug: 'ca', langCode: 'en' },
                { name: "Canada", sub: "Le Canada (Français)", slug: 'qc', langCode: 'fr' },
                { name: "Central America & Caribbean", sub: "América Central y el Caribe", slug: 'cb', langCode: 'es' },
                { name: "Chile", sub: "", slug: 'cl', langCode: 'es' },
                { name: "China", sub: "中国", slug: 'cn', langCode: 'zh-CN' },
                { name: "Colombia", sub: "", slug: 'co', langCode: 'es' },
                { name: "Croatia", sub: "", slug: 'hr', langCode: 'hr' },
                { name: "Czech Republic", sub: "", slug: 'cz', langCode: 'cs' },
                { name: "Ecuador", sub: "", slug: 'ec', langCode: 'es' },
                { name: "Finland", sub: "", slug: 'fi', langCode: 'fi' },
                { name: "France", sub: "", slug: 'fr', langCode: 'fr' },
                { name: "Germany, Austria, Switzerland", sub: "Deutschland, Österreich, Schweiz", slug: 'de', langCode: 'de' },
                { name: "Greece", sub: "", slug: 'gr', langCode: 'el' },
                { name: "Hungary", sub: "", slug: 'hu', langCode: 'hu' },
                { name: "India", sub: "", slug: 'in', langCode: 'en' }, 
                { name: "Indonesia", sub: "", slug: 'id', langCode: 'id' },
                { name: "Ireland", sub: "", slug: 'ie', langCode: 'en' },
                { name: "Italy", sub: "Italia", slug: 'it', langCode: 'it' },
                { name: "Japan", sub: "日本", slug: 'jp', langCode: 'ja' },
                { name: "Latvia", sub: "", slug: 'lv', langCode: 'lv' },
                { name: "Maghreb", sub: "Le Maghreb", slug: 'ma', langCode: 'fr' },
                { name: "Malaysia", sub: "", slug: 'my', langCode: 'ms' },
                { name: "Mexico", sub: "México", slug: 'mx', langCode: 'es' },
                { name: "Netherlands", sub: "", slug: 'nl', langCode: 'nl' },
                { name: "Norway", sub: "", slug: 'no', langCode: 'no' },
                { name: "Pakistan", sub: "", slug: 'pk', langCode: 'ur' },
                { name: "Paraguay", sub: "", slug: 'py', langCode: 'es' },
                { name: "Peru", sub: "Perú", slug: 'pe', langCode: 'es' },
                { name: "Philippines", sub: "", slug: 'ph', langCode: 'en' },
                { name: "Poland", sub: "", slug: 'pl', langCode: 'pl' },
                { name: "Portugal", sub: "", slug: 'pt', langCode: 'pt' },
                { name: "Romania", sub: "", slug: 'ro', langCode: 'ro' },
                { name: "Saudi Arabia", sub: "", slug: 'sa', langCode: 'ar' },
                { name: "Serbia", sub: "", slug: 'rs', langCode: 'sr' },
                { name: "Singapore", sub: "", slug: 'sg', langCode: 'en' },
                { name: "Slovakia", sub: "", slug: 'sk', langCode: 'sk' },
                { name: "South Africa", sub: "", slug: 'za', langCode: 'en' },
                { name: "South Korea", sub: "", slug: 'kr', langCode: 'ko' },
                { name: "Spain", sub: "España", slug: 'es', langCode: 'es' },
                { name: "Sweden", sub: "Sverige", slug: 'sv', langCode: 'sv' },
                { name: "Switzerland", sub: "Suisse (Français)", slug: 'ch', langCode: 'fr' }, 
                { name: "Taiwan", sub: "", slug: 'tw', langCode: 'zh-TW' }, 
                { name: "Thailand", sub: "", slug: 'th', langCode: 'th' },
                { name: "Turkey", sub: "Türkiye", slug: 'tr', langCode: 'tr' },
                { name: "Ukraine", sub: "", slug: 'ua', langCode: 'uk' },
                { name: "United Kingdom", sub: "", slug: 'uk', langCode: 'en' },
                { name: "United States of America", sub: "", slug: 'us', langCode: 'en' },
                { name: "Venezuela", sub: "", slug: 've', langCode: 'es' },
                { name: "Vietnam", sub: "", slug: 'vn', langCode: 'vi' },
            ];
            
            // Generate a list of all valid slugs for path checking
            const VALID_SLUGS = countries.map(c => c.slug).filter(s => s !== 'global');
            
            // --- Global Constants and Selectors ---
            const LOGO_TEXT = 'ALETHRA™';
            const NAV_LOGO_URL = 'https://plusbrand.com/wp-content/uploads/2025/10/Copia-de-ALETHRA_Logo-scaled.png'; 
            const CONTENT_IMG_URL = 'https://plusbrand.com/wp-content/uploads/2025/11/Aletha-1.webp'; 
            const CONTENT_BOX_CLASSES = 'content-box-border-style rounded-lg flex h-full overflow-hidden'; 

            const navLogoImg = document.getElementById('nav-logo-img');
            const contentLogoImg = document.getElementById('content-logo-img');
            const contentBox = document.getElementById('content-box');
            
            // Message box elements
            const messageBoxContent = document.getElementById('message-box-content');

            // --- Modal Elements ---
            const countryModal = document.getElementById('country-modal');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const countryListContainer = document.getElementById('country-list-container');
            const modalContent = document.getElementById('modal-content');
            const globalIconDesktop = document.getElementById('global-icon-desktop');
            const globalLinkMobile = document.getElementById('global-link-mobile');

            // --- Mobile Menu Elements ---
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileCloseBtn = document.getElementById('mobile-close-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileDropdownTriggers = document.querySelectorAll('button[data-dropdown-id]');
            
            // --- Navigation Elements for Scroll to Top ---
            const navLogoLink = document.getElementById('nav-logo-link');

            // --- Helper Functions ---

            // Custom alert message function (now uses the newly added message box)
            function alertMessage(message, isError = false) {
                if (messageBoxContent) {
                    messageBoxContent.textContent = message;
                    
                    // Clear previous classes
                    messageBoxContent.classList.remove('hidden', 'bg-red-100', 'border-red-400', 'bg-gray-100', 'border-gray-300', 'text-red-800', 'text-gray-700');
                    
                    if (isError) {
                         messageBoxContent.classList.add('bg-red-100', 'border-red-400', 'text-red-800');
                    } else {
                         messageBoxContent.classList.add('bg-gray-100', 'border-gray-300', 'text-gray-700');
                    }
                    
                    // Show message box
                    messageBoxContent.classList.remove('hidden');
                    
                    // Hide after delay
                    setTimeout(() => {
                        messageBoxContent.classList.add('hidden');
                    }, 3000);
                }
            }
            
            // --- Google Translate Functionality ---
            function translatePage(langCode) {
                const translateSelect = document.querySelector('#google_translate_element select');
                if (translateSelect) {
                    translateSelect.value = langCode;
                    translateSelect.dispatchEvent(new Event('change'));
                } else {
                    // Retry until the element is ready
                    setTimeout(() => { translatePage(langCode); }, 100);
                }
            }

            // --- URL Path and Translation Logic ---
            function setCountryPath(newSlug, newLangCode) {
                if (newLangCode !== 'en') {
                    translatePage(newLangCode);
                    alertMessage(`Region set to ${newSlug.toUpperCase()}. Content translated to ${newLangCode.toUpperCase()}.`);
                } else {
                    translatePage('en');
                    alertMessage(`Region set to GLOBAL. Content translated to ENGLISH.`);
                }
                closeOutModal();
            }
            
            function checkAndApplyTranslationOnLoad() {
                const currentPath = window.location.pathname;
                const pathSegments = currentPath.split('/').filter(p => p.length > 0);
                const currentSlug = pathSegments.length > 0 && VALID_SLUGS.includes(pathSegments[0]) 
                                    ? pathSegments[0] 
                                    : null;
                                    
                if (currentSlug) {
                    const country = countries.find(c => c.slug === currentSlug);
                    if (country && country.langCode !== 'en') {
                        translatePage(country.langCode);
                    }
                }
            }


            // --- Mobile Accordion Logic (FIXED) ---

            function closeAccordion(button, content, icon) { 
                content.classList.remove('open');
                icon.classList.remove('rotate-180');
                button.setAttribute('aria-expanded', 'false'); 

                content.style.maxHeight = content.scrollHeight + 'px'; 
                
                requestAnimationFrame(() => {
                    content.style.maxHeight = '0px';
                });
            }

            function openAccordion(button, content, icon) { 
                content.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('rotate-180');
                button.setAttribute('aria-expanded', 'true'); 
            }

            function toggleAccordion(button) {
                const targetId = button.getAttribute('data-dropdown-id');
                const content = document.getElementById(targetId);
                const icon = button.querySelector('.dropdown-icon');
                
                const isContentOpen = button.getAttribute('aria-expanded') === 'true';

                // 1. Close all other open accordions
                mobileDropdownTriggers.forEach(otherButton => {
                    const otherContentId = otherButton.getAttribute('data-dropdown-id');
                    const otherContent = document.getElementById(otherContentId);
                    const otherIcon = otherButton.querySelector('.dropdown-icon');
                    
                    if (otherButton !== button && otherButton.getAttribute('aria-expanded') === 'true') {
                        closeAccordion(otherButton, otherContent, otherIcon); 
                    }
                });
                
                // 2. Toggle the current accordion
                if (isContentOpen) {
                    closeAccordion(button, content, icon); 
                } else {
                    openAccordion(button, content, icon); 
                }
            }

            // Initialize Accordion: Ensure all dropdowns start visually closed immediately
            mobileDropdownTriggers.forEach(button => {
                const contentId = button.getAttribute('data-dropdown-id');
                const content = document.getElementById(contentId);
                content.style.maxHeight = '0px'; 
                button.setAttribute('aria-expanded', 'false'); 
                button.addEventListener('click', () => toggleAccordion(button));
            });
            // --- End Mobile Accordion Logic ---


            // --- Initialization Functions ---

            // Apply Content Box Classes
            if (contentBox) {
                contentBox.className = CONTENT_BOX_CLASSES; 
            }

            // Populate the Logo in two locations
            if (navLogoImg) {
                navLogoImg.src = NAV_LOGO_URL; 
                navLogoImg.alt = LOGO_TEXT + ' Logo (Navigation)';
            }
            if (contentLogoImg) {
                contentLogoImg.src = CONTENT_IMG_URL; 
                contentLogoImg.alt = 'Kare Image Placeholder';
            }

            
            // Apply sticky translation immediately on load
            checkAndApplyTranslationOnLoad();

            
            // --- Simple Page Navigation/Scroll to Top ---

            function scrollToTop(e) {
                e.preventDefault(); 
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            if (navLogoLink) {
                navLogoLink.addEventListener('click', scrollToTop);
            }
            
            // Ensure JOIN THE MOVEMENT links scroll to top as well
            const joinMovementLinks = document.querySelectorAll('#nav-join-movement, #mobile-join-movement');
            joinMovementLinks.forEach(el => el.addEventListener('click', scrollToTop));


            // --- Mobile Menu Toggle Logic (Sidebar) ---
            function toggleMobileMenu() {
                const isMenuHidden = mobileMenu.classList.contains('translate-x-full');
                
                if (isMenuHidden) {
                    // --- OPENING THE MENU ---
                    mobileMenu.classList.remove('translate-x-full');
                    document.body.classList.add('overflow-hidden');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-times text-xl"></i>'; // Change to X icon
                } else {
                    // --- CLOSING THE MENU (FIX APPLIED HERE) ---
                    
                    // 1. Check for and close all open mobile dropdowns immediately
                    let wasAnyDropdownOpen = false;
                    mobileDropdownTriggers.forEach(button => {
                        const contentId = button.getAttribute('data-dropdown-id');
                        const content = document.getElementById(contentId);
                        
                        if (button.getAttribute('aria-expanded') === 'true') {
                            closeAccordion(button, content, button.querySelector('.dropdown-icon'));
                            wasAnyDropdownOpen = true;
                        }
                    });

                    // 2. Determine the necessary delay before sliding out the sidebar
                    const delay = wasAnyDropdownOpen ? 310 : 0; 

                    // 3. Slide the sidebar out AFTER the content has collapsed
                    setTimeout(() => {
                        mobileMenu.classList.add('translate-x-full');
                        document.body.classList.remove('overflow-hidden');
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars text-xl"></i>'; // Change back to hamburger icon
                    }, delay);
                }
            }

            if (mobileMenuBtn) { mobileMenuBtn.addEventListener('click', toggleMobileMenu); }
            if (mobileCloseBtn) { mobileCloseBtn.addEventListener('click', toggleMobileMenu); }

            // Consolidated link click listener: Close mobile menu when navigating (clicking an <a> tag)
            if (mobileMenu) {
                mobileMenu.addEventListener('click', (e) => {
                    const target = e.target.closest('a'); 
                    
                    // Check if the clicked element is a link and not the globe link (which opens a modal)
                    if (target && target.id !== 'global-link-mobile') {
                        setTimeout(toggleMobileMenu, 100);
                    }
                });
            }


            // --- Country Modal Logic ---

            // FIX: Updated to accept event object and prevent default navigation
            function openModal(e) { 
                if (e) e.preventDefault(); // <-- CRITICAL FIX: Stops the <a> tag from navigating
                
                if (!mobileMenu.classList.contains('translate-x-full')) {
                    toggleMobileMenu(); // Close mobile menu if open
                }

                countryModal.classList.remove('hidden');
                countryModal.offsetHeight; 
                countryModal.classList.add('opacity-100');
                countryModal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
                document.body.classList.add('overflow-hidden'); 
            }

            function closeOutModal() {
                countryModal.classList.remove('opacity-100');
                countryModal.classList.add('opacity-0');
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');

                setTimeout(() => {
                    countryModal.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden'); 
                }, 300);
            }

            // Render country links for the Modal
            countries.forEach(country => {
                const link = document.createElement('a');
                link.href = "#"; 
                
                let content = country.name;
                let className = 'text-klyr-dark text-sm hover:text-klyr-red transition duration-150';
                
                if (country.isGlobal) {
                    content = `<span class="font-bold">${country.name}</span> <span class="text-sm text-gray-500">${country.sub}</span>`;
                    className = 'font-bold block text-klyr-dark hover:text-klyr-red transition duration-150';
                } else if (country.sub) {
                    content = `${country.name} <span class="text-xs text-gray-500">| ${country.sub}</span>`;
                }
                
                link.innerHTML = content;
                link.className = className;
                
                link.onclick = (e) => {
                    e.preventDefault();
                    setCountryPath(country.slug, country.langCode); 
                };

                countryListContainer.appendChild(link);
            });

            // Attach listener to Desktop Icon and Mobile Link
            if (globalIconDesktop) { globalIconDesktop.addEventListener('click', openModal); }
            if (globalLinkMobile) { globalLinkMobile.addEventListener('click', openModal); }
            if (closeModalBtn) { closeModalBtn.addEventListener('click', closeOutModal); }
            
            // Close modal if user clicks on the backdrop
            if (countryModal) {
                countryModal.addEventListener('click', (e) => {
                    if (e.target === countryModal) {
                        closeOutModal();
                    }
                });
            }
       

   
} // ← this closes the function properly


