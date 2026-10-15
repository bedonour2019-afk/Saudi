/* ========================================================
   THE SAUDI HOUSE (البيت السعودي للعبايات) - Luxury Interactions & Scroll Effects
   ======================================================== */

document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initNavbarScroll();
    initScrollAnimations();
    initAnimatedCounters();
    initCategoryFilters();
    initSizeGuideCalculator();
    initScrollTopButton();
    initQuickViewModal();
    initContactForm();
});

/* 1. Scroll Progress Indicator */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }, { passive: true });
}

/* 2. Navbar shrink on scroll */
function initNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* 3. Luxury Scroll Animations (IntersectionObserver) */
function initScrollAnimations() {
    const animElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right');
    if (!animElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Optional: keep observing or unobserve once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animElements.forEach(el => revealObserver.observe(el));
}

/* 4. Animated Number Counters */
function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.stat-number');
    if (!counterElements.length) return;

    let hasStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                counterElements.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target') || '0', 10);
                    const prefix = counter.getAttribute('data-prefix') || '';
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const stepTime = 25;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.innerText = prefix + target.toLocaleString('ar-EG') + suffix;
                            clearInterval(timer);
                        } else {
                            counter.innerText = prefix + Math.floor(current).toLocaleString('ar-EG') + suffix;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.getElementById('statsSection');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
}

/* 5. Abaya Collections Filter */
function initCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-tab-btn');
    const items = document.querySelectorAll('.abaya-item-col');

    if (!filterBtns.length || !items.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.96)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* 6. Smart Size Guide Calculator */
function initSizeGuideCalculator() {
    const heightInput = document.getElementById('userHeightInput');
    const calcBtn = document.getElementById('calcSizeBtn');
    const recommendedSizeSpan = document.getElementById('recommendedSize');
    const abayaLengthSpan = document.getElementById('recommendedLength');
    const sizeNoteSpan = document.getElementById('sizeNote');

    if (!heightInput || !calcBtn) return;

    function calculateSize() {
        const height = parseInt(heightInput.value, 10);
        if (isNaN(height) || height < 140 || height > 190) {
            alert('يرجى إدخال طول صحيح بين 140 سم و 190 سم.');
            return;
        }

        let size = 54;
        let length = 54;
        let note = "المقاس الأنسب لإطلالة محتشمة وراقية تناسب الحذاء المناسب.";

        if (height <= 153) {
            size = 50;
            length = 50;
            note = "مقاس 50 يضمن أن العباية لا تسحب على الأرض مع أناقة تامة.";
        } else if (height <= 158) {
            size = 52;
            length = 52;
            note = "مقاس 52 يوفر تناسقاً مثالياً مع كعب متوسط أو حذاء فلات.";
        } else if (height <= 163) {
            size = 54;
            length = 54;
            note = "المقاس الأكثر طلباً 54 يناسب معظم الأطوال مع تغطية كاملة مريحة.";
        } else if (height <= 168) {
            size = 56;
            length = 56;
            note = "مقاس 56 يمنحكِ هيبة وانسيابية ملكية خاصة عند الحركة.";
        } else if (height <= 173) {
            size = 58;
            length = 58;
            note = "مقاس 58 مخصص للأطوال الفارهة مع اتساع وستر خليجي متميز.";
        } else {
            size = 60;
            length = 60;
            note = "مقاس 60 صُمم خصيصاً ليناسب الأطوال العالية مع تفصيل فخم.";
        }

        if (recommendedSizeSpan) recommendedSizeSpan.innerText = size;
        if (abayaLengthSpan) abayaLengthSpan.innerText = length + ' إنش';
        if (sizeNoteSpan) sizeNoteSpan.innerText = note;
    }

    calcBtn.addEventListener('click', calculateSize);
    heightInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            calculateSize();
        }
    });
}

/* 7. Scroll To Top Button */
function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }, { passive: true });

    scrollBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* 8. Quick View Modal */
function initQuickViewModal() {
    const quickViewModal = document.getElementById('quickViewModal');
    if (!quickViewModal) return;

    quickViewModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        if (!button) return;

        const title = button.getAttribute('data-title') || 'عباية ملكية فاخرة';
        const fabric = button.getAttribute('data-fabric') || 'كريب ملكي أصلي';
        const desc = button.getAttribute('data-desc') || 'عباية خليجية أنيقة بسواد ليزري فاحم وقصة مريحة.';
        const badge = button.getAttribute('data-badge') || 'الأكثر طلباً';
        const img = button.getAttribute('data-img') || '/images/logo.jpg';

        document.getElementById('modalTitle').innerText = title;
        document.getElementById('modalFabric').innerText = fabric;
        document.getElementById('modalDesc').innerText = desc;
        document.getElementById('modalBadge').innerText = badge;
        document.getElementById('modalImg').src = img;

        // Update inquiry link
        const inquiryBtn = document.getElementById('modalInquiryBtn');
        if (inquiryBtn) {
            const message = encodeURIComponent(`مرحباً البيت السعودي للعبايات، استفسر عن الموديل: ${title} (${fabric}) المعروض على الموقع.`);
            inquiryBtn.href = `https://wa.me/201000000000?text=${message}`; // fallback or direct call
        }
    });
}

/* 9. Booking / Inquiry Form */
function initContactForm() {
    const form = document.getElementById('bookingForm');
    const feedback = document.getElementById('bookingFeedback');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('clientName').value;
        const phone = document.getElementById('clientPhone').value;

        if (feedback) {
            feedback.innerHTML = `
                <div class="alert alert-success mt-3" style="background: rgba(212, 175, 55, 0.15); border: 1px solid #d4af37; color: #fff;">
                    <i class="fa-solid fa-circle-check text-gold me-2"></i>
                    شكراً لكِ أ/ ${name}، تم استلام طلبكِ وسيتواصل معكِ فريق البيت السعودي على الرقم (${phone}) لتأكيد التفاصيل وموعد الزيارة في فرع طنطا.
                </div>
            `;
            form.reset();
        }
    });
}
