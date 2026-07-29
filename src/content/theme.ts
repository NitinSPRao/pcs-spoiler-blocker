import { DARK_THEME_CSS } from '../themes/dark'

const THEME_STYLE_ID = 'pcs-sb-theme'
const STORAGE_KEY = 'pcs-theme-enabled'

export function injectTheme(): void {
  if (document.getElementById(THEME_STYLE_ID)) return
  const el = document.createElement('style')
  el.id = THEME_STYLE_ID
  el.textContent = DARK_THEME_CSS
  document.documentElement.appendChild(el)
}

export function removeTheme(): void {
  document.getElementById(THEME_STYLE_ID)?.remove()
}

export function applyThemeFromStorage(): void {
  chrome.storage.local.get(STORAGE_KEY, (items) => {
    if (items[STORAGE_KEY] === true) injectTheme()
  })
}

export function listenForThemeToggle(): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !(STORAGE_KEY in changes)) return
    if (changes[STORAGE_KEY].newValue === true) {
      injectTheme()
    } else {
      removeTheme()
    }
  })
}
