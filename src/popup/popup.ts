const THEME_KEY = 'pcs-theme-enabled'

const toggle = document.getElementById('theme-toggle') as HTMLInputElement

chrome.storage.local.get(THEME_KEY, (items) => {
  toggle.checked = items[THEME_KEY] === true
})

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ [THEME_KEY]: toggle.checked })
})
