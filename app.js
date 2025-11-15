// Spelling app main script
const el = id => document.getElementById(id)

const startBtn = el('startBtn')
const wordListEl = el('wordList')
const shuffleEl = el('shuffle')
const setupSection = el('setup')
const testSection = el('test')
const resultsSection = el('results')
const speakBtn = el('speakBtn')
const wordPlaceholder = el('wordPlaceholder')
const answerInput = el('answerInput')
const checkBtn = el('checkBtn')
const nextBtn = el('nextBtn')
const progressEl = el('progress')
const scoreEl = el('score')
const feedbackEl = el('feedback')
const resultsSummary = el('resultsSummary')
const retryBtn = el('retryBtn')
const editBtn = el('editBtn')
const showAnswerBtn = el('showAnswerBtn')
const helpBtn = el('helpBtn')
const helpTiles = el('helpTiles')
const themeMarvel = el('themeMarvel')
const themeNature = el('themeNature')
const themeSpace = el('themeSpace')

let words = []
let order = []
let current = 0
let score = 0
let answers = []
let revealTimeout = null
let helpVisible = false

function parseWords(){
  const raw = wordListEl.value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean)
  return raw
}

function speak(text){
  if(!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = 0.95
  window.speechSynthesis.speak(u)
}

function startTest(){
  words = parseWords()
  if(words.length===0) { alert('Please enter at least one word'); return }
  order = words.map((_,i) => i)
  if(shuffleEl.checked){
    for(let i=order.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1))
      ;[order[i],order[j]]=[order[j],order[i]]
    }
  }
  current = 0
  score = 0
  answers = []
  setupSection.classList.add('hidden')
  resultsSection.classList.add('hidden')
  testSection.classList.remove('hidden')
  updateUI()
  speakCurrent()
  answerInput.focus()
}

function updateUI(){
  progressEl.textContent = `Word ${current+1} / ${order.length}`
  scoreEl.textContent = `Score: ${score}`
  feedbackEl.textContent = ''
  answerInput.value = ''
  // hide help tiles when moving to a new word
  if(helpTiles) { helpTiles.innerHTML = ''; helpVisible = false }
}

function speakCurrent(){
  const idx = order[current]
  const w = words[idx]
  speak(w)
}

function checkAnswer(){
  const user = answerInput.value.trim()
  const idx = order[current]
  const correct = words[idx]
  const ok = user.toLowerCase() === correct.toLowerCase()
  if(ok){
    feedbackEl.textContent = 'Correct ✅'
    score++
  } else {
    // Do not reveal the correct spelling here. Offer the ability to reveal temporarily.
    feedbackEl.textContent = 'Incorrect ❌ — press "Show Answer" to reveal'
  }
  answers.push({word:correct, given:user, correct:ok})
  scoreEl.textContent = `Score: ${score}`
}

function next(){
  if(answerInput.value.trim() === ''){
    // allow proceeding but prompt user
    if(!confirm('You have not entered an answer. Continue?')) return
  }
  // if user hasn't checked yet, check automatically
  if(answers.length === current) checkAnswer()
  current++
  if(current >= order.length){
    finish()
    return
  }
  updateUI()
  speakCurrent()
  answerInput.focus()
}

function finish(){
  testSection.classList.add('hidden')
  resultsSection.classList.remove('hidden')
  renderResults()
}

function showAnswer(){
  // reveal the correct answer for 3 seconds without recording it
  if(!order || current >= order.length) return
  const idx = order[current]
  const correct = words[idx]
  // clear any existing timeout
  if(revealTimeout) { clearTimeout(revealTimeout); revealTimeout = null }
  const previous = feedbackEl.innerHTML
  feedbackEl.innerHTML = `<span class="reveal">Answer: ${escapeHtml(correct)}</span>`
  revealTimeout = setTimeout(()=>{
    feedbackEl.innerHTML = previous
    revealTimeout = null
  }, 3000)
}

function shuffleArray(a){
  // Fisher-Yates
  const arr = a.slice()
  for(let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function showHelp(){
  if(!order || current >= order.length) return
  const idx = order[current]
  const correct = words[idx] || ''
  // build letters including duplicates
  const letters = correct.split('')
  if(letters.length === 0) return
  const shuffled = shuffleArray(letters).map(l => escapeHtml(l.toUpperCase()))
  // render tiles
  if(!helpTiles) return
  helpTiles.innerHTML = ''
  for(const ch of shuffled){
    const span = document.createElement('span')
    span.className = 'tile'
    span.textContent = ch
    helpTiles.appendChild(span)
  }
  helpVisible = true
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(m){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]
  })
}

function renderResults(){
  let html = `<p><strong>Score:</strong> ${score} / ${order.length}</p>`
  html += '<ol>'
  for(const a of answers){
    html += `<li><strong>${a.word}</strong> — your answer: ${a.given || '<em>(none)</em>'} ${a.correct ? '✅' : '❌'}</li>`
  }
  html += '</ol>'
  resultsSummary.innerHTML = html
}

function retry(){
  // restart using same list and shuffle option
  startTest()
}

function editList(){
  resultsSection.classList.add('hidden')
  testSection.classList.add('hidden')
  setupSection.classList.remove('hidden')
}

// Event bindings
startBtn.addEventListener('click', startTest)
speakBtn.addEventListener('click', ()=>{ speakCurrent() })
checkBtn.addEventListener('click', ()=>{ if(answers.length === current) { checkAnswer() } else { checkAnswer() } })
nextBtn.addEventListener('click', next)
retryBtn.addEventListener('click', retry)
editBtn.addEventListener('click', editList)
if(showAnswerBtn) showAnswerBtn.addEventListener('click', showAnswer)
if(helpBtn) helpBtn.addEventListener('click', ()=>{
  // toggle help display
  if(helpVisible){ helpTiles.innerHTML = ''; helpVisible = false } else { showHelp() }
})

function setTheme(name){
  // remove any theme classes
  document.body.classList.remove('theme-marvel','theme-nature','theme-space')
  if(name === 'marvel') document.body.classList.add('theme-marvel')
  if(name === 'nature') document.body.classList.add('theme-nature')
  if(name === 'space') document.body.classList.add('theme-space')
  try{ localStorage.setItem('spelling.theme', name) }catch(e){}
  // update active state on buttons
  if(themeMarvel) themeMarvel.classList.toggle('active', name === 'marvel')
  if(themeNature) themeNature.classList.toggle('active', name === 'nature')
  if(themeSpace) themeSpace.classList.toggle('active', name === 'space')
}

if(themeMarvel) themeMarvel.addEventListener('click', ()=> setTheme('marvel'))
if(themeNature) themeNature.addEventListener('click', ()=> setTheme('nature'))
if(themeSpace) themeSpace.addEventListener('click', ()=> setTheme('space'))

// initialize theme from storage or default
try{
  const saved = localStorage.getItem('spelling.theme')
  if(saved) setTheme(saved)
}catch(e){/* ignore */}

// Enter key submits check
answerInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault()
    checkAnswer()
  }
})

// Small safety: stop speaking when user navigates away
window.addEventListener('beforeunload', ()=>{ if('speechSynthesis' in window) window.speechSynthesis.cancel() })
