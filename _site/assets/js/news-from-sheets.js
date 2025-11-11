// assets/js/news-from-sheets.js
// 讀取 Google Sheet CSV，轉成公告卡片清單

(function () {
  const el = document.getElementById('news-list');
  if (!el) return;

  // 從 data-* 取得 CSV 連結
  const csvUrl = el.dataset.csv;
  if (!csvUrl) {
    el.innerHTML = '<p style="color:#b00">未設定 data-csv 來源網址。</p>';
    return;
  }

  // 載入 PapaParse（CSV 解析器）
  function loadPapa(cb) {
    if (window.Papa) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js';
    s.onload = cb;
    s.onerror = () => el.innerHTML = '<p style="color:#b00">載入 CSV 解析器失敗。</p>';
    document.head.appendChild(s);
  }

  function parseDate(s) {
    // 支援 YYYY-MM-DD / YYYY/MM/DD
    if (!s) return null;
    const t = s.replace(/\//g, '-');
    const d = new Date(t);
    return isNaN(d.getTime()) ? null : d;
  }

  function escapeHTML(str) {
    return (str || '').replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  function render(rows) {
    if (!rows.length) {
      el.innerHTML = '<p>目前沒有公告。</p>';
      return;
    }

    const html = rows.map(r => {
      const title = escapeHTML(r.title);
      const summary = escapeHTML(r.summary);
      const dateObj = parseDate(r.date);
      const dateStr = dateObj ? dateObj.toISOString().slice(0,10) : (r.date || '');

      const linkOpen  = r.url ? `<a href="${r.url}" target="_blank" rel="noopener">` : '';
      const linkClose = r.url ? `</a>` : '';

      return `
      <article class="news-card">
        <h3 class="news-title">${linkOpen}${title}${linkClose}</h3>
        <div class="news-meta">日期：${dateStr}</div>
        ${summary ? `<p class="news-summary">${summary}</p>` : ''}
      </article>`;
    }).join('');

    el.innerHTML = html;
  }

  function fetchAndRender() {
    const url = csvUrl + (csvUrl.includes('?') ? '&' : '?') + 'cache=' + Date.now(); // 防止快取
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        let rows = res.data || [];

        // 正規化欄位名稱為小寫
        rows = rows.map(row => {
          const o = {};
          Object.keys(row).forEach(k => o[k.trim().toLowerCase()] = (row[k] || '').toString().trim());
          return o;
        });

        // 過濾 publish != TRUE 的列
        rows = rows.filter(r => (r.publish || '').toUpperCase() === 'TRUE');

        // 日期排序（新到舊）
        rows.sort((a, b) => {
          const da = parseDate(a.date), db = parseDate(b.date);
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return db - da;
        });

        render(rows);
      },
      error: () => el.innerHTML = '<p style="color:#b00">讀取試算表失敗，請稍後再試。</p>'
    });
  }

  // 簡單樣式（也可搬到你的 main CSS）
  const style = document.createElement('style');
  style.textContent = `
  #news-list { display: grid; gap: 12px; }
  .news-card { background: #fff; color:#222; border-radius: 10px; padding: 12px 14px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .news-title { margin: 0 0 6px; font-size: 1.05rem; }
  .news-title a { color: inherit; text-decoration: none; border-bottom: 1px dashed #999; }
  .news-title a:hover { opacity:.85; }
  .news-meta { font-size:.9rem; color:#666; margin-bottom:4px; }
  .news-summary { margin:.3rem 0 0; }
  @media (max-width: 768px) { .news-card { padding: 12px; } }
  `;
  document.head.appendChild(style);

  loadPapa(fetchAndRender);
})();
