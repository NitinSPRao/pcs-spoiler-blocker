import { applyThemeFromStorage, listenForThemeToggle } from './theme'

applyThemeFromStorage()
listenForThemeToggle()

const HIDE_CLASS = 'pcs-sb-results-today'
// TODO: revert to ['Results today'] before shipping
const RESULTS_HEADING_TEXTS = ['Results today', 'Results yesterday']

function isHomepage(): boolean {
  const { hostname, pathname } = window.location
  return (
    hostname === 'www.procyclingstats.com' &&
    (pathname === '/' || pathname === '')
  )
}

function injectPreHideStyle(): void {
  const style = document.createElement('style')
  style.textContent = `
    .${HIDE_CLASS} { display: none !important; }
  `
  document.documentElement.appendChild(style)
}

function injectBannerStyle(): void {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap'
  document.head.appendChild(link)

  const style = document.createElement('style')
  style.textContent = `
    .pcs-sb-banner {
      position: relative;
      width: 100%;
      background: #252d3a;
      overflow: hidden;
      padding: 32px 24px 28px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      margin: 2px 0 8px;
      border-top: 3px solid #e8b400;
    }
    .pcs-sb-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        -55deg,
        transparent,
        transparent 14px,
        rgba(255,255,255,0.025) 14px,
        rgba(255,255,255,0.025) 28px
      );
      pointer-events: none;
    }
    .pcs-sb-icon {
      color: #e8b400;
      width: 32px;
      height: 32px;
      position: relative;
      z-index: 1;
      margin-bottom: 6px;
      opacity: 0.85;
    }
    .pcs-sb-heading {
      color: #fff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin: 0;
      position: relative;
      z-index: 1;
      font-family: 'Barlow Condensed', Arial, sans-serif;
      line-height: 1;
    }
    .pcs-sb-subtext {
      color: rgba(255,255,255,0.38);
      font-size: 11px;
      margin: 0;
      position: relative;
      z-index: 1;
      font-family: 'Barlow Condensed', Arial, sans-serif;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .pcs-sb-reveal-btn {
      margin-top: 14px;
      padding: 8px 24px;
      background: #e8b400;
      color: #111;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      position: relative;
      z-index: 1;
      font-family: 'Barlow Condensed', Arial, sans-serif;
      transition: background 0.12s, transform 0.1s;
    }
    .pcs-sb-reveal-btn:hover {
      background: #ffc700;
      transform: translateY(-1px);
    }
    .pcs-sb-reveal-btn:active { transform: translateY(0); }
  `
  document.head.appendChild(style)
}

function findNextResultsUl(bar: Element): Element | null {
  let next = bar.nextElementSibling
  while (next && !next.classList.contains('h4bar')) {
    if (next.classList.contains('hp2-results') && next.querySelector('li.race')) {
      return next
    }
    next = next.nextElementSibling
  }
  return null
}

function findResultsUls(): Element[] {
  const results: Element[] = []
  const bars = document.querySelectorAll('div.h4bar')
  for (const bar of bars) {
    const h4 = bar.querySelector('h4')
    if (h4 && RESULTS_HEADING_TEXTS.includes(h4.textContent?.trim() ?? '')) {
      const ul = findNextResultsUl(bar)
      if (ul) results.push(ul)
    }
  }
  return results
}

function createBanner(resultsUl: Element): HTMLElement {
  const banner = document.createElement('div')
  banner.className = 'pcs-sb-banner'
  banner.innerHTML = `
    <svg class="pcs-sb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
    <span class="pcs-sb-heading">Results Hidden</span>
    <span class="pcs-sb-subtext">Click to reveal today's race results</span>
    <button class="pcs-sb-reveal-btn">Reveal Spoilers</button>
  `

  const btn = banner.querySelector('.pcs-sb-reveal-btn')!
  // TODO: restore persistence before shipping
  btn.addEventListener('click', () => {
    reveal(resultsUl, banner)
  })

  return banner
}

function reveal(resultsUl: Element, banner: Element): void {
  resultsUl.classList.remove(HIDE_CLASS)
  banner.remove()
}

function applyBlock(): void {
  const uls = findResultsUls()
  if (uls.length === 0) return

  injectBannerStyle()
  // TODO: restore persistence before shipping
  for (const ul of uls) {
    ul.classList.add(HIDE_CLASS)
    const banner = createBanner(ul)
    ul.insertAdjacentElement('beforebegin', banner)
  }
}

if (isHomepage()) {
  injectPreHideStyle()
  document.addEventListener('DOMContentLoaded', applyBlock)
}
