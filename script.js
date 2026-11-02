(() => {
  const PAGE_URL = 'https://joyful-church-youth.github.io/mobile-tract/';
  const ADDRESS = '서울 용산구 한강대로77길 12';
  const status = document.querySelector('[data-status]');

  // ---- 받는 분 이름: ?to=지민%20님 → "지민 님께"
  const cleanName = (raw) =>
    (raw || '').replace(/[<>"'`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12);

  const particle = (name) => (/님$/.test(name) ? '께' : '에게');
  const salutation = (name) => name + particle(name);

  const to = cleanName(new URLSearchParams(location.search).get('to'));
  if (to) {
    const greeting = document.querySelector('.letter-greeting');
    const mark = document.createElement('span');
    mark.setAttribute('data-recipient', '');
    mark.textContent = to;
    greeting.replaceChildren(mark, particle(to));
    document.title = `${to}, 추수감사 새가족 초청주일에 초대합니다`;
  }

  // ---- 클립보드 (카카오톡 인앱 브라우저 대비 fallback 포함)
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  };

  // 버튼 문구를 잠깐 바꿨다가 되돌림 (토스트 없이 조용히)
  const flash = (btn, text, state) => {
    const label = btn.querySelector('[data-label]');
    if (!btn.dataset.original) btn.dataset.original = label.textContent;
    label.textContent = text;
    btn.dataset.state = state;
    if (status) status.textContent = text;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      label.textContent = btn.dataset.original;
      delete btn.dataset.state;
    }, 2200);
  };

  const copyBtn = document.querySelector('[data-copy-address]');
  copyBtn?.addEventListener('click', async () => {
    const ok = await copyText(ADDRESS);
    flash(copyBtn, ok ? '주소를 복사했어요' : '길게 눌러 복사해 주세요', ok ? 'done' : 'error');
  });

  // ---- 초대장 보내기
  const form = document.querySelector('[data-share-form]');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const name = cleanName(form.elements.name.value);
    const url = name ? `${PAGE_URL}?to=${encodeURIComponent(name)}` : PAGE_URL;
    const text = name
      ? `${salutation(name)}, 11월 15일 추수감사 새가족 초청주일에 초대합니다.`
      : '11월 15일 추수감사 새가족 초청주일에 초대합니다.';

    if (navigator.share) {
      try {
        await navigator.share({ title: '추수감사 새가족 초청주일', text, url });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }
    const ok = await copyText(`${text}\n${url}`);
    flash(btn, ok ? '링크를 복사했어요' : '복사하지 못했어요', ok ? 'done' : 'error');
  });
})();
