import { applyThemeFromStorage, listenForThemeToggle } from './theme'

applyThemeFromStorage()
listenForThemeToggle()

const RESULTS_HEADING_TEXTS = ['Results today']
const SECTION_HIDE_CLASS = 'pcs-sb-section-hidden'
const CONTENT_HIDE_CLASS = 'pcs-sb-race-content'

function isHomepage(): boolean {
  const { hostname, pathname } = window.location
  return (
    hostname === 'www.procyclingstats.com' &&
    (pathname === '/' || pathname === '' || pathname === '/index.php')
  )
}

function todayKey(): string {
  return `pcs-revealed-${new Date().toISOString().slice(0, 10)}`
}

async function getRevealedRaces(): Promise<Record<string, boolean>> {
  const key = todayKey()
  const result = await chrome.storage.local.get(key)
  return (result[key] as Record<string, boolean>) ?? {}
}

async function saveRevealedRace(raceKey: string): Promise<void> {
  const key = todayKey()
  const current = await getRevealedRaces()
  current[raceKey] = true
  await chrome.storage.local.set({ [key]: current })
}

function getRaceKey(li: Element): string {
  const btn = li.querySelector('a.goto-race') as HTMLAnchorElement | null
  if (btn?.href) {
    try {
      const path = new URL(btn.href).pathname
      return path.replace(/\/(result|gc|startlist|livestats)\/?$/, '')
    } catch { /* ignore */ }
  }
  const firstLink = li.querySelector('a') as HTMLAnchorElement | null
  return firstLink?.textContent?.trim().slice(0, 60) ?? 'unknown'
}

function getRaceName(li: Element): string {
  const link = [...li.querySelectorAll<HTMLAnchorElement>('a')]
    .find(a => !a.classList.contains('goto-race') && (a.textContent?.trim() ?? '') !== '')
  return link?.textContent?.trim() || 'Race result'
}

function injectPreHideStyle(): void {
  const style = document.createElement('style')
  style.textContent = `
    .${SECTION_HIDE_CLASS} { display: none !important; }
    .${CONTENT_HIDE_CLASS} { display: none !important; }
  `
  document.documentElement.appendChild(style)
}

function injectOverlayStyle(): void {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&display=swap'
  document.head.appendChild(link)

  const style = document.createElement('style')
  style.textContent = `
    .pcs-sb-race-overlay {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #252d3a;
      border-left: 3px solid #e8b400;
    }
    .pcs-sb-race-icon {
      color: #e8b400;
      width: 18px;
      height: 18px;
      opacity: 0.75;
      flex-shrink: 0;
    }
    .pcs-sb-race-name {
      flex: 1;
      color: #8896a8;
      font-family: 'Barlow Condensed', Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pcs-sb-race-btn {
      padding: 4px 14px;
      background: transparent;
      color: #e8b400;
      border: 1px solid #3a4556;
      border-radius: 2px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: 'Barlow Condensed', Arial, sans-serif;
      flex-shrink: 0;
      transition: border-color 0.1s, background 0.1s;
    }
    .pcs-sb-race-btn:hover {
      border-color: #e8b400;
      background: #1a2030;
    }
  `
  document.head.appendChild(style)
}

function findResultsUls(): Element[] {
  const results: Element[] = []
  for (const bar of document.querySelectorAll('div.h4bar')) {
    const h4 = bar.querySelector('h4')
    if (!h4 || !RESULTS_HEADING_TEXTS.includes(h4.textContent?.trim() ?? '')) continue
    let next = bar.nextElementSibling
    while (next && !next.classList.contains('h4bar')) {
      if (next.classList.contains('hp2-results') && next.querySelector('li.race')) {
        results.push(next)
      }
      next = next.nextElementSibling
    }
  }
  return results
}

function blockRace(li: Element, raceName: string, raceKey: string): void {
  const wrapper = document.createElement('div')
  wrapper.className = CONTENT_HIDE_CLASS
  while (li.firstChild) wrapper.appendChild(li.firstChild)
  li.appendChild(wrapper)

  const overlay = document.createElement('div')
  overlay.className = 'pcs-sb-race-overlay'
  overlay.innerHTML = `
    <svg class="pcs-sb-race-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
    <span class="pcs-sb-race-name"></span>
    <button class="pcs-sb-race-btn">Reveal</button>
  `
  overlay.querySelector('.pcs-sb-race-name')!.textContent = raceName
  li.insertBefore(overlay, wrapper)

  overlay.querySelector('.pcs-sb-race-btn')!.addEventListener('click', () => {
    overlay.remove()
    wrapper.classList.remove(CONTENT_HIDE_CLASS)
    void saveRevealedRace(raceKey)
  })
}

async function applyBlock(): Promise<void> {
  const uls = findResultsUls()
  if (uls.length === 0) return

  injectOverlayStyle()

  for (const ul of uls) ul.classList.add(SECTION_HIDE_CLASS)

  const revealed = await getRevealedRaces()

  for (const ul of uls) {
    for (const li of ul.querySelectorAll('li.race')) {
      const key = getRaceKey(li)
      if (revealed[key]) continue
      blockRace(li, getRaceName(li), key)
    }
    ul.classList.remove(SECTION_HIDE_CLASS)
  }
}

if (isHomepage()) {
  injectPreHideStyle()
  document.addEventListener('DOMContentLoaded', () => { void applyBlock() })
}
