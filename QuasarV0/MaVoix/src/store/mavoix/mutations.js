export const updateTabs = (state, tabs) => {
  state.tabs.length = 0
  state.tabs = state.tabs.concat(tabs)
}

export const updatePhrase = (state, phrase) => {
  state.phrase.length = 0
  state.phrase = state.phrase.concat(phrase)
}

export const updateSelectedTab = (state, value) => {
  state.selectedTab = value
}

export const updateTabColor = (state, { tabIndex, tabColor }) => {
  console.log('mutations. tabIndex:', tabIndex, ', tabColor:', tabColor)
  state.tabs[tabIndex].tabColor = tabColor
}

export const updateVoices = (state, voices) => {
  state.voices = state.voices.concat(voices)
}

export const updateSelectedVoice = (state, voice) => {
  state.selectedVoice = voice
}
