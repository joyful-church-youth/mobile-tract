// 스크롤 시 fade-in 애니메이션
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll(
    '.group-card, .joy-card, .gospel-body, .gospel-verse, .prayer-box, .cta-title, .cta-sub, .cta-button'
  );

  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
});
