/* === LAYER 1-2: STATE & ICONS === */
const S = {
  windows: [], nextZ: 100, focusedId: null,
  theme: localStorage.getItem('fo-theme') || 'dark',
  accent: localStorage.getItem('fo-accent') || '#a78bfa',
  dockSize: parseInt(localStorage.getItem('fo-docksize')) || 42,
  notes: JSON.parse(localStorage.getItem('fo-notes') || '[]'),
  calEvents: JSON.parse(localStorage.getItem('fo-events') || '{}'),
  runningApps: new Set(),
  minimizedWindows: new Set(),
  menuOpen: null, spotlightOpen: false, mcOpen: false
};
const persist = () => {
  localStorage.setItem('fo-theme', S.theme);
  localStorage.setItem('fo-accent', S.accent);
  localStorage.setItem('fo-docksize', S.dockSize);
  localStorage.setItem('fo-notes', JSON.stringify(S.notes));
  localStorage.setItem('fo-events', JSON.stringify(S.calEvents));
  if(S.wallpaper) localStorage.setItem('fo-wallpaper', S.wallpaper);
};
const _q = s => document.querySelector(s);
const _qa = s => document.querySelectorAll(s);
const CE = (tag, cls, html) => { const e = document.createElement(tag); if(cls) e.className = cls; if(html) e.innerHTML = html; return e; };
const applyTheme = () => { document.documentElement.setAttribute('data-theme', S.theme); document.documentElement.style.setProperty('--accent', S.accent); };
const FS = {
  '/': { type:'dir', children:['Home','Applications','Documents','Downloads','Desktop'] },
  '/Home': { type:'dir', children:['Documents','Downloads','Pictures','Desktop'] },
  '/Home/Documents': { type:'dir', children:['notes.txt','project-plan.md','budget.xlsx'] },
  '/Home/Documents/notes.txt': { type:'file', content:'Meeting notes from last week...', size:'2.4 KB', modified:'2026-08-28' },
  '/Home/Documents/project-plan.md': { type:'file', content:'# Project Plan\n\n## Phase 1\n- Research\n- Design\n\n## Phase 2\n- Development\n- Testing', size:'4.1 KB', modified:'2026-08-30' },
  '/Home/Documents/budget.xlsx': { type:'file', content:'Spreadsheet data...', size:'12.8 KB', modified:'2026-08-25' },
  '/Home/Downloads': { type:'dir', children:['image.png','report.pdf','setup.dmg'] },
  '/Home/Downloads/image.png': { type:'file', size:'245 KB', modified:'2026-08-29' },
  '/Home/Downloads/report.pdf': { type:'file', size:'1.2 MB', modified:'2026-08-27' },
  '/Home/Downloads/setup.dmg': { type:'file', size:'45.6 MB', modified:'2026-08-26' },
  '/Home/Pictures': { type:'dir', children:['vacation.jpg','screenshot.png'] },
  '/Home/Pictures/vacation.jpg': { type:'file', size:'3.2 MB', modified:'2026-08-20' },
  '/Home/Pictures/screenshot.png': { type:'file', size:'156 KB', modified:'2026-08-31' },
  '/Home/Desktop': { type:'dir', children:[] },
  '/Applications': { type:'dir', children:['Files.app','Browser.app','Notes.app','Terminal.app','Calculator.app','Settings.app','Calendar.app'] },
  '/Desktop': { type:'dir', children:[] },
  '/Downloads': { type:'dir', children:[] },
  '/Documents': { type:'dir', children:[] }
};
const ICONS = {
  files: '<svg viewBox="0 0 48 48"><rect x="4" y="8" width="40" height="34" rx="4" fill="#60a5fa"/><rect x="8" y="4" width="16" height="8" rx="3" fill="#3b82f6"/><rect x="8" y="18" width="32" height="3" rx="1.5" fill="#fff" opacity=".4"/><rect x="8" y="25" width="24" height="3" rx="1.5" fill="#fff" opacity=".4"/><rect x="8" y="32" width="28" height="3" rx="1.5" fill="#fff" opacity=".4"/></svg>',
  browser: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="#60a5fa" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="none" stroke="#60a5fa" stroke-width="2"/><line x1="4" y1="24" x2="44" y2="24" stroke="#60a5fa" stroke-width="2"/><line x1="24" y1="4" x2="24" y2="44" stroke="#60a5fa" stroke-width="2"/><ellipse cx="24" cy="24" rx="12" ry="20" fill="none" stroke="#60a5fa" stroke-width="1.5"/></svg>',
  notes: '<svg viewBox="0 0 48 48"><rect x="6" y="4" width="36" height="40" rx="4" fill="#fbbf24"/><rect x="10" y="12" width="20" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="10" y="20" width="28" height="3" rx="1.5" fill="#fff" opacity=".6"/><rect x="10" y="28" width="16" height="3" rx="1.5" fill="#fff" opacity=".6"/></svg>',
  terminal: '<svg viewBox="0 0 48 48"><rect x="4" y="6" width="40" height="36" rx="6" fill="#1a1b26"/><polyline points="12,18 20,24 12,30" fill="none" stroke="#9ece6a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><line x1="22" y1="30" x2="36" y2="30" stroke="#9ece6a" stroke-width="3" stroke-linecap="round"/></svg>',
  calculator: '<svg viewBox="0 0 48 48"><rect x="8" y="4" width="32" height="40" rx="6" fill="#374151"/><rect x="12" y="8" width="24" height="12" rx="3" fill="#111827"/><text x="33" y="17" text-anchor="end" fill="#f3f4f6" font-size="11" font-weight="300">3.14</text><rect x="12" y="24" width="6" height="6" rx="1" fill="#6b7280"/><rect x="21" y="24" width="6" height="6" rx="1" fill="#6b7280"/><rect x="30" y="24" width="6" height="6" rx="1" fill="#a78bfa"/><rect x="12" y="33" width="6" height="6" rx="1" fill="#6b7280"/><rect x="21" y="33" width="6" height="6" rx="1" fill="#6b7280"/><rect x="30" y="33" width="6" height="6" rx="1" fill="#a78bfa"/></svg>',
  settings: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8" fill="none" stroke="#9ca3af" stroke-width="3"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6M9.86 9.86l4.24 4.24M33.9 33.9l4.24 4.24M38.14 9.86l-4.24 4.24M14.1 33.9l-4.24 4.24" stroke="#9ca3af" stroke-width="3" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="32" rx="4" fill="#ef4444"/><rect x="6" y="10" width="36" height="10" rx="4" fill="#dc2626"/><text x="24" y="34" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">31</text><rect x="14" y="6" width="4" height="8" rx="2" fill="#9ca3af"/><rect x="30" y="6" width="4" height="8" rx="2" fill="#9ca3af"/></svg>',
  folder: '<svg viewBox="0 0 48 48"><path d="M4 12c0-2.2 1.8-4 4-4h10l4 4h18c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V12z" fill="#60a5fa"/></svg>',
  file: '<svg viewBox="0 0 48 48"><path d="M12 4h16l12 12v28c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/><path d="M28 4v12h12" fill="#d1d5db" stroke="#9ca3af" stroke-width="1"/></svg>',
  wifi: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
  search: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
};
const APP_REGISTRY = [
  { id:'files', name:'Files', icon:ICONS.files, defaultW:750, defaultH:500 },
  { id:'browser', name:'Browser', icon:ICONS.browser, defaultW:900, defaultH:600 },
  { id:'notes', name:'Notes', icon:ICONS.notes, defaultW:700, defaultH:480 },
  { id:'terminal', name:'Terminal', icon:ICONS.terminal, defaultW:640, defaultH:420 },
  { id:'calculator', name:'Calculator', icon:ICONS.calculator, defaultW:260, defaultH:400, noResize:true },
  { id:'settings', name:'Settings', icon:ICONS.settings, defaultW:700, defaultH:480 },
  { id:'calendar', name:'Calendar', icon:ICONS.calendar, defaultW:600, defaultH:460 }
];
const fileIcon = (name) => {
  if(name.endsWith('.app')) return ICONS.calculator;
  if(name.endsWith('/') || !name.includes('.')) return ICONS.folder;
  return ICONS.file;
};
/* === LAYER 1: BOOT === */
const boot = () => {
  const bar = _q('.boot-progress-bar');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 15 + 5;
    if(p >= 100) { p = 100; clearInterval(iv); setTimeout(() => {
      _q('#boot-screen').style.opacity = '0';
      _q('#boot-screen').style.transition = 'opacity 0.4s';
      setTimeout(() => { _q('#boot-screen').style.display = 'none'; _q('#desktop').style.display = 'block'; initDesktop(); }, 400);
    }, 200); }
    bar.style.width = p + '%';
  }, 80);
  _q('#boot-screen').addEventListener('click', () => { clearInterval(iv); bar.style.width = '100%'; setTimeout(() => {
    _q('#boot-screen').style.display = 'none'; _q('#desktop').style.display = 'block'; initDesktop();
  }, 100); });
};

/* === LAYER 4: WINDOW MANAGER === */
let dragState = null, resizeState = null, snapPreview = null;
const SNAP_THRESHOLD = 16;
S.wallpaper = localStorage.getItem('fo-wallpaper') || '';
const createWindow = (appId) => {
  const app = APP_REGISTRY.find(a => a.id === appId);
  if(!app) return;
  const id = 'win-' + Date.now() + '-' + Math.random().toString(36).slice(2,6);
  const w = app.defaultW, h = app.defaultH;
  const x = Math.max(60, (window.innerWidth - w) / 2 + (S.windows.length % 5) * 30);
  const y = Math.max(36, (window.innerHeight - h) / 2 + (S.windows.length % 5) * 20);
  const win = CE('div', 'app-window');
  win.id = id;
  win.dataset.app = appId;
  win.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${S.nextZ++}`;
  const closeSvg = '<svg viewBox="0 0 8 8" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"><line x1="1.5" y1="1.5" x2="6.5" y2="6.5"/><line x1="6.5" y1="1.5" x2="1.5" y2="6.5"/></svg>';
  const minSvg = '<svg viewBox="0 0 8 8" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"><line x1="1" y1="4" x2="7" y2="4"/></svg>';
  const maxSvg = '<svg viewBox="0 0 8 8" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"><polyline points="1,3 1,1 3,1"/><polyline points="5,7 7,7 7,5"/><polyline points="7,1 7,3 5,3"/><polyline points="3,5 1,5 1,7"/></svg>';
  win.innerHTML = `<div class="window-titlebar"><div class="traffic-lights"><div class="traffic-light tl-close" data-action="close">${closeSvg}</div><div class="traffic-light tl-minimize" data-action="minimize">${minSvg}</div><div class="traffic-light tl-maximize" data-action="maximize">${maxSvg}</div></div><div class="window-title">${app.name}</div><div class="window-titlebar-spacer"></div></div><div class="window-body" id="body-${id}"></div>${app.noResize ? '' : '<div class="resize-handle n" data-dir="n"></div><div class="resize-handle s" data-dir="s"></div><div class="resize-handle e" data-dir="e"></div><div class="resize-handle w" data-dir="w"></div><div class="resize-handle ne" data-dir="ne"></div><div class="resize-handle nw" data-dir="nw"></div><div class="resize-handle se" data-dir="se"></div><div class="resize-handle sw" data-dir="sw"></div>'}`;
  _q('#windows-container').appendChild(win);
  S.windows.push({ id, appId, el: win, maximized: false, prevRect: null });
  S.runningApps.add(appId);
  focusWindow(id);
  renderApp(appId, id);
  updateDock();
  updateMenuBar(appId);
  win.querySelector('.tl-close').onclick = () => closeWindow(id);
  win.querySelector('.tl-minimize').onclick = () => minimizeWindow(id);
  win.querySelector('.tl-maximize').onclick = () => toggleMaximize(id);
  win.querySelector('.window-titlebar').addEventListener('dblclick', () => toggleMaximize(id));
  win.addEventListener('mousedown', () => focusWindow(id));
  const tb = win.querySelector('.window-titlebar');
  tb.addEventListener('mousedown', (e) => {
    if(e.target.closest('.traffic-light') || win.classList.contains('maximized')) return;
    dragState = { id, startX: e.clientX, startY: e.clientY, origLeft: win.offsetLeft, origTop: win.offsetTop };
    e.preventDefault();
  });
  if(!app.noResize) win.querySelectorAll('.resize-handle').forEach(h => {
    h.addEventListener('mousedown', (e) => {
      e.preventDefault(); e.stopPropagation();
      resizeState = { id, dir: h.dataset.dir, startX: e.clientX, startY: e.clientY, origLeft: win.offsetLeft, origTop: win.offsetTop, origW: win.offsetWidth, origH: win.offsetHeight };
    });
  });
  bounceDockIcon(appId);
  return id;
};
const focusWindow = (id) => {
  _qa('.app-window').forEach(w => w.classList.remove('focused'));
  const win = S.windows.find(w => w.id === id);
  if(win) { win.el.classList.add('focused'); win.el.style.zIndex = S.nextZ++; S.focusedId = id; updateMenuBar(win.appId); }
};
const closeWindow = (id) => {
  const idx = S.windows.findIndex(w => w.id === id);
  if(idx === -1) return;
  const win = S.windows[idx];
  win.el.style.transition = 'opacity 0.15s, transform 0.15s';
  win.el.style.opacity = '0';
  win.el.style.transform = 'scale(0.95)';
  const appId = win.appId;
  setTimeout(() => { win.el.remove(); S.windows.splice(idx, 1); S.minimizedWindows.delete(id);
    if(!S.windows.some(w => w.appId === appId)) { S.runningApps.delete(appId); updateDock(); updateMenuBar('flowOS'); }
    if(S.focusedId === id) { const last = S.windows[S.windows.length-1]; if(last) focusWindow(last.id); else S.focusedId = null; }
  }, 150);
};
const minimizeWindow = (id) => {
  const win = S.windows.find(w => w.id === id);
  if(!win) return;
  S.minimizedWindows.add(id);
  win.el.classList.add('minimizing');
  win.el.style.transform = 'scale(0.1) translateY(200px)';
  win.el.style.opacity = '0';
  setTimeout(() => { win.el.style.display = 'none'; win.el.classList.remove('minimizing'); }, 350);
  updateDock();
  const next = S.windows.find(w => w.id !== id && !S.minimizedWindows.has(w.id));
  if(next) focusWindow(next.id); else { S.focusedId = null; updateMenuBar('flowOS'); }
};
const restoreWindow = (id) => {
  const win = S.windows.find(w => w.id === id);
  if(!win) return;
  S.minimizedWindows.delete(id);
  win.el.style.display = 'flex';
  win.el.style.opacity = '0';
  win.el.style.transform = 'scale(0.9)';
  requestAnimationFrame(() => { win.el.style.transition = 'opacity 0.2s, transform 0.2s'; win.el.style.opacity = '1'; win.el.style.transform = 'scale(1)'; setTimeout(() => win.el.style.transition = '', 200); });
  focusWindow(id);
  updateDock();
};
const toggleMaximize = (id) => {
  const win = S.windows.find(w => w.id === id);
  if(!win) return;
  if(win.maximized) { win.el.classList.remove('maximized'); if(win.prevRect) { win.el.style.left = win.prevRect.left+'px'; win.el.style.top = win.prevRect.top+'px'; win.el.style.width = win.prevRect.w+'px'; win.el.style.height = win.prevRect.h+'px'; } win.maximized = false; }
  else { win.prevRect = { left:win.el.offsetLeft, top:win.el.offsetTop, w:win.el.offsetWidth, h:win.el.offsetHeight }; win.el.classList.add('maximized'); win.maximized = true; }
};
const getSnapZone = (x, y) => {
  const W = window.innerWidth, H = window.innerHeight, T = SNAP_THRESHOLD;
  if(y <= T) return 'top';
  if(x <= T) return 'left';
  if(x >= W - T) return 'right';
  if(y >= H - T) return 'bottom';
  if(x <= T && y <= T) return 'topleft';
  if(x >= W - T && y <= T) return 'topright';
  if(x <= T && y >= H - T) return 'bottomleft';
  if(x >= W - T && y >= H - T) return 'bottomright';
  return null;
};
const applySnap = (win, zone) => {
  const W = window.innerWidth, H = window.innerHeight, MB = 28;
  const snapRects = {
    top: { left: 0, top: MB, width: W, height: (H-MB)/2 },
    bottom: { left: 0, top: MB+(H-MB)/2, width: W, height: (H-MB)/2 },
    left: { left: 0, top: MB, width: W/2, height: H-MB },
    right: { left: W/2, top: MB, width: W/2, height: H-MB },
    topleft: { left: 0, top: MB, width: W/2, height: (H-MB)/2 },
    topright: { left: W/2, top: MB, width: W/2, height: (H-MB)/2 },
    bottomleft: { left: 0, top: MB+(H-MB)/2, width: W/2, height: (H-MB)/2 },
    bottomright: { left: W/2, top: MB+(H-MB)/2, width: W/2, height: (H-MB)/2 }
  };
  const r = snapRects[zone];
  win.prevRect = { left:win.el.offsetLeft, top:win.el.offsetTop, w:win.el.offsetWidth, h:win.el.offsetHeight };
  win.el.style.transition = 'all 0.2s cubic-bezier(0.4,0,0.2,1)';
  win.el.style.left = r.left+'px'; win.el.style.top = r.top+'px';
  win.el.style.width = r.width+'px'; win.el.style.height = r.height+'px';
  setTimeout(() => { win.el.style.transition = ''; }, 200);
};
const showSnapPreview = (zone) => {
  removeSnapPreview();
  const W = window.innerWidth, H = window.innerHeight, MB = 28;
  const zones = {
    top:{l:0,t:MB,w:W,h:(H-MB)/2}, bottom:{l:0,t:MB+(H-MB)/2,w:W,h:(H-MB)/2},
    left:{l:0,t:MB,w:W/2,h:H-MB}, right:{l:W/2,t:MB,w:W/2,h:H-MB},
    topleft:{l:0,t:MB,w:W/2,h:(H-MB)/2}, topright:{l:W/2,t:MB,w:W/2,h:(H-MB)/2},
    bottomleft:{l:0,t:MB+(H-MB)/2,w:W/2,h:(H-MB)/2}, bottomright:{l:W/2,t:MB+(H-MB)/2,w:W/2,h:(H-MB)/2}
  };
  const r = zones[zone]; if(!r) return;
  snapPreview = CE('div', '', '');
  snapPreview.style.cssText = 'position:fixed;left:'+r.l+'px;top:'+r.t+'px;width:'+r.w+'px;height:'+r.h+'px;border:2px solid var(--accent);background:var(--accent-bg);border-radius:8px;z-index:9999;pointer-events:none;animation:windowOpen 0.15s ease';
  document.body.appendChild(snapPreview);
};
const removeSnapPreview = () => { if(snapPreview) { snapPreview.remove(); snapPreview = null; } };
document.addEventListener('mousemove', (e) => {
  if(dragState) {
    const d = dragState; const win = S.windows.find(w => w.id === d.id);
    if(win) {
      const nx = d.origLeft + e.clientX - d.startX;
      const ny = Math.max(28, d.origTop + e.clientY - d.startY);
      win.el.style.left = nx+'px'; win.el.style.top = ny+'px';
      const zone = getSnapZone(e.clientX, e.clientY);
      if(zone) showSnapPreview(zone); else removeSnapPreview();
    }
  }
  if(resizeState) { const r = resizeState; const win = S.windows.find(w => w.id === r.id); if(!win) return; const dx = e.clientX - r.startX, dy = e.clientY - r.startY; let nl = r.origLeft, nt = r.origTop, nw = r.origW, nh = r.origH;
    if(r.dir.includes('e')) nw = Math.max(320, r.origW + dx);
    if(r.dir.includes('w')) { nw = Math.max(320, r.origW - dx); nl = r.origLeft + (r.origW - nw); }
    if(r.dir.includes('s')) nh = Math.max(220, r.origH + dy);
    if(r.dir.includes('n')) { nh = Math.max(220, r.origH - dy); nt = Math.max(28, r.origTop + (r.origH - nh)); }
    win.el.style.left = nl+'px'; win.el.style.top = nt+'px'; win.el.style.width = nw+'px'; win.el.style.height = nh+'px'; }
});
document.addEventListener('mouseup', (e) => {
  if(dragState) {
    const zone = getSnapZone(e.clientX, e.clientY);
    if(zone) { const win = S.windows.find(w => w.id === dragState.id); if(win) { removeSnapPreview(); applySnap(win, zone); } }
  }
  dragState = null; resizeState = null; removeSnapPreview();
});
/* === LAYER 3: DOCK === */
const renderDock = () => {
  const dockApps = _q('#dock-apps');
  dockApps.innerHTML = '';
  APP_REGISTRY.forEach(app => {
    const item = CE('div', 'dock-item' + (S.runningApps.has(app.id) ? ' running' : ''));
    item.style.setProperty('--dock-size', S.dockSize + 'px');
    item.innerHTML = `<div class="dock-label">${app.name}</div>${app.icon}<div class="dock-dot"></div>`;
    item.querySelector('svg').style.width = S.dockSize + 'px';
    item.querySelector('svg').style.height = S.dockSize + 'px';
    item.addEventListener('click', () => {
      const existing = S.windows.find(w => w.appId === app.id);
      if(existing) { if(S.minimizedWindows.has(existing.id)) restoreWindow(existing.id); else focusWindow(existing.id); }
      else createWindow(app.id);
    });
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      _qa('.dock-context').forEach(c => c.classList.remove('show'));
      const ctx = CE('div', 'dock-context show');
      ctx.innerHTML = `<div class="ctx-item" data-action="open">Open</div><div class="ctx-item" data-action="quit">Quit</div>`;
      ctx.style.position = 'fixed';
      ctx.style.left = e.clientX + 'px';
      ctx.style.bottom = (window.innerHeight - e.clientY + 10) + 'px';
      ctx.style.zIndex = '10001';
      document.body.appendChild(ctx);
      ctx.querySelector('[data-action="open"]').onclick = () => { ctx.remove(); createWindow(app.id); };
      ctx.querySelector('[data-action="quit"]').onclick = () => { ctx.remove(); const wins = S.windows.filter(w => w.appId === app.id); wins.forEach(w => closeWindow(w.id)); };
      setTimeout(() => { const h = () => { ctx.remove(); document.removeEventListener('click', h); }; document.addEventListener('click', h); }, 10);
    });
    dockApps.appendChild(item);
  });
};
const updateDock = () => { renderDock(); };
let bounceTimers = {};
const bounceDockIcon = (appId) => {
  const items = _qa('.dock-item');
  const idx = APP_REGISTRY.findIndex(a => a.id === appId);
  if(items[idx]) { items[idx].classList.remove('bouncing'); void items[idx].offsetWidth; items[idx].classList.add('bouncing'); }
};
let dockMouseX = -1;
document.addEventListener('mousemove', (e) => {
  const dock = _q('#dock');
  if(!dock) return;
  const rect = dock.getBoundingClientRect();
  if(e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 20 && e.clientX >= rect.left - 20 && e.clientX <= rect.right + 20) {
    dockMouseX = e.clientX;
    const items = dock.querySelectorAll('.dock-item');
    items.forEach(item => {
      const ir = item.getBoundingClientRect();
      const centerX = ir.left + ir.width / 2;
      const dist = Math.abs(dockMouseX - centerX);
      const maxDist = 120;
      const scale = Math.max(1, 1.5 - (dist / maxDist) * 0.5);
      const svg = item.querySelector('svg');
      if(svg) svg.style.transform = `scale(${scale})`;
    });
  } else {
    dockMouseX = -1;
    _qa('.dock-item svg').forEach(svg => svg.style.transform = 'scale(1)');
  }
});

/* === LAYER 2: MENU BAR === */
const MENUS = {
  flowOS: [{ label:'About flowOS', action:'about' }, { type:'sep' }, { label:'System Preferences...', shortcut:'⌘,', action:'open-settings' }, { type:'sep' }, { label:'Sleep' }, { label:'Restart...', action:'restart' }, { label:'Shut Down...' }],
  Files: [{ label:'New Window', shortcut:'⌘N', action:'new-window' }, { type:'sep' }, { label:'New Folder', shortcut:'⇧⌘N' }, { type:'sep' }, { label:'Close Window', shortcut:'⌘W', action:'close' }],
  Browser: [{ label:'New Tab', shortcut:'⌘T', action:'new-tab' }, { type:'sep' }, { label:'Close Tab', shortcut:'⌘W', action:'close' }],
  Notes: [{ label:'New Note', shortcut:'⌘N', action:'new-note' }, { type:'sep' }, { label:'Close', shortcut:'⌘W', action:'close' }],
  Terminal: [{ label:'New Window', shortcut:'⌘N' }, { type:'sep' }, { label:'Clear', shortcut:'⌘K', action:'clear' }, { label:'Close', shortcut:'⌘W', action:'close' }],
  Calculator: [{ label:'Close', shortcut:'⌘W', action:'close' }],
  Settings: [{ label:'Close', shortcut:'⌘W', action:'close' }],
  Calendar: [{ label:'Close', shortcut:'⌘W', action:'close' }]
};
const updateMenuBar = (appId) => {
  const nameEl = _q('#menu-active-app');
  const appName = appId === 'flowOS' ? 'flowOS' : (APP_REGISTRY.find(a => a.id === appId)?.name || 'flowOS');
  nameEl.textContent = appName;
  const itemsEl = _q('#menu-items');
  const menuKey = appId === 'flowOS' ? 'flowOS' : appName;
  const menuItems = MENUS[menuKey] || MENUS.flowOS;
  itemsEl.innerHTML = '';
  if(menuKey !== 'flowOS') {
    const sysItem = CE('div', 'menu-item', 'flowOS');
    sysItem.addEventListener('click', () => showMenuDropdown(sysItem, MENUS.flowOS));
    sysItem.addEventListener('mouseenter', () => { if(S.menuOpen) showMenuDropdown(sysItem, MENUS.flowOS); });
    itemsEl.appendChild(sysItem);
  }
  const items = menuKey === 'flowOS' ? [] : menuItems;
  items.forEach(m => {
    if(m.type === 'sep') { itemsEl.appendChild(CE('div', '', '<div class="ctx-sep" style="height:16px;width:1px;background:var(--border);margin:0 2px"></div>')); return; }
    const mi = CE('div', 'menu-item', m.label);
    mi.addEventListener('click', () => { closeAllMenus(); if(m.action === 'close' && S.focusedId) closeWindow(S.focusedId); if(m.action === 'open-settings') createWindow('settings'); if(m.action === 'new-window' && appId) createWindow(appId); if(m.action === 'restart') location.reload(); });
    mi.addEventListener('mouseenter', () => { if(S.menuOpen) showMenuDropdown(mi, items); });
    itemsEl.appendChild(mi);
  });
  if(menuKey === 'flowOS') {
    ['About flowOS'].forEach(label => {
      const mi = CE('div', 'menu-item', 'flowOS');
      itemsEl.appendChild(mi);
    });
  }
};
const showMenuDropdown = (menuItem, items) => {
  closeAllMenus();
  const dd = CE('div', 'menu-dropdown');
  items.forEach(m => {
    if(m.type === 'sep') { dd.appendChild(CE('div', 'ctx-sep')); return; }
    const ci = CE('div', 'ctx-item', m.label + (m.shortcut ? `<span class="shortcut">${m.shortcut}</span>` : ''));
    ci.addEventListener('click', (e) => { e.stopPropagation(); closeAllMenus(); if(m.action === 'close' && S.focusedId) closeWindow(S.focusedId); if(m.action === 'open-settings') createWindow('settings'); if(m.action === 'restart') location.reload(); });
    dd.appendChild(ci);
  });
  menuItem.style.position = 'relative';
  menuItem.appendChild(dd);
  S.menuOpen = true;
};
const closeAllMenus = () => { _qa('.menu-dropdown').forEach(d => d.remove()); S.menuOpen = false; };
const updateClock = () => { const now = new Date(); const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']; const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; _q('#menu-clock').textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}  ${now.toLocaleTimeString([], {hour:'numeric',minute:'2-digit'})}`; };
/* === LAYER 5: APP RENDERERS === */
const renderApp = (appId, winId) => {
  const body = _q(`#body-${winId}`);
  if(!body) return;
  switch(appId) {
    case 'files': renderFiles(body, winId); break;
    case 'browser': renderBrowser(body, winId); break;
    case 'notes': renderNotes(body, winId); break;
    case 'terminal': renderTerminal(body, winId); break;
    case 'calculator': renderCalculator(body, winId); break;
    case 'settings': renderSettings(body, winId); break;
    case 'calendar': renderCalendar(body, winId); break;
  }
};
const renderFiles = (body, winId) => {
  let currentPath = '/Home';
  let viewMode = 'grid';
  const render = () => {
    const node = FS[currentPath];
    const children = node ? (node.children || []) : [];
    const pathParts = currentPath.split('/').filter(Boolean);
    body.innerHTML = `<div class="files-app"><div class="files-sidebar"><div class="sidebar-section">Favorites</div><div class="sidebar-item ${currentPath==='/Home'?'active':''}" data-path="/Home">${ICONS.folder.replace('viewBox','width="16" height="16" viewBox')}<span>Home</span></div><div class="sidebar-item ${currentPath==='/Home/Desktop'?'active':''}" data-path="/Home/Desktop">${ICONS.folder.replace('viewBox','width="16" height="16" viewBox')}<span>Desktop</span></div><div class="sidebar-item ${currentPath==='/Home/Documents'?'active':''}" data-path="/Home/Documents">${ICONS.folder.replace('viewBox','width="16" height="16" viewBox')}<span>Documents</span></div><div class="sidebar-item ${currentPath==='/Home/Downloads'?'active':''}" data-path="/Home/Downloads">${ICONS.folder.replace('viewBox','width="16" height="16" viewBox')}<span>Downloads</span></div><div class="sidebar-item ${currentPath==='/Home/Pictures'?'active':''}" data-path="/Home/Pictures">${ICONS.folder.replace('viewBox','width="16" height="16" viewBox')}<span>Pictures</span></div><div class="sidebar-section">Locations</div><div class="sidebar-item ${currentPath==='/'?'active':''}" data-path="/"><span>/ (Root)</span></div></div><div class="files-content"><div class="files-toolbar"><button id="fw-${winId}">◀</button><button id="bw-${winId}">▶</button><div class="breadcrumb">${pathParts.map((p,i) => `<span data-path="/${pathParts.slice(0,i+1).join('/')}">${i===0?'/ ':''+p}</span>`).join('<span class="sep">›</span>')}</div><div style="flex:1"></div><button class="${viewMode==='grid'?'active':''}" onclick="this.closest('.files-app').__viewMode='grid'">⊞</button><button class="${viewMode==='list'?'active':''}" onclick="this.closest('.files-app').__viewMode='list'">☰</button></div><div class="files-search"><input type="text" placeholder="Search..." id="fs-${winId}"></div><div class="${viewMode==='grid'?'files-grid':'files-list'}" id="fview-${winId}">${viewMode==='grid' ? children.map(name => {
      const isDir = !name.includes('.') || name.endsWith('.app');
      const fPath = currentPath + '/' + name;
      return `<div class="file-item" data-path="${fPath}" data-name="${name}">${fileIcon(name)}<span>${name.replace('.app','')}</span></div>`;
    }).join('') : `<div class="files-list-header"><span>Name</span><span>Size</span><span>Modified</span></div>${children.map(name => {
      const fPath = currentPath + '/' + name;
      const node = FS[fPath];
      return `<div class="files-list-item" data-path="${fPath}" data-name="${name}"><span>${name}</span><span>${node?.size||'--'}</span><span>${node?.modified||'--'}</span></div>`;
    }).join('')}`}</div></div></div>`;
    body.querySelector('.files-sidebar').addEventListener('click', (e) => {
      const item = e.target.closest('.sidebar-item');
      if(item) { currentPath = item.dataset.path; render(); }
    });
    body.querySelector('.breadcrumb').addEventListener('click', (e) => {
      const span = e.target.closest('span[data-path]');
      if(span) { currentPath = span.dataset.path; render(); }
    });
    body.querySelectorAll('.file-item, .files-list-item').forEach(el => {
      el.addEventListener('click', (e) => { body.querySelectorAll('.file-item,.files-list-item').forEach(f => f.classList.remove('selected')); el.classList.add('selected'); e.stopPropagation(); });
      el.addEventListener('dblclick', () => {
        const p = el.dataset.path;
        const node = FS[p];
        if(node && node.type === 'dir') { currentPath = p; render(); }
      });
      const p = el.dataset.path;
      const fNode = FS[p];
      if(fNode && fNode.type === 'file') makeDraggable(el, {name:el.dataset.path.split('/').pop(), type:'file', size:fNode.size, modified:fNode.modified});
    });
    const search = body.querySelector(`#fs-${winId}`);
    if(search) search.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      body.querySelectorAll('.file-item,.files-list-item').forEach(el => {
        el.style.display = el.dataset.name?.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  };
  render();
};
const renderBrowser = (body, winId) => {
  let url = '', tabs = [{title:'New Tab', url:''}], activeTab = 0;
  const render = () => {
    body.innerHTML = `<div class="browser-app"><div class="browser-tabs">${tabs.map((t,i) => `<div class="browser-tab ${i===activeTab?'active':''}" data-idx="${i}"><span>${t.title||'New Tab'}</span><span class="tab-close" data-idx="${i}">×</span></div>`).join('')}<div class="browser-tab" id="newtab-${winId}" style="opacity:0.5">+</div></div><div class="browser-toolbar"><button id="bfwd-${winId}">◀</button><button id="bbwd-${winId}">▶</button><button id="brel-${winId}">↻</button><input type="text" class="browser-url" id="burl-${winId}" value="${tabs[activeTab]?.url||''}" placeholder="Enter URL or search..."></div><div class="browser-content" id="bcont-${winId}">${tabs[activeTab]?.url ? `<iframe src="${tabs[activeTab].url}" sandbox="allow-scripts allow-same-origin"></iframe>` : `<div class="browser-home"><input type="text" placeholder="Search or enter URL..." id="bhome-${winId}"><div class="favorites"><div class="fav-item" data-url="https://example.com"><div class="fav-icon">E</div><span>Example</span></div><div class="fav-item" data-url="https://wikipedia.org"><div class="fav-icon">W</div><span>Wikipedia</span></div><div class="fav-item" data-url="https://github.com"><div class="fav-icon">G</div><span>GitHub</span></div></div></div>`}</div></div>`;
    const urlInput = body.querySelector(`#burl-${winId}`);
    const navigate = (u) => { if(!u) return; if(!u.startsWith('http')) u = 'https://' + u; tabs[activeTab].url = u; tabs[activeTab].title = new URL(u).hostname; render(); };
    if(urlInput) urlInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') navigate(urlInput.value); });
    const homeInput = body.querySelector(`#bhome-${winId}`);
    if(homeInput) homeInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') navigate(homeInput.value); });
    body.querySelectorAll('.fav-item').forEach(f => f.addEventListener('click', () => navigate(f.dataset.url)));
    body.querySelectorAll('.browser-tab').forEach(t => t.addEventListener('click', (e) => { if(e.target.classList.contains('tab-close')) { tabs.splice(parseInt(e.target.dataset.idx), 1); if(activeTab >= tabs.length) activeTab = Math.max(0, tabs.length-1); if(tabs.length === 0) tabs.push({title:'New Tab', url:''}); render(); } else { activeTab = parseInt(t.dataset.idx); render(); } }));
    const newTab = body.querySelector(`#newtab-${winId}`);
    if(newTab) newTab.addEventListener('click', () => { tabs.push({title:'New Tab', url:''}); activeTab = tabs.length-1; render(); });
  };
  render();
};
const renderNotes = (body, winId) => {
  if(!S.notes.length) S.notes = [{id:Date.now(), title:'Welcome Note', content:'Welcome to flowOS Notes!', date:new Date().toISOString()}];
  let aid = S.notes[0].id;
  const r = () => {
    const n = S.notes.find(x => x.id === aid);
    body.innerHTML = '<div class="notes-app"><div class="notes-sidebar"><div class="notes-sidebar-header"><span>Notes</span><button id="na-'+winId+'">+</button></div><div class="notes-list">'+S.notes.map(x=>'<div class="notes-list-item '+(x.id===aid?'active':'')+'" data-id="'+x.id+'"><div class="note-title">'+(x.title||'Untitled')+'</div><div class="note-date">'+new Date(x.date).toLocaleDateString()+'</div></div>').join('')+'</div></div><div class="notes-editor"><div class="notes-editor-toolbar"><button onclick="document.execCommand(\'bold\')"><b>B</b></button><button onclick="document.execCommand(\'italic\')"><i>I</i></button><button onclick="document.execCommand(\'underline\')"><u>U</u></button></div><div class="notes-editor-body"><div contenteditable="true" data-placeholder="Start typing..." id="ne-'+winId+'">'+(n?n.content:'')+'</div></div></div></div>';
    body.querySelector('#na-'+winId).onclick=()=>{const x={id:Date.now(),title:'New Note',content:'',date:new Date().toISOString()};S.notes.unshift(x);aid=x.id;persist();r();};
    body.querySelectorAll('.notes-list-item').forEach(el=>el.onclick=()=>{aid=+el.dataset.id;r();});
    const ed=body.querySelector('#ne-'+winId);
    if(ed)ed.oninput=()=>{if(n){n.content=ed.innerHTML;n.title=ed.textContent.slice(0,50)||'Untitled';persist();}};
  };r();
};
const renderTerminal = (body, winId) => {
  let cwd='/Home',hist=[],hi=-1;
  const pr=()=>'user@flowOS '+cwd+' $ ';
  body.innerHTML='<div class="terminal-app"><div class="terminal-body" id="tb-'+winId+'"><div class="term-line"><span class="term-output">Welcome to flowOS Terminal v1.0\nType help for commands.\n</span></div></div><div class="terminal-input-line"><span class="term-prompt">'+pr()+'</span><input type="text" id="ti-'+winId+'"></div></div>';
  const tb=body.querySelector('#tb-'+winId),inp=body.querySelector('#ti-'+winId);
  const add=(t,c)=>{tb.innerHTML+='<div class="term-line '+(c||'')+'">'+t+'</div>';tb.scrollTop=tb.scrollHeight;};
  const rp=(p)=>{if(p.startsWith('/'))return p;if(p==='~')return'/Home';if(p.startsWith('~/'))return'/Home'+p.slice(1);return cwd+'/'+p;};
  const exec=(cmd)=>{
    add(pr()+cmd);
    const p=cmd.trim().split(/\s+/),c=p[0],a=p.slice(1);
    hist.push(cmd);hi=hist.length;
    switch(c){
      case'':break;
      case'help':add('<span class="term-output">Commands: ls, cd, pwd, whoami, clear, echo, cat, date, help</span>');break;
      case'ls':{const n=FS[rp(a[0]||'.')];if(n&&n.type==='dir')add('<span class="term-output">'+(n.children||[]).join('  ')+'</span>');else add('<span class="term-error">ls: no such directory</span>');break;}
      case'cd':{if(!a[0]||a[0]==='~'){cwd='/Home';break;}const p2=rp(a[0]);if(FS[p2]&&FS[p2].type==='dir')cwd=p2;else add('<span class="term-error">cd: no such directory</span>');break;}
      case'pwd':add('<span class="term-output">'+cwd+'</span>');break;
      case'whoami':add('<span class="term-output">user</span>');break;
      case'clear':tb.innerHTML='';break;
      case'echo':add('<span class="term-output">'+a.join(' ')+'</span>');break;
      case'cat':{const n=FS[rp(a[0])];if(n&&n.type==='file')add('<span class="term-output">'+(n.content||'No preview')+'</span>');else add('<span class="term-error">cat: no such file</span>');break;}
      case'date':add('<span class="term-output">'+new Date().toString()+'</span>');break;
      default:add('<span class="term-error">command not found: '+c+'</span>');
    }
  };
  inp.onkeydown=(e)=>{if(e.key==='Enter'){exec(inp.value);inp.value='';}if(e.key==='ArrowUp'){e.preventDefault();if(hi>0){hi--;inp.value=hist[hi];}}if(e.key==='ArrowDown'){e.preventDefault();if(hi<hist.length-1){hi++;inp.value=hist[hi];}else{hi=hist.length;inp.value='';}}};
  body.onclick=()=>inp.focus();
};
const renderCalculator = (body, winId) => {
  let disp='0',op=null,prev=null,mem=0,reset=false;
  const btns=[
    ['MC','fn'],['MR','fn'],['M-','fn'],['M+','fn'],
    ['±','fn'],['%','fn'],['C','fn'],['÷','op'],
    ['7',''],['8',''],['9',''],['×','op'],
    ['4',''],['5',''],['6',''],['−','op'],
    ['1',''],['2',''],['3',''],['+','op'],
    ['0','zero'],['','.'],['=','op']
  ];
  const calc = (a, b, o) => { a=parseFloat(a);b=parseFloat(b); switch(o){case'+':return a+b;case'−':return a-b;case'×':return a*b;case'÷':return b!==0?a/b:'Error';} return b; };
  const render = () => {
    body.innerHTML='<div class="calculator-app"><div class="calc-memory"><button id="mcp-'+winId+'">MC</button><button id="mrp-'+winId+'">MR</button><button id="mp-'+winId+'">M+</button><button id="mm-'+winId+'">M−</button></div><div class="calc-display">'+disp+'</div><div class="calc-buttons">'+btns.map(([label,cls])=>'<button class="calc-btn '+(cls||'')+'" data-val="'+label+'">'+label+'</button>').join('')+'</div></div>';
    body.querySelectorAll('.calc-btn').forEach(b=>b.onclick=()=>{
      const v=b.dataset.val;
      if('0123456789'.includes(v)){if(reset||disp==='0'){disp=v;reset=false;}else disp+=v;}
      else if(v==='.'){if(!disp.includes('.'))disp+='.';}
      else if(v==='C'){disp='0';op=null;prev=null;reset=false;}
      else if(v==='±'){disp=String(-parseFloat(disp));}
      else if(v==='%'){disp=String(parseFloat(disp)/100);}
      else if(['+','−','×','÷'].includes(v)){if(op&&!reset)disp=String(calc(prev,disp,op));prev=disp;op=v;reset=true;}
      else if(v==='='){if(op)disp=String(calc(prev,disp,op));op=null;prev=null;reset=true;}
      const d=body.querySelector('.calc-display');if(d)d.textContent=disp;
    });
    body.querySelector('#mcp-'+winId).onclick=()=>{mem=0;};
    body.querySelector('#mrp-'+winId).onclick=()=>{disp=String(mem);reset=true;};
    body.querySelector('#mp-'+winId).onclick=()=>{mem+=parseFloat(disp);};
    body.querySelector('#mm-'+winId).onclick=()=>{mem-=parseFloat(disp);};
  };
  render();
};
const renderSettings = (body, winId) => {
  const wallpapers = [
    {name:'Cosmos',grad:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'},
    {name:'Sunset',grad:'linear-gradient(135deg,#f093fb,#f5576c)'},
    {name:'Ocean',grad:'linear-gradient(135deg,#667eea,#764ba2)'},
    {name:'Forest',grad:'linear-gradient(135deg,#134e5e,#71b280)'},
    {name:'Lavender',grad:'linear-gradient(135deg,#a18cd1,#fbc2eb)'},
    {name:'Ember',grad:'linear-gradient(135deg,#f12711,#f5af19)'},
    {name:'Midnight',grad:'linear-gradient(135deg,#232526,#414345)'},
    {name:'Peach',grad:'linear-gradient(135deg,#ffecd2,#fcb69f)'}
  ];
  const accents = ['#a78bfa','#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899','#6b7280'];
  body.innerHTML='<div class="settings-app"><div class="settings-sidebar"><div class="settings-nav-item active" data-section="appearance">🎨 Appearance</div><div class="settings-nav-item" data-section="wallpaper">🖼 Wallpaper</div><div class="settings-nav-item" data-section="dock">📌 Dock</div><div class="settings-nav-item" data-section="about">ℹ️ About</div></div><div class="settings-content" id="sc-'+winId+'"></div></div>';
  const content=body.querySelector('#sc-'+winId);
  const sections={
    appearance:'<h2>Appearance</h2><div class="settings-group"><h3>Theme</h3><div class="settings-row"><label>Dark Mode</label><div class="toggle-switch '+(S.theme==='dark'?'on':'')+'" id="themeToggle"></div></div></div><div class="settings-group"><h3>Accent Color</h3><div class="accent-colors">'+accents.map(c=>'<div class="accent-color '+(S.accent===c?'active':'')+'" style="background:'+c+'" data-color="'+c+'"></div>').join('')+'</div></div>',
    wallpaper:'<h2>Wallpaper</h2><div class="wallpaper-grid">'+wallpapers.map((w,i)=>'<div class="wallpaper-option '+(i===0?'active':'')+'" style="background:'+w.grad+'" title="'+w.name+'" data-idx="'+i+'"></div>').join('')+'</div>',
    dock:'<h2>Dock</h2><div class="settings-group"><h3>Icon Size</h3><div class="settings-row"><label>Size: '+S.dockSize+'px</label><input type="range" class="settings-slider" id="dockSlider" min="28" max="64" value="'+S.dockSize+'"></div></div>',
    about:'<h2>About flowOS</h2><div style="text-align:center;padding:40px 0"><svg viewBox="0 0 80 80" width="80" height="80"><defs><linearGradient id="ag" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><rect rx="18" width="80" height="80" fill="url(#ag)"/><text x="40" y="54" text-anchor="middle" fill="white" font-size="36" font-weight="700">f</text></svg><h3 style="margin-top:16px;color:var(--text)">flowOS</h3><p style="color:var(--text-secondary);font-size:13px">Version 1.0.0</p><p style="color:var(--text-muted);font-size:12px;margin-top:8px">A web-based desktop environment</p></div>'
  };
  content.innerHTML=sections.appearance;
  body.querySelectorAll('.settings-nav-item').forEach(n=>n.onclick=()=>{
    body.querySelectorAll('.settings-nav-item').forEach(x=>x.classList.remove('active'));
    n.classList.add('active');
    content.innerHTML=sections[n.dataset.section];
    if(n.dataset.section==='appearance'){
      content.querySelector('#themeToggle').onclick=function(){S.theme=S.theme==='dark'?'light':'dark';applyTheme();persist();this.classList.toggle('on');};
      content.querySelectorAll('.accent-color').forEach(c=>c.onclick=()=>{S.accent=c.dataset.color;applyTheme();persist();content.querySelectorAll('.accent-color').forEach(x=>x.classList.remove('active'));c.classList.add('active');});
    }
    if(n.dataset.section==='wallpaper'){
      content.querySelectorAll('.wallpaper-option').forEach(opt=>opt.onclick=()=>{
        const idx=+opt.dataset.idx;
        S.wallpaper=wallpapers[idx].grad;
        document.getElementById('wallpaper').style.background=S.wallpaper;
        persist();
        content.querySelectorAll('.wallpaper-option').forEach(x=>x.classList.remove('active'));
        opt.classList.add('active');
      });
    }
    if(n.dataset.section==='dock'){
      const sl=content.querySelector('#dockSlider');
      if(sl)sl.oninput=()=>{S.dockSize=+sl.value;content.querySelector('label').textContent='Size: '+S.dockSize+'px';persist();updateDock();};
    }
  });
};
const renderCalendar = (body, winId) => {
  let now=new Date(),cm=now.getMonth(),cy=now.getFullYear();
  const render=()=>{
    const first=new Date(cy,cm,1).getDay(),days=new Date(cy,cm+1,0).getDate(),prev=new Date(cy,cm,0).days=days;
    const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    let cells='';
    const prevDays=new Date(cy,cm,0).getDate();
    for(let i=0;i<first;i++)cells+='<div class="calendar-day other-month"><span class="day-num">'+(prevDays-first+i+1)+'</span></div>';
    for(let d=1;d<=days;d++){
      const key=cy+'-'+(cm+1)+'-'+d;
      const isToday=d===now.getDate()&&cm===now.getMonth()&&cy===now.getFullYear();
      const evts=S.calEvents[key]||[];
      cells+='<div class="calendar-day '+(isToday?'today':'')+'" data-day="'+d+'"><span class="day-num">'+d+'</span>'+(evts.length?'<div class="event-dots"><div class="event-dot"></div></div>':'')+'</div>';
    }
    const total=first+days;const rem=total%7===0?0:7-total%7;
    for(let i=1;i<=rem;i++)cells+='<div class="calendar-day other-month"><span class="day-num">'+i+'</span></div>';
    const evts=S.calEvents[cy+'-'+(cm+1)+'-'+now.getDate()]||[];
    body.innerHTML='<div class="calendar-app"><div class="calendar-header"><button id="cpm-'+winId+'">◀</button><h3>'+months[cm]+' '+cy+'</h3><button id="cnm-'+winId+'">▶</button></div><div class="calendar-weekdays"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div><div class="calendar-grid">'+cells+'</div><div class="calendar-events" id="cev-'+winId+'">'+evts.map(e=>'<div class="calendar-event">'+e+'</div>').join('')+'</div></div>';
    body.querySelector('#cpm-'+winId).onclick=()=>{cm--;if(cm<0){cm=11;cy--;}render();};
    body.querySelector('#cnm-'+winId).onclick=()=>{cm++;if(cm>11){cm=0;cy++;}render();};
    body.querySelectorAll('.calendar-day:not(.other-month)').forEach(d=>d.onclick=()=>{
      const day=d.dataset.day;if(!day)return;
      const key=cy+'-'+(cm+1)+'-'+day;
      const title=prompt('Add event for '+months[cm]+' '+day+':');
      if(title){if(!S.calEvents[key])S.calEvents[key]=[];S.calEvents[key].push(title);persist();render();}
    });
  };render();
};
/* === LAYER 6: SPOTLIGHT === */
const toggleSpotlight = () => {
  const ov = _q('#spotlight-overlay');
  S.spotlightOpen = !S.spotlightOpen;
  if(S.spotlightOpen) {
    ov.classList.remove('hidden');
    const inp = _q('#spotlight-input');
    inp.value = '';
    inp.focus();
    renderSpotlightResults('');
  } else {
    ov.classList.add('hidden');
  }
};
const renderSpotlightResults = (q) => {
  const results = _q('#spotlight-results');
  const apps = APP_REGISTRY.filter(a => a.name.toLowerCase().includes(q.toLowerCase()));
  const files = [];
  Object.keys(FS).forEach(k => { if(FS[k].type === 'file' && k.toLowerCase().includes(q.toLowerCase())) files.push(k); });
  let html = '';
  if(apps.length) {
    html += '<div class="spotlight-section">Applications</div>';
    apps.forEach(a => { html += '<div class="spotlight-result" data-type="app" data-id="'+a.id+'">'+a.icon+'<div class="result-text"><div class="result-name">'+a.name+'</div><div class="result-desc">Application</div></div></div>'; });
  }
  if(files.length) {
    html += '<div class="spotlight-section">Files</div>';
    files.slice(0,5).forEach(f => { html += '<div class="spotlight-result" data-type="file" data-path="'+f+'">'+ICONS.file+'<div class="result-text"><div class="result-name">'+f.split('/').pop()+'</div><div class="result-desc">'+f+'</div></div></div>'; });
  }
  if(!html) html = '<div class="spotlight-section" style="padding:16px;text-align:center;color:var(--text-muted)">No results found</div>';
  results.innerHTML = html;
  results.querySelectorAll('.spotlight-result').forEach(r => r.onclick = () => {
    if(r.dataset.type === 'app') createWindow(r.dataset.id);
    toggleSpotlight();
  });
};
_q('#spotlight-input').addEventListener('input', (e) => renderSpotlightResults(e.target.value));
_q('#spotlight-overlay').addEventListener('click', (e) => { if(e.target === _q('#spotlight-overlay')) toggleSpotlight(); });

/* === LAYER 6: MISSION CONTROL === */
const toggleMissionControl = () => {
  const mc = _q('#mission-control');
  S.mcOpen = !S.mcOpen;
  if(S.mcOpen) {
    mc.classList.remove('hidden');
    mc.innerHTML = '';
    if(S.windows.length === 0) {
      mc.innerHTML = '<div style="color:rgba(255,255,255,0.5);font-size:18px">No open windows</div>';
    } else {
      S.windows.forEach(w => {
        const app = APP_REGISTRY.find(a => a.id === w.appId);
        const mw = CE('div', 'mc-window');
        mw.innerHTML = '<div class="mc-title">'+(app?.icon||'')+' '+(app?.name||w.appId)+'</div><div class="mc-preview">'+(w.minimized?'Minimized':app?.name||'')+'</div>';
        mw.onclick = () => { toggleMissionControl(); if(S.minimizedWindows.has(w.id)) restoreWindow(w.id); else focusWindow(w.id); };
        mc.appendChild(mw);
      });
    }
  } else {
    mc.classList.add('hidden');
  }
};
_q('#mission-control').addEventListener('click', (e) => { if(e.target === _q('#mission-control')) toggleMissionControl(); });
/* === LAYER 6: CONTEXT MENU & NOTIFICATIONS === */
const showContextMenu = (x, y) => {
  const cm = _q('#context-menu');
  cm.classList.remove('hidden');
  cm.style.left = x + 'px';
  cm.style.top = y + 'px';
};
const hideContextMenu = () => { _q('#context-menu').classList.add('hidden'); };
_q('#context-menu').addEventListener('click', (e) => {
  const item = e.target.closest('.ctx-item');
  if(!item) return;
  const action = item.dataset.action;
  hideContextMenu();
  if(action === 'new-folder') notify('New Folder', 'Folder created on Desktop');
  if(action === 'change-wallpaper') createWindow('settings');
  if(action === 'toggle-theme') { S.theme = S.theme === 'dark' ? 'light' : 'dark'; applyTheme(); persist(); }
  if(action === 'sort-name') notify('Sorted', 'Desktop icons sorted by name');
});
const notify = (title, body) => {
  const c = _q('#notification-container');
  const n = CE('div', 'notification');
  n.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><div class="notif-content"><div class="notif-title">'+title+'</div><div class="notif-body">'+body+'</div></div><div class="notif-time">now</div>';
  n.onclick = () => { n.classList.add('removing'); setTimeout(() => n.remove(), 300); };
  c.appendChild(n);
  setTimeout(() => { if(n.parentNode) { n.classList.add('removing'); setTimeout(() => n.remove(), 300); } }, 5000);
};
document.addEventListener('click', (e) => {
  hideContextMenu();
  _qa('.dock-context').forEach(c => c.remove());
  if(!e.target.closest('.menu-item') && !e.target.closest('.menu-dropdown')) closeAllMenus();
});
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if(e.target.closest('.app-window') || e.target.closest('#menu-bar') || e.target.closest('#dock')) return;
  showContextMenu(e.clientX, e.clientY);
});
_q('#btn-search').addEventListener('click', toggleSpotlight);

/* === LAYER 6: APP SWITCHER === */
let appSwitcherOpen = false, appSwitcherIdx = 0;
const toggleAppSwitcher = () => {
  appSwitcherOpen = !appSwitcherOpen;
  if(appSwitcherOpen && S.windows.length > 0) {
    const visible = S.windows.filter(w => !S.minimizedWindows.has(w.id));
    if(!visible.length) { appSwitcherOpen = false; return; }
    appSwitcherIdx = 0;
    renderAppSwitcher(visible);
  } else {
    closeAppSwitcher();
  }
};
const renderAppSwitcher = (wins) => {
  let el = _q('#app-switcher');
  if(!el) { el = CE('div', ''); el.id = 'app-switcher'; document.body.appendChild(el); }
  el.style.cssText = 'position:fixed;inset:0;z-index:9700;background:rgba(0,0,0,0.5);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;gap:12px;padding:40px;animation:mcOpen 0.15s ease';
  el.innerHTML = '';
  wins.forEach((w, i) => {
    const app = APP_REGISTRY.find(a => a.id === w.appId);
    const card = CE('div', '');
    const isActive = i === appSwitcherIdx;
    card.style.cssText = 'background:var(--window-bg);border:2px solid '+(isActive?'var(--accent)':'transparent')+';border-radius:12px;padding:16px 24px;cursor:pointer;transition:all 0.15s;min-width:120px;text-align:center;'+(isActive?'transform:scale(1.1);':'')
    card.innerHTML = '<div style="margin-bottom:8px">'+app?.icon+'</div><div style="color:var(--text);font-size:13px;font-weight:500">'+(app?.name||w.appId)+'</div>';
    card.onclick = () => { closeAppSwitcher(); if(S.minimizedWindows.has(w.id)) restoreWindow(w.id); else focusWindow(w.id); };
    el.appendChild(card);
  });
};
const closeAppSwitcher = () => { appSwitcherOpen = false; const el = _q('#app-switcher'); if(el) el.remove(); };

/* === LAYER 6: KEYBOARD SHORTCUTS === */
let modKeyHeld = false;
document.addEventListener('keydown', (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if(mod && e.key === ' ') { e.preventDefault(); toggleSpotlight(); }
  if(mod && e.key === 'Tab') {
    e.preventDefault();
    if(!appSwitcherOpen) { modKeyHeld = true; toggleAppSwitcher(); }
    else { const visible = S.windows.filter(w => !S.minimizedWindows.has(w.id)); appSwitcherIdx = (appSwitcherIdx + (e.shiftKey?-1:1) + visible.length) % visible.length; renderAppSwitcher(visible); }
  }
  if(mod && e.key === 'w') { e.preventDefault(); if(S.focusedId) closeWindow(S.focusedId); }
  if(mod && e.key === 'm') { e.preventDefault(); if(S.focusedId) minimizeWindow(S.focusedId); }
  if(e.key === 'Escape') {
    if(S.spotlightOpen) toggleSpotlight();
    if(S.mcOpen) toggleMissionControl();
    if(appSwitcherOpen) closeAppSwitcher();
    hideContextMenu(); closeAllMenus();
  }
});
document.addEventListener('keyup', (e) => {
  if((e.metaKey || e.ctrlKey) && appSwitcherOpen) {
    const visible = S.windows.filter(w => !S.minimizedWindows.has(w.id));
    if(visible[appSwitcherIdx]) { const w = visible[appSwitcherIdx]; closeAppSwitcher(); if(S.minimizedWindows.has(w.id)) restoreWindow(w.id); else focusWindow(w.id); }
  }
});

/* === LAYER 1: DESKTOP ICONS === */
const renderDesktopIcons = () => {
  const di = _q('#desktop-icons');
  di.innerHTML = '';
  const icons = [
    { name: 'Home', icon: ICONS.folder, action: () => createWindow('files') },
    { name: 'Terminal', icon: ICONS.terminal, action: () => createWindow('terminal') },
    { name: 'Notes', icon: ICONS.notes, action: () => createWindow('notes') }
  ];
  icons.forEach(ic => {
    const el = CE('div', 'desktop-icon');
    el.innerHTML = ic.icon + '<span>' + ic.name + '</span>';
    el.addEventListener('click', (e) => {
      _qa('.desktop-icon').forEach(i => i.classList.remove('selected'));
      el.classList.add('selected');
      e.stopPropagation();
    });
    el.addEventListener('dblclick', ic.action);
    di.appendChild(el);
  });
  di.addEventListener('click', () => _qa('.desktop-icon').forEach(i => i.classList.remove('selected')));
};

/* === LAYER 6: DRAG-AND-DROP FILES === */
let dragFileData = null;
const initDragDrop = () => {
  _q('#desktop').addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
  _q('#desktop').addEventListener('drop', (e) => {
    e.preventDefault();
    if(dragFileData) {
      const name = dragFileData.name;
      if(!FS['/Desktop'].children.includes(name)) {
        FS['/Desktop'].children.push(name);
        FS['/Desktop/'+name] = { ...dragFileData };
        notify('File Moved', name+' moved to Desktop');
        renderDesktopIcons();
      }
      dragFileData = null;
    }
  });
};
const makeDraggable = (el, fileData) => {
  el.draggable = true;
  el.addEventListener('dragstart', (e) => {
    dragFileData = fileData;
    e.dataTransfer.effectAllowed = 'move';
    el.style.opacity = '0.5';
  });
  el.addEventListener('dragend', () => { el.style.opacity = '1'; dragFileData = null; });
};

/* === LAYER 8: INIT === */
const initDesktop = () => {
  applyTheme();
  renderDock();
  updateClock();
  setInterval(updateClock, 10000);
  updateMenuBar('flowOS');
  renderDesktopIcons();
  if(S.wallpaper) document.getElementById('wallpaper').style.background = S.wallpaper;
  initDragDrop();
  notify('Welcome to flowOS', 'Your desktop is ready. Right-click for options.');
};
boot();
