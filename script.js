const languages = {
    en: () => import('./en_dict.js'),
    pt: () => import('./pt_dict.js'),
    es: () => import('./es_dict.js'),
};

const translationKeys = {
    title: 'title',
    'brand-name': 'brandName',
    'nav-discover': 'navDiscover',
    'nav-about': 'navAbout',
    'nav-booking': 'navBooking',
    'btn-login': 'btnLogin',
    'btn-register': 'btnRegister',
    'hero-title': 'heroTitle',
    'hero-subtitle': 'heroSubtitle',
    'btn-explore': 'btnExplore',
    'about-title': 'aboutTitle',
    'about-desc': 'aboutDescription',
    'feature-1-title': 'feature1Title',
    'feature-1-desc': 'feature1Description',
    'feature-2-title': 'feature2Title',
    'feature-2-desc': 'feature2Description',
    'feature-3-title': 'feature3Title',
    'feature-3-desc': 'feature3Description',
    'feature-4-title': 'feature4Title',
    'feature-4-desc': 'feature4Description',
    'booking-title': 'bookingTitle',
    'booking-subtitle': 'bookingSubtitle',
    'label-from': 'labelFrom',
    'label-to': 'labelTo',
    'label-departure': 'labelDeparture',
    'label-return': 'labelReturn',
    'label-passengers': 'labelPassengers',
    'label-class': 'labelClass',
    'option-economy': 'optionEconomy',
    'option-premium': 'optionPremium',
    'option-business': 'optionBusiness',
    'option-first': 'optionFirst',
    'btn-search': 'btnSearch',
    'footer-company': 'footerCompany',
    'footer-about': 'footerAbout',
    'footer-career': 'footerCareer',
    'footer-press': 'footerPress',
    'footer-support': 'footerSupport',
    'footer-contact': 'footerContact',
    'footer-faq': 'footerFAQ',
    'footer-help': 'footerHelp',
    'footer-legal': 'footerLegal',
    'footer-privacy': 'footerPrivacy',
    'footer-terms': 'footerTerms',
    'footer-cookies': 'footerCookies',
    'footer-copyright': 'footerCopyright',
    'placeholder-from': 'placeholderFrom',
    'placeholder-to': 'placeholderTo',
};

function selectLanguage(lang) {
    updateDocumentLanguage(lang);
    document.querySelectorAll('.lang-btn').forEach((button) => {
        button.classList.toggle('active', button.textContent === lang.toUpperCase());
    });
    localStorage.setItem("selectedLanguage", lang);
}

function updateDocumentLanguage(lang) {
    const loader = languages[lang];
    if (!loader) return;

    loader().then((module) => {
        const dict = module.default;

        document.querySelectorAll('[data-title]').forEach((element) => {
            if (dict.title) element.textContent = dict.title;
        });

        for (const [dataKey, translationKey] of Object.entries(translationKeys)) {
            document.querySelectorAll(`[data-${dataKey}]`).forEach((element) => {
                const text = dict[translationKey];
                if (!text) return;
                const tag = element.tagName.toLowerCase();
                if (tag === 'input' && element.type !== 'button') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            });
        }
    });
}

let activeIndex = 0;
let bannerTimer;

function changeBanner(index) {
    const banners = document.querySelectorAll('.hero-banner');
    const indicators = document.querySelectorAll('.indicator');
    activeIndex = index % banners.length;
    banners.forEach((banner, i) => banner.classList.toggle('active', i === activeIndex));
    indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === activeIndex));
}

function startBannerRotation() {
    bannerTimer = setInterval(() => changeBanner((activeIndex + 1) % document.querySelectorAll('.hero-banner').length), 5000);
}

function stopBannerRotation() {
    clearInterval(bannerTimer);
}

function getBookingData() {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const departureDate = document.getElementById('departure-date').value;
    const returnDate = document.getElementById('return-date').value;
    const passengers = document.getElementById('passengers').value;
    const travelClass = document.getElementById('class').selectedOptions[0].text;
    return { from, to, departureDate, returnDate, passengers, travelClass };
}

function renderBookingResult(data) {
    const result = document.getElementById('booking-result');
    const returnText = data.returnDate ? data.returnDate : 'One-way';
    const passengerText = data.passengers === '1' ? 'passenger' : 'passengers';

    result.innerHTML = `
        <strong>${data.status}</strong>
        <p>${data.message}</p>
        <ul>
            <li><strong>${data.from}</strong> → <strong>${data.to}</strong></li>
            <li>${data.departureDate} — ${returnText}</li>
            <li>${data.passengers} ${passengerText}</li>
            <li>${data.travelClass}</li>
        </ul>
    `;
}

function handleBookingSubmit(event) {
    event.preventDefault();
    const data = getBookingData();

    if (!data.from || !data.departureDate) {
        renderBookingResult({
            status: 'Incomplete details',
            message: 'Please enter your departure city and date before searching for flights.',
            ...data,
        });
        return;
    }

    renderBookingResult({
        status: 'Flight search complete',
        message: 'Your Crown Travel experience begins now. This fictional itinerary is ready to inspire your next adventure.',
        ...data,
    });
}

function setInitialTranslations() {
    if (localStorage.getItem("selectedLanguage")) {
        selectLanguage(localStorage.getItem("selectedLanguage"));
        return;
    }

    for (let i = 0; i < navigator.languages.length; i++) {
        if (Object.keys(languages).includes(navigator.languages[i])) {
            selectLanguage(navigator.languages[i]);
            localStorage.setItem("selectedLanguage", navigator.languages[i]);
            return;
        }
    }
}

window.selectLanguage = selectLanguage;
window.changeBanner = changeBanner;

window.addEventListener('DOMContentLoaded', () => {
    setInitialTranslations();
    document.getElementById('booking-form').addEventListener('submit', handleBookingSubmit);
    document.querySelectorAll('.hero-banner').forEach((banner) => {
        banner.addEventListener('mouseenter', stopBannerRotation);
        banner.addEventListener('mouseleave', startBannerRotation);
    });
    startBannerRotation();
});
