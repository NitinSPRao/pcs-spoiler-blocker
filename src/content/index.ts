const STORAGE_KEY_PREFIX = 'revealed-'
const HIDE_CLASS = 'pcs-sb-results-today'
const RESULTS_HEADING_TEXTS = ['Results today']

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
    .${HIDE_CLASS} { display: none !important; }
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
  const uls = findResultsUls()
  if (uls.length === 0) return

  injectBannerStyle()
  const key = storageKey()

  chrome.storage.local.get(key, (items) => {
    const alreadyRevealed = items[key] === true
    for (const ul of uls) {
      ul.classList.add(HIDE_CLASS)
      const banner = createBanner(ul)
      ul.insertAdjacentElement('beforebegin', banner)
      if (alreadyRevealed) {
        reveal(ul, banner)
      }
    }
  })
}

if (isHomepage()) {
  injectPreHideStyle()
  document.addEventListener('DOMContentLoaded', applyBlock)
}
