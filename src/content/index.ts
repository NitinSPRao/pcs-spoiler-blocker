const STORAGE_KEY_PREFIX = 'revealed-'
const HIDE_CLASS = 'pcs-sb-results-today'
const RESULTS_HEADING_TEXT = 'Results today'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function storageKey(): string {
  return `${STORAGE_KEY_PREFIX}${todayISO()}`
}

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
    .${HIDE_CLASS} { visibility: hidden !important; }
  `
  document.documentElement.appendChild(style)
}

function injectBannerStyle(): void {
  const style = document.createElement('style')
  style.textContent = `
    .pcs-sb-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #333;
    }
    .pcs-sb-reveal-btn {
      padding: 4px 12px;
      background: #1a6eb5;
      color: #fff;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    }
    .pcs-sb-reveal-btn:hover { background: #155a96; }
  `
  document.head.appendChild(style)
}

function findResultsTodayUl(): Element | null {
  const headings = document.querySelectorAll('h3.black-info-title')
  for (const h3 of headings) {
    if (h3.textContent?.trim() === RESULTS_HEADING_TEXT) {
      const sibling = h3.nextElementSibling
      if (sibling?.classList.contains('hp2-results')) {
        return sibling
      }
    }
  }
  return null
}

function createBanner(resultsUl: Element): HTMLElement {
  const banner = document.createElement('div')
  banner.className = 'pcs-sb-banner'
  banner.innerHTML = `
    <span>Today's race results are hidden.</span>
    <button class="pcs-sb-reveal-btn">Reveal Spoilers</button>
  `

  const btn = banner.querySelector('.pcs-sb-reveal-btn')!
  btn.addEventListener('click', () => {
    reveal(resultsUl, banner)
    chrome.storage.local.set({ [storageKey()]: true })
  })

  return banner
}

function reveal(resultsUl: Element, banner: Element): void {
  resultsUl.classList.remove(HIDE_CLASS)
  banner.remove()
}

function applyBlock(): void {
  const resultsUl = findResultsTodayUl()
  if (!resultsUl) return

  injectBannerStyle()
  resultsUl.classList.add(HIDE_CLASS)

  const banner = createBanner(resultsUl)
  resultsUl.insertAdjacentElement('beforebegin', banner)

  chrome.storage.local.get(storageKey(), (items) => {
    if (items[storageKey()] === true) {
      reveal(resultsUl, banner)
    }
  })
}

if (isHomepage()) {
  injectPreHideStyle()
  document.addEventListener('DOMContentLoaded', applyBlock)
}
