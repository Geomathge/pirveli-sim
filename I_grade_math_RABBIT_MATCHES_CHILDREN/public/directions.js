const lessons = [
  {
    title: "მარჯვნივ, მარცხნივ, შორის",
    short: "მარჯვნივ და მარცხნივ",
    explain: "შენი მარჯვენა მხარე პერსონაჟის მარჯვენა მხარეს ემთხვევა, როცა ის ზურგით დგას.",
    tip: "ჯერ ვიპოვოთ მარჯვენა და მარცხენა ჩვენს სხეულზე, შემდეგ — საგნებთან მიმართებით.",
    task: "ააწევინე ხელი, ამოძრავე და დააყენე ობიექტის მიმართ.",
    answer: "right",
    zones: ["მარცხნივ", "შორის", "მარჯვნივ"],
    mode: "horizontal"
  },
  {
    title: "ზევით, ქვევით",
    short: "ზევით და ქვევით",
    explain: "კიბეზე ერთი საფეხურით ზევით ავდივართ ან ერთი საფეხურით ქვევით ჩამოვდივართ.",
    tip: "↑ ზევით ასვლაა. ↓ ქვევით ჩამოსვლაა. თითო დაჭერა მხოლოდ ერთი საფეხურია.",
    task: "გადადგი ზუსტად ერთი საფეხური.",
    answer: "above",
    zones: ["ზევით", "შუაში", "ქვევით"],
    mode: "vertical"
  },
  {title:"შედარება",short:"შედარება",mode:"comparison",embedded:true}
];

const quiz = [
 {q:"ნინო ლუკას მარჯვნივ დგას. სად დგას ლუკა ნინოს მიმართ?",a:0,o:["მარცხნივ","მარჯვნივ","შორის"]},
 {q:"ბურთი მაგიდის ზედა თაროზე დევს. სადაა ბურთი ქვედა თაროს მიმართ?",a:1,o:["ქვევით","ზევით","იმავე სიმაღლეზე"]},
 {q:"თითო ბურთს თითო ვაშლი შევუწყვილეთ. არც ბურთი დარჩა და არც ვაშლი. რას ვიტყვით?",a:2,o:["ბურთი მეტია","ვაშლი მეტია","იმდენივეა"]},
 {q:"ერთ ჯგუფში 4 ბურთია, მეორეში — 3. რომელ ჯგუფშია მეტი?",a:0,o:["პირველ ჯგუფში","მეორე ჯგუფში","ორივეში იმდენივეა"]}
];

let currentLesson = 0;
let currentStage = "learn";
let scores = Array(lessons.length).fill(0);
let soundOn = true;
let quizIndex = 0;
let quizAnswers = Array(quiz.length).fill(null);
let handStep = 0;
let moveStep = 0;
let faceMode = "ready";
let selectedCharacter = "girl";
let raisedHands = new Set();
let movedDirections = new Set();
let relationRound = 0;
let relationScore = 0;
let relationChallenge = null;
let gaitStep = 0;
let walkPosition = 0;
let stairLevel = 0;
let stairGait = 0;
let stairGaitByDirection = { up: 0, down: 0 };
let upStairLevel = 0;
let downStairLevel = 4;
let verticalActor = "children";
let verticalLearnCharacter = "girl";
let verticalPracticeDirection = "up";
let verticalPracticeRound = 0;
let verticalPracticeScore = 0;
let verticalPracticeMoves = { up: 0, down: 0 };
let verticalCheckRound = 0;
let verticalCheckScore = 0;

const motionAssetVersion = "20260910-1";
const motionAssetUrls = [
  "assets/book/book-girl-step-up-a.png",
  "assets/book/book-girl-step-up-b.png",
  "assets/book/book-boy-step-down-a.png",
  "assets/book/book-boy-step-down-b.png",
  "assets/objects/rabbit-hop.png",
  "assets/objects/rabbit-land.png"
].map(path => `${path}?v=${motionAssetVersion}`);

const criticalCharacterUrls = [
  "assets/characters/face-pair-ready.png",
  "assets/characters/face-pair-right-hands-up.png",
  "assets/characters/girl-boy-handshake.png",
  "assets/characters/girl-back.png",
  "assets/characters/boy-back.png",
  "assets/book/check/book-boy-up.png",
  "assets/book/check/book-girl-down.png",
  "assets/book/check/book-girl-hands-up.png",
  "assets/book/check/book-boy-jump-up.png"
];

const preloadedCharacterImages = [...motionAssetUrls, ...criticalCharacterUrls].map(src => {
  const image = new Image();
  image.decoding = "sync";
  image.fetchPriority = "high";
  image.src = src;
  return image;
});

const characterOptions = {
  girl: { label: "გოგო", alt: "გოგონა" },
  boy: { label: "ბიჭი", alt: "ბიჭი" }
};
const relationObjects = [
  { file: "chair-single", spoken: "სკამი", of: "სკამის", alt: "ხის სკამი" },
  { file: "schoolbag-red", spoken: "წითელი ჩანთა", of: "წითელი ჩანთის", alt: "წითელი სასკოლო ჩანთა" },
  { file: "basket-woven", spoken: "კალათა", of: "კალათის", alt: "კალათა" },
  { file: "box-open-blue", spoken: "ლურჯი ყუთი", of: "ლურჯი ყუთის", alt: "ლურჯი ღია ყუთი" },
  { file: "cube-blue-large", spoken: "ლურჯი კუბიკი", of: "ლურჯი კუბიკის", alt: "ლურჯი კუბიკი" }
];

const spatialObjects = {
  bag: { file: "schoolbag-red", spoken: "ჩანთა", of: "ჩანთის", alt: "წითელი ჩანთა" },
  ball: { file: "basketball-large", spoken: "ბურთი", of: "ბურთის", alt: "ნარინჯისფერი ბურთი" },
  table: { file: "table-wood", spoken: "მაგიდა", of: "მაგიდის", alt: "ხის მაგიდა" },
  apple: { file: "apple-red", spoken: "ვაშლი", of: "ვაშლის", alt: "წითელი ვაშლი" }
};

const objectCheckChallenges = [
  { type: "arrange", book: true, prompt: "რომელ სურათში დგას გოგო ბიჭის მარჯვნივ?", voice: "გოგო ბიჭის მარჯვნივაა. იპოვე.", choices: [["boy-back", "girl-back"], ["girl-back", "boy-back"]], answer: 0, kind: "characters" },
  { type: "arrange", book: true, prompt: "რომელ სურათში დგას ბიჭი გოგოს მარჯვნივ?", voice: "ბიჭი გოგოს მარჯვნივაა. იპოვე.", choices: [["boy-back", "girl-back"], ["girl-back", "boy-back"]], answer: 1, kind: "characters" },
  { type: "arrange", book: true, prompt: "სად ასწია გოგონამ მარჯვენა ხელი?", voice: "მარჯვენა ხელი. იპოვე.", choices: [["girl-back-left-hand-up"], ["girl-back-right-hand-up"]], answer: 1, kind: "characters" },
  { type: "arrange", book: true, prompt: "რომელი სურათი ნიშნავს — იმოძრავე მარჯვნივ?", voice: "იმოძრავე მარჯვნივ. იპოვე.", choices: [["girl-walk-left"], ["girl-walk-right"]], answer: 1, kind: "walk" },
  { type: "arrange", prompt: "რომელ სურათშია ბურთი ჩანთის მარჯვნივ?", voice: "ბურთი ჩანთის მარჯვნივაა. იპოვე.", choices: [["bag", "ball"], ["ball", "bag"], ["bag", "apple"]], answer: 0 },
  { type: "arrange", prompt: "რომელ სურათშია ვაშლი მაგიდის მარცხნივ?", voice: "ვაშლი მაგიდის მარცხნივაა. იპოვე.", choices: [["table", "apple"], ["apple", "table"], ["ball", "table"]], answer: 1 },
  { type: "arrange", prompt: "რომელ სურათშია ჩანთა მაგიდასა და ბურთს შორის?", voice: "ჩანთა მაგიდასა და ბურთს შორისაა. იპოვე.", choices: [["table", "bag", "ball"], ["bag", "table", "ball"], ["table", "ball", "bag"]], answer: 0 },
  { type: "identify", prompt: "რომელი საგანია ჩანთის მარჯვნივ?", voice: "რომელია ჩანთის მარჯვნივ?", row: ["apple", "bag", "ball"], answer: 2, reference: 1 },
  { type: "identify", prompt: "რომელი საგანია მაგიდის მარცხნივ?", voice: "რომელია მაგიდის მარცხნივ?", row: ["ball", "table", "apple"], answer: 0, reference: 1 },
  { type: "identify", prompt: "რომელი საგანია ჩანთასა და ვაშლს შორის?", voice: "რომელია ჩანთასა და ვაშლს შორის?", row: ["bag", "chair", "apple"], answer: 1, reference: -1 }
];

const verticalCheckChallenges = [
  {
    image: "book-boy-up.png",
    alt: "სახელმძღვანელოს სურათი: ბიჭი კიბეზე ზევით ადის",
    prompt: "ბიჭი სად მიდის?",
    voice: "ბიჭი სად მიდის? მონიშნე სწორი პასუხი.",
    answer: "up"
  },
  {
    image: "book-girl-down.png",
    alt: "სახელმძღვანელოს სურათი: გოგო კიბეზე ქვევით ჩამოდის",
    prompt: "გოგო სად ჩამოდის?",
    voice: "გოგო სად ჩამოდის? მონიშნე სწორი პასუხი.",
    answer: "down"
  },
  {
    image: "book-girl-hands-up.png",
    alt: "სახელმძღვანელოს სურათი: გოგოს ხელები ზევით აქვს აწეული",
    prompt: "გოგოს ხელები საით აქვს აწეული?",
    voice: "გოგოს ხელები საით აქვს აწეული? მონიშნე სწორი პასუხი.",
    answer: "up"
  },
  {
    image: "book-boy-jump-up.png",
    alt: "სახელმძღვანელოს სურათი: ბიჭი ზევით ხტება",
    prompt: "ბიჭი საით ახტა?",
    voice: "ბიჭი საით ახტა? მონიშნე სწორი პასუხი.",
    answer: "up"
  }
];

const checkObjects = {
  bag: spatialObjects.bag,
  ball: spatialObjects.ball,
  table: spatialObjects.table,
  apple: spatialObjects.apple,
  chair: { file: "chair-single", spoken: "სკამი", alt: "ხის სკამი" }
};

const strip = document.querySelector("#lessonStrip");
const title = document.querySelector("#lessonTitle");
const count = document.querySelector("#lessonCount");
const content = document.querySelector("#stageContent");
const stars = document.querySelector("#stars");
const learningCard = document.querySelector(".learning-card");
const quizCard = document.querySelector("#chapterQuiz");
const toast = document.querySelector("#toast");

function asset(name) { return `assets/characters/${name}.png`; }
function objectAsset(name) { return `assets/objects/${name}.png`; }

function currentCharacterAsset(state = "back") {
  return asset(`${selectedCharacter}-${state}`);
}

function currentBackWalkAsset() {
  const foot = gaitStep % 2 === 0 ? "left-foot" : "right-foot";
  return currentCharacterAsset(`walk-back-${foot}`);
}

function advanceDirectionalWalkFrame(avatar, direction) {
  const alternate = gaitStep % 2 === 1 ? "-alt" : "";
  avatar.src = asset(`${selectedCharacter}-walk-right${alternate}`);
  avatar.classList.toggle("face-left", direction === "left");
  avatar.alt = `${characterOptions[selectedCharacter].alt} მიდის ${direction === "right" ? "მარჯვნივ" : "მარცხნივ"}`;
  gaitStep += 1;
}

[
  "girl-back", "girl-back-right-hand-up", "girl-back-left-hand-up", "girl-walk-right", "girl-walk-left",
  "boy-back", "boy-back-right-hand-up", "boy-back-left-hand-up", "boy-walk-right", "boy-walk-left",
  "girl-walk-back-left-foot", "girl-walk-back-right-foot",
  "boy-walk-back-left-foot", "boy-walk-back-right-foot",
  "girl-walk-right-alt", "boy-walk-right-alt",
  "face-pair-ready", "face-pair-right-hands-up", "girl-boy-handshake"
].forEach(name => { const image = new Image(); image.src = asset(name); });

function startWalking(avatar, direction, persistent = false) {
  if (persistent) {
    const holder = avatar.closest(".avatar-wrap");
    const from = walkPosition * 42;
    const directionStep = direction === "right" ? 1 : -1;
    const nextPosition = Math.max(-3, Math.min(3, walkPosition + directionStep));
    const to = nextPosition * 42;
    if (nextPosition === walkPosition) return false;
    walkPosition = nextPosition;
    advanceDirectionalWalkFrame(avatar, direction);
    const motion = holder.animate([
      { transform: `translateX(${from}px)` },
      { transform: `translateX(${to}px)` }
    ], {
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 260,
      easing: "ease-out",
      fill: "forwards"
    });
    motion.addEventListener("finish", () => {
      holder.style.transform = `translateX(${to}px)`;
      motion.cancel();
    }, { once: true });
    return true;
  }
  const phase = gaitStep % 2;
  gaitStep += 1;
  let started = false;
  const begin = () => {
    if (started) return;
    started = true;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      avatar.classList.add(direction === "right" ? "travel-right" : "travel-left", phase === 0 ? "step-a" : "step-b");
    }));
  };
  avatar.addEventListener("load", begin, { once: true });
  avatar.src = currentCharacterAsset(`walk-${direction}`);
  if (avatar.complete) begin();
  return true;
}

function stepMovementTrack(avatar, direction) {
  const directionStep = direction === "right" ? 1 : -1;
  const nextPosition = Math.max(-3, Math.min(3, walkPosition + directionStep));
  if (nextPosition === walkPosition) return false;
  walkPosition = nextPosition;
  advanceDirectionalWalkFrame(avatar, direction);
  avatar.style.left = `calc(50% + ${walkPosition * 42}px)`;
  return true;
}

function getGeorgianVoice() {
  if (!window.speechSynthesis) return null;
  return window.speechSynthesis.getVoices().find(voice => /^ka(?:-|_|$)/i.test(voice.lang)) || null;
}

function speak(message, notifyWhenUnavailable = false) {
  if (!soundOn || !window.speechSynthesis) return;
  const georgianVoice = getGeorgianVoice();
  if (!georgianVoice) {
    if (notifyWhenUnavailable) showToast("ქართული ხმა ამ ბრაუზერში არ არის");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.voice = georgianVoice;
  utterance.lang = "ka-GE";
  utterance.rate = 0.82;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

function audioButton(message, label = "მოისმინე მითითება") {
  return `<button class="listen-btn" type="button" data-speak="${message}" aria-label="${label}">🔊</button>`;
}

function bindAudio(scope = document) {
  scope.querySelectorAll("[data-speak]").forEach(button => {
    button.hidden = !getGeorgianVoice();
    button.addEventListener("click", () => speak(button.dataset.speak, true));
  });
}

function syncAudioControls() {
  const available = Boolean(getGeorgianVoice());
  document.querySelectorAll("[data-speak]").forEach(button => { button.hidden = !available; });
  const soundButton = document.querySelector("#soundBtn");
  soundButton.hidden = !available;
  soundButton.textContent = soundOn ? "🔊" : "🔇";
}

function announce(message) {
  window.setTimeout(() => speak(message), 180);
}

function buildStrip() {
  strip.innerHTML = "";
  lessons.forEach((lesson, i) => {
    const b = document.createElement("button");
    b.className = `lesson-pill ${i === currentLesson && !quizCard.hidden ? "" : i === currentLesson ? "active" : ""}`;
    b.textContent = `${i + 1}. ${lesson.short}`;
    b.addEventListener("click", () => openLesson(i));
    strip.appendChild(b);
  });
  const q = document.createElement("button");
  q.className = "lesson-pill quiz";
  q.textContent = "★ ვიქტორინა";
  q.addEventListener("click", openQuiz);
  strip.appendChild(q);
}

function openLesson(i) {
  currentLesson = i;
  currentStage = "learn";
  handStep = 0;
  moveStep = 0;
  raisedHands = new Set();
  movedDirections = new Set();
  relationRound = 0;
  relationScore = 0;
  relationChallenge = null;
  faceMode = "ready";
  walkPosition = 0;
  gaitStep = 0;
  stairLevel = 0;
  stairGait = 0;
  stairGaitByDirection = { up: 0, down: 0 };
  upStairLevel = 0;
  downStairLevel = 4;
  verticalActor = "children";
  verticalLearnCharacter = "girl";
  verticalPracticeDirection = "up";
  verticalPracticeRound = 0;
  verticalPracticeScore = 0;
  verticalPracticeMoves = { up: 0, down: 0 };
  verticalCheckRound = 0;
  verticalCheckScore = 0;
  quizCard.hidden = true;
  learningCard.hidden = false;
  document.querySelectorAll(".stage-tab").forEach((tab, k) => tab.classList.toggle("active", k === 0));
  render();
}

function render() {
  const lesson = lessons[currentLesson];
  title.textContent = lesson.title;
  count.textContent = `გაკვეთილი ${currentLesson + 1} · ${lessons.length}-დან`;
  stars.textContent = `${"★ ".repeat(scores[currentLesson])}${"☆ ".repeat(3 - scores[currentLesson])}`.trim();
  buildStrip();
  document.querySelector('.stage-tabs').hidden = !!lesson.embedded;
  stars.hidden = !!lesson.embedded;
  if (lesson.embedded) { renderEmbedded(lesson); return; }
  if (currentStage === "learn") renderLearn(lesson);
  if (currentStage === "practice") renderPractice(lesson);
  if (currentStage === "check") renderCheck(lesson);
  makeHintsCollapsible(content);
}

function makeHintsCollapsible(root = document) {
  if (!root || !root.querySelectorAll) return;
  root.querySelectorAll("div.hint-box:not(.converted-hint)").forEach(box => {
    box.classList.add("converted-hint");
    const strong = box.querySelector("strong");
    const title = strong ? strong.textContent.trim().replace(/:$/, "") : "მინიშნება";
    if (strong) strong.remove();
    const icon = box.querySelector("[aria-hidden='true']")?.textContent || "💡";
    const innerDiv = box.querySelector("div");
    const bodyHtml = (innerDiv ? innerDiv.innerHTML : box.innerHTML).trim();
    
    const details = document.createElement("details");
    details.className = "hint-box";
    details.innerHTML = `
      <summary>
        <span class="hint-icon" aria-hidden="true">${icon}</span>
        <span class="hint-title">${title}</span>
        <span class="hint-badge">დააჭირე სანახავად</span>
        <span class="hint-arrow">▼</span>
      </summary>
      <div class="hint-content">${bodyHtml}</div>
    `;
    box.replaceWith(details);
  });
}

function renderEmbedded(lesson) {
 content.innerHTML = `<iframe id="comparisonFrame" title="${lesson.title}" src="modes.html?mode=${lesson.mode}&muted=${!soundOn}" style="width:100%;height:900px;border:0;display:block" scrolling="no"></iframe>`;
}
window.addEventListener('message',e=>{
 const frame=document.querySelector('#comparisonFrame');
 if(!frame || e.source!==frame.contentWindow || e.origin!==location.origin)return;
 if(e.data?.type==='grade1-height' && Number.isFinite(e.data.height))frame.style.height=`${Math.max(400,e.data.height+24)}px`;
});

function renderLearn(lesson) {
  if (currentLesson === 0) {
    renderDirectionHands();
    return;
  }
  if (currentLesson === 1) {
    renderVerticalStairsLearn();
    return;
  }
  content.innerHTML = `
    <div class="stage-panel">
      <div class="activity-area">
        <div class="instruction"><span class="instruction-number">1</span><div><h3>დააკვირდი</h3><p>${lesson.explain}</p></div></div>
        ${explainScene(lesson.mode)}
      </div>
      <aside class="side-note">
        <div class="speech"><strong>დაიმახსოვრე</strong>${lesson.tip}</div>
        <div class="tip">სურათს ჯერ დააკვირდი, შემდეგ აღწერე სრული წინადადებით.</div>
        <button class="primary-btn" data-next-stage>ახლა ვივარჯიშოთ</button>
      </aside>
    </div>`;
  content.querySelector("[data-next-stage]").addEventListener("click", () => setStage("practice"));
}

const stairPracticeTasks = [
  { start: 0, direction: "up", prompt: "ადი ერთი საფეხურით ზევით." },
  { start: 4, direction: "down", prompt: "ჩამოდი ერთი საფეხურით ქვევით." },
  { start: 1, direction: "up", prompt: "გადადგი ერთი საფეხური ზევით." },
  { start: 3, direction: "down", prompt: "გადადგი ერთი საფეხური ქვევით." }
];

function stairCharacterAsset(direction, phase = 0) {
  if (verticalActor === "rabbit") {
    return `assets/objects/rabbit-${phase % 2 ? "hop" : "land"}.png?v=${motionAssetVersion}`;
  }
  const actor = direction === "up" ? "girl-step-up" : "boy-step-down";
  const frame = phase % 2 ? "b" : "a";
  return `assets/book/book-${actor}-${frame}.png?v=${motionAssetVersion}`;
}

function staircaseMarkup(level, id = "stairAvatar", direction = "up") {
  const colors = ["red", "blue", "green", "purple", "cyan"];
  const numbers = direction === "down" ? [5, 4, 3, 2, 1] : [1, 2, 3, 4, 5];
  const phase = stairGaitByDirection[direction] || 0;
  const isRabbit = verticalActor === "rabbit";
  return `<div class="number-staircase ${direction === "down" ? "descending" : "ascending"} level-${level}" data-level="${level}" data-direction="${direction}">
    <div class="stair-columns" aria-label="ხუთსაფეხურიანი კიბე, რიცხვები ერთიდან ხუთამდე">
      ${numbers.map(number => `<div class="stair-column stair-${colors[number - 1]}"><div class="stair-cubes">${Array.from({ length: number }, () => `<i></i>`).join("")}</div><strong>${number}</strong></div>`).join("")}
    </div>
    <img id="${id}" class="stair-avatar book-stair-child ${isRabbit ? "rabbit-stair-avatar" : ""}" src="${stairCharacterAsset(direction, isRabbit ? 0 : phase)}" alt="${isRabbit ? "კურდღელი კიბეზე მოძრაობს" : direction === "up" ? "გოგო კიბეზე ზევით ადის" : "ბიჭი კიბეზე ქვევით ჩამოდის"}">
  </div>`;
}

function stairObjectPickerMarkup() {
  return `<div class="stair-object-picker" role="group" aria-label="აირჩიე მოძრავი ობიექტი">
    <strong>აირჩიე ვინ იმოძრავებს</strong>
    <button type="button" class="${verticalActor === "children" ? "selected" : ""}" data-stair-actor="children" aria-pressed="${verticalActor === "children"}">
      <img src="assets/book/book-girl-step-up-a.png?v=${motionAssetVersion}" alt=""><span>ბავშვები</span>
    </button>
    <button type="button" class="${verticalActor === "rabbit" ? "selected" : ""}" data-stair-actor="rabbit" aria-pressed="${verticalActor === "rabbit"}">
      <img src="assets/objects/rabbit-land.png?v=${motionAssetVersion}" alt=""><span>კურდღელი</span>
    </button>
  </div>`;
}

function bindStairObjectPicker() {
  content.querySelectorAll("[data-stair-actor]").forEach(button => button.addEventListener("click", () => {
    verticalActor = button.dataset.stairActor;
    stairGait = 0;
    stairGaitByDirection = { up: 0, down: 0 };
    upStairLevel = 0;
    downStairLevel = 4;
    stairLevel = 0;
    verticalPracticeMoves = { up: 0, down: 0 };
    render();
    speak(verticalActor === "rabbit" ? "არჩეულია კურდღელი. ის ორივე ფეხით ასკუპდება." : "არჩეულია ბავშვები. ისინი ფეხებს მონაცვლეობით ადგამენ.");
  }));
}

function renderVerticalStairsLearn() {
  verticalActor = "children";
  const isGirl = verticalLearnCharacter === "girl";
  const direction = isGirl ? "up" : "down";
  const level = isGirl ? upStairLevel : downStairLevel;
  const titleText = isGirl ? "გოგო ადის ზევით" : "ბიჭი ჩამოდის ქვევით";
  const commandText = isGirl ? "ადი ერთი საფეხურით ზევით." : "ჩამოდი ერთი საფეხურით ქვევით.";

  content.innerHTML = `
    <div class="vertical-single-stage">
      <div class="activity-area vertical-single-activity">
        <div class="instruction child-instruction vertical-simple-instruction"><span class="instruction-number">1</span><div><h3>ადი ზევით. ჩამოდი ქვევით.</h3></div>${audioButton("ადი ერთი საფეხურით ზევით. ჩამოდი ერთი საფეხურით ქვევით.")}</div>

        <div class="vertical-character-picker" role="group" aria-label="აირჩიე პერსონაჟი">
          <button type="button" class="vertical-character-choice ${isGirl ? "selected" : ""}" data-vertical-character="girl" aria-pressed="${isGirl}">
            <img src="assets/book/book-girl-step-up-a.png?v=${motionAssetVersion}" alt="გოგო"><span>გოგო</span>
          </button>
          <button type="button" class="vertical-character-choice ${!isGirl ? "selected" : ""}" data-vertical-character="boy" aria-pressed="${!isGirl}">
            <img src="assets/book/book-boy-step-down-a.png?v=${motionAssetVersion}" alt="ბიჭი"><span>ბიჭი</span>
          </button>
        </div>

        <section class="stair-demo-card single-stair-card" data-stair-demo="${direction}">
          <h4>${titleText}</h4>
          <div class="stair-demo-action">
            ${staircaseMarkup(level, "singleStairAvatar", direction)}
            <button class="stair-control ${direction === "up" ? "stair-up" : "stair-down"}" type="button" data-stair-move="${direction}" aria-label="${commandText}"><span>${direction === "up" ? "↑" : "↓"}</span><small>${direction === "up" ? "ზევით" : "ქვევით"}</small></button>
          </div>
        </section>

        <div class="feedback" id="feedback" hidden></div>
        <div class="vertical-bottom-actions"><button class="primary-btn" data-next-stage>ახლა ივარჯიშე →</button></div>
      </div>
    </div>`;

  bindAudio(content);
  bindStairControls(false);
  content.querySelectorAll("[data-vertical-character]").forEach(button => button.addEventListener("click", () => {
    verticalLearnCharacter = button.dataset.verticalCharacter;
    renderVerticalStairsLearn();
  }));
  content.querySelector("[data-next-stage]").addEventListener("click", () => {
    verticalPracticeRound = 0;
    verticalPracticeScore = 0;
    verticalPracticeMoves = { up: 0, down: 0 };
    verticalPracticeDirection = "up";
    upStairLevel = 0;
    downStairLevel = 4;
    setStage("practice");
  });
  announce(commandText);
}

function bindStairControls(practice = false) {
  content.querySelectorAll("[data-stair-move]").forEach(button => button.addEventListener("click", () => {
    moveOneStair(button.dataset.stairMove, practice);
  }));
}

function moveOneStair(direction, practice = false) {
  const current = practice ? stairLevel : direction === "up" ? upStairLevel : downStairLevel;
  const delta = direction === "up" ? 1 : -1;
  const next = Math.max(0, Math.min(4, current + delta));
  if (next === current) {
    feedback(false, direction === "up" ? "კიბის თავში ხარ." : "კიბის ძირში ხარ.");
    speak(direction === "up" ? "კიბის თავში ხარ." : "კიბის ძირში ხარ.");
    return false;
  }
  const demo = practice ? content.querySelector("[data-stair-demo]") : content.querySelector(`[data-stair-demo="${direction}"]`);
  const avatar = demo.querySelector(".stair-avatar");
  const buttons = practice ? content.querySelectorAll("[data-stair-move]") : demo.querySelectorAll("[data-stair-move]");
  buttons.forEach(button => { button.disabled = true; });
  stairGait += 1;
  stairGaitByDirection[direction] = (stairGaitByDirection[direction] || 0) + 1;
  const phase = stairGaitByDirection[direction];
  avatar.classList.add(phase % 2 ? "step-a" : "step-b");
  avatar.src = verticalActor === "rabbit" ? stairCharacterAsset(direction, 1) : stairCharacterAsset(direction, phase);
  if (practice) stairLevel = next;
  else if (direction === "up") upStairLevel = next;
  else downStairLevel = next;
  const board = demo.querySelector(".number-staircase");
  board.className = `number-staircase ${direction === "down" ? "descending" : "ascending"} level-${next}`;
  board.dataset.level = next;
  const word = direction === "up" ? "ზევით" : "ქვევით";
  const message = verticalActor === "rabbit"
    ? direction === "up"
      ? "კურდღელი ორივე ფეხით ასკუპდა ზევით და დადგა საფეხურზე."
      : "კურდღელი ორივე ფეხით ჩამოსკუპდა ქვევით და დადგა საფეხურზე."
    : `ერთი საფეხური ${word} — ფეხი შეცვალა და დადგა.`;
  feedback(true, message);
  speak(message);
  window.setTimeout(() => {
    if (verticalActor === "rabbit") avatar.src = stairCharacterAsset(direction, 0);
    avatar.classList.remove("step-a", "step-b");
    if (!practice) buttons.forEach(button => { button.disabled = false; });
  }, 520);
  return true;
}

function renderDirectionHands() {
  const character = characterOptions[selectedCharacter];
  const message = "ასწიე ხელი ან გადადგი ერთი ნაბიჯი.";
  content.innerHTML = `
    <div class="stage-panel direction-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">1</span>
          <div><h3>${message}</h3><p>ყველა მოქმედება შეგიძლია რამდენჯერმე გაიმეორო.</p></div>
          ${audioButton("ასწიე მარჯვენა ან მარცხენა ხელი. წადი მარჯვნივ ან მარცხნივ.")}
        </div>
        <div class="character-picker" aria-label="აირჩიე პერსონაჟი">
          ${Object.entries(characterOptions).map(([key, option]) => `<button type="button" class="character-choice ${selectedCharacter === key ? "selected" : ""}" data-character="${key}" aria-label="აირჩიე ${option.label}" title="${option.label}" aria-pressed="${selectedCharacter === key}"><img src="${asset(`${key}-back`)}" alt="${option.alt} ზურგით"></button>`).join("")}
        </div>
        <div class="body-board combined-control-board">
          <button class="move-arrow move-left compact-move" data-move="left" aria-label="ერთი ნაბიჯი მარცხნივ"><span>←</span><small>მარცხნივ</small></button>
          <div class="avatar-wrap">
            <img id="handAvatar" class="back-avatar" src="${currentBackWalkAsset()}" alt="${character.alt} ზურგით დგას, მარცხენა ფეხი წინ აქვს გადადგმული">
            <button class="hand-hotspot left-hand" data-hand="left" aria-label="მარცხენა ხელის აწევა"><span></span></button>
            <button class="hand-hotspot right-hand" data-hand="right" aria-label="მარჯვენა ხელის აწევა"><span></span></button>
          </div>
          <button class="move-arrow move-right compact-move" data-move="right" aria-label="ერთი ნაბიჯი მარჯვნივ"><span>→</span><small>მარჯვნივ</small></button>
          <div class="hand-actions-bar" role="group" aria-label="ხელის აწევა">
            <button type="button" class="hand-action-btn" data-hand="left" aria-label="მარცხენა ხელის აწევა">
              <span class="btn-hand-icon left-hand">✋</span>
              <span>მარცხენა ხელი</span>
            </button>
            <button type="button" class="hand-action-btn" data-hand="right" aria-label="მარჯვენა ხელის აწევა">
              <span class="btn-hand-icon right-hand">✋</span>
              <span>მარჯვენა ხელი</span>
            </button>
          </div>
        </div>
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">მინიშნება</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            ყვითელი წრე ხელს სწევს. ისარი ერთ ნაბიჯს ადგმევინებს.
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note picture-note">
        <div class="speech"><strong>ჯერ სხეულზე</strong>ხელი ასწიე, შემდეგ იმავე მხარეს ერთი ნაბიჯი გადადგი.</div>
        <button class="primary-btn" data-next-stage>ახლა ივარჯიშე →</button>
      </aside>
    </div>`;
  bindAudio(content);
  content.querySelectorAll("[data-character]").forEach(button => button.addEventListener("click", () => {
    selectedCharacter = button.dataset.character;
    raisedHands = new Set();
    handStep = 0;
    walkPosition = 0;
    gaitStep = 0;
    renderDirectionHands();
  }));
  content.querySelector("[data-next-stage]").addEventListener("click", () => setStage("practice"));
  content.querySelectorAll("[data-hand]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.hand;
    const avatar = content.querySelector("#handAvatar");
    content.querySelectorAll("[data-hand], [data-move]").forEach(control => { control.disabled = true; });
    avatar.className = "back-avatar";
    avatar.src = currentCharacterAsset(`back-${chosen}-hand-up`);
    const word = chosen === "right" ? "მარჯვენა" : "მარცხენა";
    feedback(true, `${word} ხელი!`);
    speak(`${word} ხელი.`);
    window.setTimeout(() => {
      avatar.src = currentBackWalkAsset();
      content.querySelectorAll("[data-hand], [data-move]").forEach(control => { control.disabled = false; });
    }, 650);
  }));
  content.querySelectorAll("[data-move]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.move;
    const avatar = content.querySelector("#handAvatar");
    content.querySelectorAll("[data-hand], [data-move]").forEach(control => { control.disabled = true; });
    const moved = startWalking(avatar, chosen, true);
    const word = chosen === "right" ? "მარჯვნივ" : "მარცხნივ";
    feedback(moved, moved ? `ერთი ნაბიჯი ${word} — ფეხი გაშალა და დადგა.` : "აქ გაჩერდი. მეორე მხარეს წადი.");
    speak(moved ? `ერთი ნაბიჯი ${word}. ფეხი გაშალა და დადგა.` : "აქ გაჩერდი.");
    window.setTimeout(() => {
      content.querySelectorAll("[data-hand], [data-move]").forEach(control => { control.disabled = false; });
    }, moved ? 300 : 350);
  }));
  announce("მარჯვენა. მარცხენა. აირჩიე მოქმედება.");
}

function explainScene(mode) {
  const girl = `<img class="character girl" src="${asset("girl-neutral")}" alt="გოგონა">`;
  const boy = `<img class="character boy" src="${asset("boy-neutral")}" alt="ბიჭი">`;
  if (mode === "horizontal") return `<div class="scene"><span class="scene-label">ორივე ზურგით დგას</span><div class="direction-sign left-sign scene-sign"><span>←</span><small>მარცხენა</small></div><img class="character boy back-character" src="${asset("boy-back")}" alt="ბიჭი ზურგით დგას"><img class="character girl back-character" src="${asset("girl-back")}" alt="გოგონა ზურგით დგას"><div class="direction-sign right-sign scene-sign"><span>→</span><small>მარჯვენა</small></div></div>`;
  if (mode === "vertical") return `<div class="scene"><span class="scene-label">ბურთი ზევითაა</span><img class="object-img" src="${objectAsset("ball-orange")}" alt="ბურთი" style="left:44%;top:38px"><div style="position:absolute;left:20%;right:20%;top:53%;height:14px;background:#bd814e;border-radius:8px"></div>${girl}</div>`;
  if (mode === "arrangement") return `<div class="scene"><span class="scene-label">ბავშვები გვერდიგვერდ მიდიან</span><img class="character boy" src="${asset("boy-walk-right")}" alt="ბიჭი მიდის"><img class="character girl" src="${asset("girl-walk-right")}" alt="გოგონა მიდის"></div>`;
  if (mode === "container") return `<div class="scene"><span class="scene-label">კუბიკები ყუთის შიგნითაა</span><img src="${objectAsset("box-open-blue")}" alt="ღია ყუთი" style="position:absolute;width:230px;left:28%;bottom:40px"><img src="${objectAsset("cube-blue-large")}" alt="ლურჯი კუბიკი" style="position:absolute;width:70px;left:37%;bottom:75px"><img src="${objectAsset("cube-red-small")}" alt="წითელი კუბიკი" style="position:absolute;width:58px;left:49%;bottom:72px">${girl}</div>`;
  if (mode === "size") return `<div class="scene"><span class="scene-label">ერთი დიდია, მეორე პატარა</span><img src="${objectAsset("basketball-large")}" alt="დიდი ბურთი" style="position:absolute;width:150px;left:24%;bottom:45px"><img src="${objectAsset("ball-orange")}" alt="პატარა ბურთი" style="position:absolute;width:78px;right:27%;bottom:52px">${girl}</div>`;
  return `<div class="scene"><span class="scene-label">თითო წითელს თითო ლურჯი შეუწყვილე</span><img src="${objectAsset("counters-red-three")}" alt="წითელი რგოლები" style="position:absolute;width:180px;left:19%;top:100px"><img src="${objectAsset("counters-blue-three")}" alt="ლურჯი რგოლები" style="position:absolute;width:180px;right:19%;top:100px">${girl}</div>`;
}

function counterSet(n, color) { return Array.from({length:n}, () => `<i style="display:inline-block;width:34px;height:34px;border-radius:50%;margin:8px;background:${color};box-shadow:inset -4px -4px 6px rgba(0,0,0,.15)"></i>`).join(""); }

function renderPractice(lesson) {
  if (currentLesson === 0) {
    renderFaceToFacePractice();
    return;
  }
  if (currentLesson === 1) {
    renderVerticalPractice();
    return;
  }
  content.innerHTML = `<div class="stage-panel"><div class="activity-area"><div class="instruction"><span class="instruction-number">2</span><div><h3>${lesson.task}</h3><p>შეასრულე მოქმედება და შეამოწმე.</p></div></div><div id="practiceBoard"></div><div class="feedback" id="feedback">შენი პასუხი აქ გამოჩნდება.</div></div><aside class="side-note"><div class="speech"><strong>ერთი ნაბიჯი</strong>${lesson.tip}</div><button class="secondary-btn" id="resetTask">თავიდან</button><button class="primary-btn" data-check-stage>მოკლე შემოწმება</button></aside></div>`;
  drawTask(lesson);
  content.querySelector("#resetTask").addEventListener("click", () => renderPractice(lesson));
  content.querySelector("[data-check-stage]").addEventListener("click", () => setStage("check"));
}

function renderVerticalPractice() {
  verticalActor = "rabbit";
  const direction = verticalPracticeDirection;
  const level = direction === "up" ? upStairLevel : downStairLevel;
  const completed = verticalPracticeMoves.up >= 2 && verticalPracticeMoves.down >= 2;
  const score = Math.min(verticalPracticeMoves.up, 2) + Math.min(verticalPracticeMoves.down, 2);
  const titleText = direction === "up" ? "კურდღელი ასკუპდება ზევით" : "კურდღელი ჩამოსკუპდება ქვევით";

  content.innerHTML = `
    <div class="vertical-single-stage">
      <div class="activity-area vertical-single-activity">
        <div class="instruction child-instruction vertical-simple-instruction">
          <span class="instruction-number">2</span>
          <div><h3>ამოძრავე კურდღელი ზევით და ქვევით.</h3><p>თითო დაჭერაზე კურდღელი ერთ საფეხურზე ასკუპდება ან ჩამოსკუპდება.</p></div>
          ${audioButton("ამოძრავე კურდღელი ზევით და ქვევით. თითო დაჭერაზე გაიარე ერთი საფეხური.")}
        </div>

        <div class="vertical-character-picker rabbit-direction-picker" role="group" aria-label="აირჩიე მიმართულება">
          <button type="button" class="vertical-character-choice ${direction === "up" ? "selected" : ""}" data-rabbit-direction="up" aria-pressed="${direction === "up"}">
            <img src="assets/objects/rabbit-land.png?v=${motionAssetVersion}" alt="კურდღელი"><span>↑ ზევით</span>
          </button>
          <button type="button" class="vertical-character-choice ${direction === "down" ? "selected" : ""}" data-rabbit-direction="down" aria-pressed="${direction === "down"}">
            <img src="assets/objects/rabbit-land.png?v=${motionAssetVersion}" alt="კურდღელი"><span>↓ ქვევით</span>
          </button>
        </div>

        <section class="stair-demo-card single-stair-card rabbit-single-stair" data-stair-demo="${direction}">
          <h4>${titleText}</h4>
          <div class="stair-demo-action">
            ${staircaseMarkup(level, "practiceRabbitStairAvatar", direction)}
            <button class="stair-control ${direction === "up" ? "stair-up" : "stair-down"}" type="button" data-practice-rabbit-move="${direction}" aria-label="ერთი საფეხურით ${direction === "up" ? "ზევით" : "ქვევით"}">
              <span>${direction === "up" ? "↑" : "↓"}</span><small>${direction === "up" ? "ზევით" : "ქვევით"}</small>
            </button>
          </div>
        </section>

        <div class="rabbit-practice-progress">
          <strong id="stairPracticeProgress">${score} / 4</strong>
          <div>${Array.from({ length: 4 }, (_, index) => `<i class="${index < score ? "done" : ""}" data-practice-dot></i>`).join("")}</div>
          <span>ორჯერ ზევით და ორჯერ ქვევით</span>
        </div>

        <div class="feedback" id="feedback" hidden></div>
        <div class="vertical-bottom-actions"><button class="primary-btn" id="stairPracticeCheck" ${completed ? "" : "disabled"}>მოკლე შემოწმება →</button></div>
      </div>
    </div>`;

  bindAudio(content);

  content.querySelectorAll("[data-rabbit-direction]").forEach(button => button.addEventListener("click", () => {
    verticalPracticeDirection = button.dataset.rabbitDirection;
    renderVerticalPractice();
  }));

  const moveButton = content.querySelector("[data-practice-rabbit-move]");
  moveButton.addEventListener("click", () => {
    const chosen = moveButton.dataset.practiceRabbitMove;
    if (!moveOneStair(chosen, false)) return;
    verticalPracticeMoves[chosen] += 1;
    verticalPracticeScore = Math.min(verticalPracticeMoves.up, 2) + Math.min(verticalPracticeMoves.down, 2);
    const progress = content.querySelector("#stairPracticeProgress");
    if (progress) progress.textContent = `${verticalPracticeScore} / 4`;
    content.querySelectorAll("[data-practice-dot]").forEach((dot, index) => dot.classList.toggle("done", index < verticalPracticeScore));
    if (verticalPracticeMoves.up >= 2 && verticalPracticeMoves.down >= 2) {
      award(2);
      const checkButton = content.querySelector("#stairPracticeCheck");
      checkButton.disabled = false;
      feedback(true, "ყოჩაღ! კურდღელი ორივე მიმართულებით ამოძრავე.");
    }
  });

  content.querySelector("#stairPracticeCheck").addEventListener("click", () => setStage("check"));
  announce("ამოძრავე კურდღელი ზევით და ქვევით.");
}

function renderDirectionMovement(completed = false) {
  const character = characterOptions[selectedCharacter];
  const message = completed ? "ყოჩაღ! ორივე მიმართულებით იმოძრავე." : "დააჭირე მარჯვენა ან მარცხენა ისარს.";
  content.innerHTML = `
    <div class="stage-panel direction-stage">
      <div class="activity-area">
        <div class="instruction child-instruction"><span class="instruction-number">2</span><div><h3>${message}</h3><p>დააჭირე შესაბამის ისარს.</p></div>${audioButton(message)}</div>
        <div class="movement-board">
          <button class="move-arrow move-left" data-move="left" aria-label="მარცხნივ მოძრაობა"><span>←</span><small>მარცხნივ</small></button>
          <div class="movement-track"><i></i><img id="moveAvatar" class="moving-avatar" src="${currentBackWalkAsset()}" alt="${character.alt} ზურგით დგას, მარცხენა ფეხი წინ აქვს გადადგმული"></div>
          <button class="move-arrow move-right" data-move="right" aria-label="მარჯვნივ მოძრაობა"><span>→</span><small>მარჯვნივ</small></button>
        </div>
        <div class="step-dots"><i class="${movedDirections.has("right") || completed ? "done" : ""}"></i><i class="${movedDirections.has("left") || completed ? "done" : ""}"></i></div>
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">მინიშნება</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            ერთხელ დააჭირე ისარს — პერსონაჟი ზუსტად ერთ ნაბიჯს გადადგამს.
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note picture-note">
        <div class="speech"><strong>ისრები წიგნის მსგავსად</strong><span class="mini-arrow brown">←</span> მარცხნივ &nbsp; <span class="mini-arrow blue">→</span> მარჯვნივ</div>
        ${completed ? `<button class="primary-btn" id="objectTask">ახლა ივარჯიშე →</button>` : ""}
      </aside>
    </div>`;
  bindAudio(content);
  if (completed) {
    content.querySelector("#objectTask").addEventListener("click", () => setStage("practice"));
    return;
  }
  content.querySelectorAll("[data-move]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.move;
    content.querySelectorAll("[data-move]").forEach(moveButton => { moveButton.disabled = true; });
    const avatar = content.querySelector("#moveAvatar");
    const moved = stepMovementTrack(avatar, chosen);
    if (moved) movedDirections.add(chosen);
    const word = chosen === "right" ? "მარჯვნივ" : "მარცხნივ";
    feedback(moved, moved ? `ერთი ნაბიჯი ${word} — ფეხი გაშალა და დადგა.` : "აქ გაჩერდი. მეორე მხარეს წადი.");
    speak(moved ? `ერთი ნაბიჯი ${word}. ფეხი გაშალა და დადგა.` : "აქ გაჩერდი.");
    window.setTimeout(() => {
      moveStep = movedDirections.size;
      if (movedDirections.size === 2) {
        renderDirectionMovement(true);
      } else {
        content.querySelectorAll("[data-move]").forEach(moveButton => { moveButton.disabled = false; });
      }
    }, moved ? 300 : 180);
  }));
  announce(message);
}

function renderFaceToFacePractice() {
  const modes = {
    ready: { image: "face-pair-ready", prompt: "აირჩიე მოქმედება.", voice: "აირჩიე მოქმედება." },
    right: { image: "face-pair-right-hands-up", prompt: "რომელი ხელი ასწია გოგომ? რომელი ხელი ასწია ბიჭმა? რისი თქმა შეგიძლია?", voice: "რომელი ხელი ასწია გოგომ? რომელი ხელი ასწია ბიჭმა?" },
    left: { image: "face-pair-right-hands-up", prompt: "რომელი ხელი ასწია გოგომ? რომელი ხელი ასწია ბიჭმა? რისი თქმა შეგიძლია?", voice: "რომელი ხელი ასწია გოგომ? რომელი ხელი ასწია ბიჭმა?", mirrored: true },
    handshake: { image: "girl-boy-handshake", prompt: "რომელი ხელი ჩამოართვეს?", voice: "რომელი ხელი ჩამოართვეს?" }
  };
  const state = modes[faceMode];
  content.innerHTML = `
    <div class="stage-panel practice-stage-full">
      <div class="activity-area">
        <div class="instruction child-instruction practice-command">
          <span class="instruction-number">2</span>
          <div><h3 id="facePrompt">${state.prompt}</h3></div>
          ${audioButton(state.voice, "მოისმინე კითხვა")}
          <div class="face-command-actions" role="group" aria-label="აირჩიე მოქმედება">
            <button class="${faceMode === "right" ? "primary-btn" : "secondary-btn"}" type="button" data-face-mode="right"><span class="btn-hand-icon right-hand">✋</span> მარჯვენა ხელი ასწიეთ</button>
            <button class="${faceMode === "left" ? "primary-btn" : "secondary-btn"}" type="button" data-face-mode="left"><span class="btn-hand-icon left-hand">✋</span> მარცხენა ხელი ასწიეთ</button>
            <button class="${faceMode === "handshake" ? "primary-btn" : "secondary-btn"}" type="button" data-face-mode="handshake">🤝 ჩამოართვით მარჯვენა ხელი</button>
          </div>
        </div>
        <div class="face-practice-board">
          <img class="face-pose ${faceMode === "ready" ? "active" : ""}" data-face-pose="ready" src="${asset("face-pair-ready")}" alt="გოგო და ბიჭი პირისპირ დგანან">
          <img class="face-pose ${faceMode === "right" ? "active" : ""}" data-face-pose="right" src="${asset("face-pair-right-hands-up")}" alt="გოგო და ბიჭი საკუთარ მარჯვენა ხელებს სწევენ">
          <img class="face-pose mirrored-pair ${faceMode === "left" ? "active" : ""}" data-face-pose="left" src="${asset("face-pair-right-hands-up")}" alt="გოგო და ბიჭი საკუთარ მარცხენა ხელებს სწევენ">
          <img class="face-pose ${faceMode === "handshake" ? "active" : ""}" data-face-pose="handshake" src="${asset("girl-boy-handshake")}" alt="გოგო და ბიჭი მარჯვენა ხელს ართმევენ">
        </div>
        <div class="feedback" id="feedback" hidden></div>
        <button class="primary-btn practice-next" data-check-stage>მოკლე შემოწმება →</button>
      </div>
    </div>`;
  bindAudio(content);
  content.querySelectorAll("[data-face-mode]").forEach(button => button.addEventListener("click", () => {
    faceMode = button.dataset.faceMode;
    const nextState = modes[faceMode];
    content.querySelector("#facePrompt").textContent = nextState.prompt;
    const listenButton = content.querySelector("[data-speak]");
    listenButton.dataset.speak = nextState.voice;
    content.querySelectorAll("[data-face-mode]").forEach(choice => {
      choice.className = choice.dataset.faceMode === faceMode ? "primary-btn" : "secondary-btn";
    });
    content.querySelectorAll("[data-face-pose]").forEach(pose => pose.classList.toggle("active", pose.dataset.facePose === faceMode));
    const result = content.querySelector("#feedback");
    result.hidden = true;
    const command = faceMode === "right" ? "მარჯვენა ხელი ასწიეთ." : faceMode === "left" ? "მარცხენა ხელი ასწიეთ." : "ჩამოართვით მარჯვენა ხელი.";
    announce(command);
  }));
  content.querySelector("[data-check-stage]").addEventListener("click", () => setStage("check"));
  if (faceMode === "ready") announce(state.voice);
}

function renderHandshakeScene() {
  content.innerHTML = `
    <div class="stage-panel direction-stage">
      <div class="activity-area">
        <div class="instruction child-instruction"><span class="instruction-number">3</span><div><h3>გოგო და ბიჭი პირისპირ დგანან.</h3><p>ისინი ერთმანეთს ხელს ართმევენ.</p></div></div>
        <div class="handshake-board">
          <div class="direction-sign left-sign"><span>←</span><small>მარცხენა</small></div>
          <img src="${asset("girl-boy-handshake")}" alt="გოგო და ბიჭი პირისპირ დგანან და ხელს ართმევენ">
          <div class="direction-sign right-sign"><span>→</span><small>მარჯვენა</small></div>
        </div>
      </div>
      <aside class="side-note picture-note">
        <div class="speech"><strong>პირისპირ დგომა</strong>როცა ბავშვები ერთმანეთს უყურებენ, მათი მარჯვენა და მარცხენა მხარეები საპირისპიროდ ჩანს.</div>
        <button class="primary-btn" id="objectTask">ობიექტთან დავაყენოთ →</button>
      </aside>
    </div>`;
  content.querySelector("#objectTask").addEventListener("click", () => renderDirectionRelation({ relation: "right", first: relationObjects[0] }, false));
}

function relationPrompt(challenge) {
  const character = characterOptions[selectedCharacter].label;
  if (challenge.relation === "between") return `დააყენე ${character} ${challenge.first.spoken} და ${challenge.second.spoken} შორის.`;
  return `დააყენე ${character} ${challenge.first.of} ${challenge.relation === "right" ? "მარჯვნივ" : "მარცხნივ"}.`;
}

function relationVisual(challenge) {
  const relation = challenge.relation;
  if (relation === "between") {
    return `<div class="relation-board between-board">
      <div class="fixed-object"><img src="${objectAsset(challenge.first.file)}" alt="${challenge.first.alt}"></div>
      <button class="relation-zone middle-zone" data-relation="between" aria-label="შორის"><span class="zone-symbol">↔</span><small>შორის</small></button>
      <div class="fixed-object"><img src="${objectAsset(challenge.second.file)}" alt="${challenge.second.alt}"></div>
    </div>`;
  }
  return `<div class="relation-board">
    <button class="relation-zone left-zone" data-relation="left" aria-label="მარცხნივ"><span class="zone-symbol brown">←</span><small>მარცხნივ</small></button>
    <div class="fixed-object"><img src="${objectAsset(challenge.first.file)}" alt="${challenge.first.alt}"></div>
    <button class="relation-zone right-zone" data-relation="right" aria-label="მარჯვნივ"><span class="zone-symbol blue">→</span><small>მარჯვნივ</small></button>
  </div>`;
}

function renderDirectionRelation(challenge, generated = false) {
  relationChallenge = challenge;
  const message = relationPrompt(challenge);
  content.innerHTML = `
    <div class="stage-panel direction-stage">
      <div class="activity-area">
        <div class="instruction child-instruction"><span class="instruction-number">3</span><div><h3>${message}</h3><p>გადაიტანე პერსონაჟი ან შეეხე სწორ ადგილს.</p></div>${audioButton(message)}</div>
        <div id="relationBoard">${relationVisual(challenge)}</div>
        <div class="drag-tray compact-tray"><img id="relationAvatar" class="drag-token draggable back-token" draggable="true" src="${currentCharacterAsset()}" alt="${characterOptions[selectedCharacter].alt} ზურგით დგას"></div>
        <div class="feedback" id="feedback">მოუსმინე და იპოვე სწორი ადგილი.</div>
      </div>
      <aside class="side-note picture-note">
        <div class="speech"><strong>${generated ? `ახალი დავალება ${relationRound + 1} · 3-დან` : "ჯერ ერთი ნიმუში"}</strong>ადგილი განისაზღვრება ობიექტის მიმართ.</div>
        ${generated ? "" : `<button class="secondary-btn" id="replayObject">მითითების გამეორება 🔊</button>`}
      </aside>
    </div>`;
  bindAudio(content);
  const avatar = content.querySelector("#relationAvatar");
  const zones = content.querySelectorAll("[data-relation]");
  let active = null;
  avatar.addEventListener("dragstart", () => { active = avatar; });
  zones.forEach(zone => {
    zone.addEventListener("dragover", event => { event.preventDefault(); zone.classList.add("hover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("hover"));
    zone.addEventListener("drop", event => { event.preventDefault(); zone.classList.remove("hover"); if (active) placeInRelation(zone, challenge, generated); });
    zone.addEventListener("click", () => placeInRelation(zone, challenge, generated));
  });
  const replay = content.querySelector("#replayObject");
  if (replay) replay.addEventListener("click", () => speak(message));
  announce(message);
}

function placeInRelation(zone, challenge, generated) {
  if (zone.classList.contains("correct")) return;
  const ok = zone.dataset.relation === challenge.relation;
  if (!ok) {
    feedback(false, "კიდევ დააკვირდი ობიექტს და ისარს.");
    speak("კიდევ სცადე.");
    return;
  }
  zone.appendChild(content.querySelector("#relationAvatar"));
  zone.classList.add("correct");
  feedback(true, "სწორია!");
  speak("სწორია!");
  if (!generated) {
    award(2);
    const aside = content.querySelector(".side-note");
    aside.insertAdjacentHTML("beforeend", `<button class="primary-btn" id="startGenerated">ახალი დავალებები →</button>`);
    content.querySelector("#startGenerated").addEventListener("click", () => setStage("check"));
    return;
  }
  relationScore += 1;
  window.setTimeout(() => {
    relationRound += 1;
    if (relationRound < 3) renderGeneratedRelation();
    else finishGeneratedRelations();
  }, 850);
}

function createRelationChallenge() {
  const relations = ["left", "right", "between"];
  const relation = relations[relationRound % relations.length];
  const pool = [...relationObjects].sort(() => Math.random() - 0.5);
  return { relation, first: pool[0], second: pool[1] };
}

function renderGeneratedRelation() {
  renderDirectionRelation(createRelationChallenge(), true);
}

function finishGeneratedRelations() {
  award(3);
  content.innerHTML = `<div class="result-panel lesson-result"><div class="result-medal">⭐</div><h3>ოთხივე დავალება სწორად შეასრულე!</h3><p>შენ შეგიძლია საგნები განათავსო მარჯვნივ, მარცხნივ და შორის.</p><button class="primary-btn" id="nextLesson">შემდეგი გაკვეთილი →</button></div>`;
  content.querySelector("#nextLesson").addEventListener("click", () => parent.postMessage({type:'direction-navigate',mode:'vertical'},'*'));
  speak("ყოჩაღ! ოთხივე დავალება სწორად შეასრულე.");
}

function objectCheckPrompt(challenge) {
  if (challenge.relation === "between") return `დადე ${challenge.moving.spoken} ${challenge.first.spoken} და ${challenge.second.spoken} შორის.`;
  return `დადე ${challenge.moving.spoken} ${challenge.first.of} ${challenge.relation === "right" ? "მარჯვნივ" : "მარცხნივ"}.`;
}

function objectCheckVisual(challenge) {
  if (challenge.relation === "between") {
    return `<div class="relation-board between-board object-check-board">
      <div class="fixed-object"><img src="${objectAsset(challenge.first.file)}" alt="${challenge.first.alt}"></div>
      <button class="relation-zone middle-zone" data-relation="between" aria-label="შორის"><span class="zone-symbol">↔</span><small>შორის</small></button>
      <div class="fixed-object"><img src="${objectAsset(challenge.second.file)}" alt="${challenge.second.alt}"></div>
    </div>`;
  }
  return `<div class="relation-board object-check-board">
    <button class="relation-zone left-zone" data-relation="left" aria-label="მარცხნივ"><span class="zone-symbol brown">←</span><small>მარცხნივ</small></button>
    <div class="fixed-object"><img src="${objectAsset(challenge.first.file)}" alt="${challenge.first.alt}"></div>
    <button class="relation-zone right-zone" data-relation="right" aria-label="მარჯვნივ"><span class="zone-symbol blue">→</span><small>მარჯვნივ</small></button>
  </div>`;
}

function renderObjectCheck() {
  const challenge = objectCheckChallenges[relationRound];
  const visual = challenge.type === "identify" ? identifyCheckVisual(challenge) : arrangementCheckVisual(challenge);
  content.innerHTML = `
    <div class="stage-panel direction-stage">
      <div class="activity-area">
        <div class="instruction child-instruction"><span class="instruction-number">${relationRound + 1}</span><div><h3>${challenge.prompt}</h3><p>შეეხე სწორ სურათს.</p></div>${audioButton(challenge.voice)}</div>
        ${visual}
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">მინიშნება</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            ${challenge.type === "identify" ? "ჯერ იპოვე დასახელებული საგანი, შემდეგ შეხედე მის გვერდებს." : "სურათებს მარცხნიდან მარჯვნივ დააკვირდი."}
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note picture-note">
        <div class="check-progress"><strong>${relationRound + 1} / ${objectCheckChallenges.length}</strong><div>${objectCheckChallenges.map((_, i) => `<i class="${i < relationRound ? "done" : i === relationRound ? "now" : ""}"></i>`).join("")}</div></div>
        <div class="speech"><strong>${challenge.book ? "წიგნის მსგავსი მაგალითი" : "ახალი ვიზუალური მაგალითი"}</strong>${challenge.book ? "პირველი ოთხი დავალება წიგნის მოქმედებებს იმეორებს." : "ერთი შეხება საკმარისია — კითხვა და სურათი ყოველ ჯერზე იცვლება."}</div>
      </aside>
    </div>`;
  bindAudio(content);
  content.querySelectorAll("[data-check-answer]").forEach(button => {
    button.addEventListener("click", () => chooseObjectCheck(button, challenge));
  });
  announce(challenge.voice);
}

function checkObjectImage(key) {
  const item = checkObjects[key];
  return `<img src="${objectAsset(item.file)}" alt="${item.alt}">`;
}

function arrangementCheckVisual(challenge) {
  return `<div class="check-choice-grid ${challenge.choices.length === 2 ? "two" : ""}">${challenge.choices.map((choice, index) => {
    const items = choice.map(key => {
      if (challenge.kind === "characters" || challenge.kind === "walk") return `<img src="${asset(key)}" alt="პერსონაჟი">`;
      return checkObjectImage(key);
    }).join("");
    const arrow = challenge.kind === "walk" ? `<span class="choice-direction ${index === 0 ? "brown" : "blue"}">${index === 0 ? "←" : "→"}</span>` : "";
    return `<button class="check-visual-choice ${choice.length === 3 ? "three-items" : ""}" type="button" data-check-answer="${index}" aria-label="პასუხი ${index + 1}"><div>${items}</div>${arrow}</button>`;
  }).join("")}</div>`;
}

function identifyCheckVisual(challenge) {
  return `<div class="identify-board">${challenge.row.map((key, index) => `<button type="button" class="identify-object ${index === challenge.reference ? "reference" : ""}" data-check-answer="${index}" aria-label="${checkObjects[key].spoken}">${checkObjectImage(key)}</button>`).join("")}</div>`;
}

function chooseObjectCheck(button, challenge) {
  if (button.disabled) return;
  const selected = Number(button.dataset.checkAnswer);
  if (selected !== challenge.answer) {
    button.classList.add("wrong");
    feedback(false, "კიდევ დააკვირდი ისარს და საყრდენ საგანს.");
    speak("კიდევ სცადე.");
    return;
  }
  content.querySelectorAll("[data-check-answer]").forEach(option => { option.disabled = true; });
  button.classList.add("correct");
  feedback(true, "სწორია!");
  relationScore += 1;
  speak("სწორია!");
  window.setTimeout(() => {
    relationRound += 1;
    if (relationRound < objectCheckChallenges.length) renderObjectCheck();
    else finishObjectCheck();
  }, 700);
}

function finishObjectCheck() {
  award(3);
  content.innerHTML = `<div class="result-panel lesson-result"><div class="result-medal">⭐</div><h3>ათივე დავალება შეასრულე!</h3><p>შენ არჩევ მარჯვენას, მარცხენას და შორის მდებარეობას.</p><button class="primary-btn" id="nextLesson">შემდეგი გაკვეთილი →</button></div>`;
  content.querySelector("#nextLesson").addEventListener("click", () => parent.postMessage({type:'direction-navigate',mode:'vertical'},'*'));
  speak("ყოჩაღ! ათივე დავალება შეასრულე.");
}

function renderVerticalBookCheck() {
  const challenge = verticalCheckChallenges[verticalCheckRound];
  content.innerHTML = `
    <div class="stage-panel vertical-book-check-stage">
      <div class="activity-area">
        <div class="instruction child-instruction"><span class="instruction-number">${verticalCheckRound + 1}</span><div><h3>რომელია სწორი? მონიშნე.</h3><p>${challenge.prompt}</p></div>${audioButton(challenge.voice)}</div>
        <div class="book-drag-check choice-mode">
          <figure class="book-check-picture">
            <img src="assets/book/check/${challenge.image}" alt="${challenge.alt}">
            <figcaption>სახელმძღვანელო, გვ. 8</figcaption>
          </figure>
          <div class="vertical-choice-panel">
            <p>${challenge.prompt}</p>
            <div class="vertical-word-tray" role="group" aria-label="პასუხის ვარიანტები">
              <button type="button" class="vertical-word-token up-word" data-vertical-word="up"><span>↑</span>ზევით</button>
              <button type="button" class="vertical-word-token down-word" data-vertical-word="down"><span>↓</span>ქვევით</button>
            </div>
          </div>
        </div>
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">წიგნიდან</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            ჯერ დააკვირდი, საით მოძრაობს ბავშვი ან საით არის მიმართული მოქმედება.
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note picture-note">
        <div class="vertical-star-counter" aria-live="polite"><span>★</span><div><strong id="verticalStarCount">${verticalCheckScore}</strong><small>4 ვარსკვლავიდან</small></div></div>
        <div class="check-progress"><strong>${verticalCheckRound + 1} / ${verticalCheckChallenges.length}</strong><div>${verticalCheckChallenges.map((_, index) => `<i class="${index < verticalCheckRound ? "done" : index === verticalCheckRound ? "now" : ""}"></i>`).join("")}</div></div>
        <div class="speech"><strong>როგორ შეამოწმო</strong>დააკვირდი წიგნის სურათს და მონიშნე ერთი სწორი პასუხი. სწორ პასუხზე ვარსკვლავს მიიღებ.</div>
      </aside>
    </div>`;
  bindAudio(content);
  bindVerticalChoiceCheck(challenge);
  announce(challenge.voice);
}

function bindVerticalChoiceCheck(challenge) {
  const tokens = [...content.querySelectorAll("[data-vertical-word]")];
  let answered = false;

  const submit = (word, token) => {
    if (answered || !word) return;
    if (word !== challenge.answer) {
      token?.classList.add("wrong");
      feedback(false, "კიდევ დააკვირდი სურათს: მოქმედება ზევითაა მიმართული თუ ქვევით?");
      speak("კიდევ დააკვირდი და სცადე.");
      window.setTimeout(() => token?.classList.remove("wrong"), 500);
      return;
    }
    answered = true;
    verticalCheckScore += 1;
    const count = content.querySelector("#verticalStarCount");
    if (count) count.textContent = verticalCheckScore;
    tokens.forEach(item => { item.disabled = true; });
    token.classList.add("correct");
    const star = document.createElement("div");
    star.className = "answer-star-pop";
    star.setAttribute("aria-hidden", "true");
    star.textContent = "★";
    content.querySelector(".book-drag-check")?.appendChild(star);
    window.setTimeout(() => star.remove(), 900);
    feedback(true, "სწორია! პასუხი წიგნის სურათს შეესაბამება.");
    speak("სწორია!");
    window.setTimeout(() => {
      verticalCheckRound += 1;
      if (verticalCheckRound < verticalCheckChallenges.length) renderVerticalBookCheck();
      else finishVerticalBookCheck();
    }, 750);
  };

  tokens.forEach(token => token.addEventListener("click", () => submit(token.dataset.verticalWord, token)));
}

function finishVerticalBookCheck() {
  award(3);
  content.innerHTML = `<div class="result-panel lesson-result"><div class="result-medal">⭐</div><div class="final-star-score">★ ${verticalCheckScore} / ${verticalCheckChallenges.length}</div><h3>ოთხივე მაგალითი სწორად შეასრულე!</h3><p>შენ წიგნის სურათებში არჩევ ზევით და ქვევით მიმართულებებს.</p><button class="primary-btn" id="nextLesson">შემდეგი გაკვეთილი →</button></div>`;
  content.querySelector("#nextLesson").addEventListener("click", () => parent.postMessage({type:'direction-navigate',mode:'comparison'},'*'));
  speak("ყოჩაღ! ოთხივე მაგალითი სწორად შეასრულე.");
}

function drawTask(lesson) {
  const board = document.querySelector("#practiceBoard");
  if (["horizontal", "vertical"].includes(lesson.mode)) {
    const keys = lesson.mode === "horizontal" ? ["left","between","right"] : ["above","middle","below"];
    board.innerHTML = `<div class="drop-board">${lesson.zones.map((z,i)=>`<div class="drop-zone" data-zone="${keys[i]}">${z}</div>`).join("")}</div><div class="drag-tray"><img class="drag-token draggable" draggable="true" src="${lesson.mode === "horizontal" ? asset("girl-neutral") : objectAsset("ball-orange")}" alt="გადასატანი ობიექტი"></div>`;
    enableDrag(board.querySelector(".draggable"), board.querySelectorAll(".drop-zone"), lesson.answer);
  } else if (lesson.mode === "container") {
    board.innerHTML = `<div class="drop-board" style="grid-template-columns:1fr 1fr"><div class="drop-zone" data-zone="outside">გარეთ</div><div class="drop-zone" data-zone="inside" style="border-style:solid;border-width:8px;border-top-width:2px">ყუთის შიგნით</div></div><div class="drag-tray"><img class="drag-token draggable" draggable="true" src="${objectAsset("ball-orange")}" alt="ბურთი"></div>`;
    enableDrag(board.querySelector(".draggable"), board.querySelectorAll(".drop-zone"), lesson.answer);
  } else {
    const choices = taskChoices(lesson.mode);
    board.innerHTML = `<div class="choice-grid">${choices.map((c,i)=>`<button class="choice" data-i="${i}">${c}</button>`).join("")}</div>`;
    board.querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => evaluateChoice(btn, Number(btn.dataset.i), lesson.answer)));
  }
}

function taskChoices(mode) {
  if (mode === "arrangement") return [
    `<div class="visual-choice"><img src="${asset("boy-neutral")}" height="90" alt="ბიჭი"><img src="${asset("girl-neutral")}" height="55" alt="გოგონა"></div>წინ და უკან`,
    `<div class="visual-choice"><img src="${asset("boy-neutral")}" height="85" alt="ბიჭი"><img src="${asset("girl-neutral")}" height="85" alt="გოგონა"></div>გვერდით`,
    `<div class="visual-choice"><img src="${asset("boy-neutral")}" height="55" alt="ბიჭი"><img src="${asset("girl-neutral")}" height="90" alt="გოგონა"></div>უკან და წინ`];
  if (mode === "size") return [
    `<div class="visual-choice"><img src="${objectAsset("basketball-large")}" height="105" alt="დიდი ბურთი"></div>დიდი`,
    `<div class="visual-choice"><img src="${objectAsset("ball-orange")}" height="58" alt="პატარა ბურთი"></div>პატარა`,
    `<div class="visual-choice"><img src="${objectAsset("cube-blue-large")}" height="78" alt="კუბიკი"></div>სხვა საგანი`];
  return [
    `<div class="visual-choice">${counterSet(5,"#ef6461")}</div>წითელი`,
    `<div class="visual-choice">${counterSet(3,"#398fd1")}</div>ლურჯი`,
    `<div class="visual-choice">${counterSet(4,"#51ad70")}</div>იმდენივე`];
}

function enableDrag(token, zones, correct) {
  let active = null;
  token.addEventListener("dragstart", () => active = token);
  zones.forEach(zone => {
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("hover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("hover"));
    zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("hover"); if(active){ zone.appendChild(active); evaluateDrop(zone, correct); } });
    zone.addEventListener("click", () => { zone.appendChild(token); evaluateDrop(zone, correct); });
  });
}

function evaluateDrop(zone, correct) {
  const ok = zone.dataset.zone === correct;
  zone.classList.toggle("correct", ok);
  feedback(ok, ok ? "სწორია! მდებარეობა ზუსტად განსაზღვრე." : "კიდევ დააკვირდი საყრდენ საგანს და სცადე თავიდან.");
  if (ok) award(2);
}

function evaluateChoice(button, selected, correct) {
  const ok = selected === correct;
  document.querySelectorAll(".choice").forEach(b => b.classList.remove("correct","wrong"));
  button.classList.add(ok ? "correct" : "wrong");
  feedback(ok, ok ? "სწორია! კარგად დააკვირდი სურათს." : "ჯერ შეადარე მხოლოდ ერთნაირი საგნები და სცადე კიდევ.");
  if (ok) award(2);
}

function feedback(ok, message) {
  const box = document.querySelector("#feedback");
  if (!box) return;
  box.hidden = false;
  box.className = `feedback ${ok ? "good" : "try"}`;
  box.textContent = message;
  showToast(ok ? "ყოჩაღ! ★" : "კიდევ ერთხელ სცადე");
}

function award(n) { scores[currentLesson] = Math.max(scores[currentLesson], n); stars.textContent = `${"★ ".repeat(scores[currentLesson])}${"☆ ".repeat(3 - scores[currentLesson])}`.trim(); }

function renderCheck(lesson) {
  if (currentLesson === 0) {
    relationRound = 0;
    relationScore = 0;
    renderObjectCheck();
    return;
  }
  if (currentLesson === 1) {
    verticalCheckRound = 0;
    verticalCheckScore = 0;
    renderVerticalBookCheck();
    return;
  }
  const q = quiz[currentLesson];
  content.innerHTML = `<div class="stage-panel"><div class="activity-area"><div class="instruction"><span class="instruction-number">3</span><div><h3>${q.q}</h3><p>აირჩიე ერთი პასუხი.</p></div></div><div class="choice-grid">${q.o.map((o,i)=>`<button class="choice" data-i="${i}">${o}</button>`).join("")}</div><div class="feedback" id="feedback">მზად ხარ? აირჩიე პასუხი.</div></div><aside class="side-note"><div class="speech"><strong>შეამოწმე თავი</strong>პასუხამდე ჩუმად თქვი, რას ხედავ სურათში ან ამოცანაში.</div><button class="primary-btn" id="nextLesson">${currentLesson < lessons.length - 1 ? "შემდეგი გაკვეთილი" : "თავის ვიქტორინა"}</button></aside></div>`;
  content.querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => {
    const ok = Number(btn.dataset.i) === q.a;
    content.querySelectorAll(".choice").forEach(b => b.classList.remove("correct","wrong"));
    btn.classList.add(ok ? "correct" : "wrong");
    feedback(ok, ok ? "სწორია — ცოდნა დამოუკიდებლად გამოიყენე!" : "ჯერ გაიხსენე ახსნა და კვლავ სცადე.");
    if (ok) award(3);
  }));
  content.querySelector("#nextLesson").addEventListener("click", () => currentLesson < lessons.length - 1 ? openLesson(currentLesson + 1) : openQuiz());
}

function setStage(stage) {
  if (currentLesson === 1 && stage === "practice" && currentStage !== "practice") {
    verticalPracticeRound = 0;
    verticalPracticeScore = 0;
    verticalPracticeMoves = { up: 0, down: 0 };
    upStairLevel = 0;
    downStairLevel = 4;
  }
  currentStage = stage;
  document.querySelectorAll(".stage-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.stage === stage));
  render();
}

document.querySelectorAll(".stage-tab").forEach(tab => tab.addEventListener("click", () => setStage(tab.dataset.stage)));

function openQuiz() {
  learningCard.hidden = true;
  quizCard.hidden = false;
  quizIndex = 0;
  quizAnswers = Array(quiz.length).fill(null);
  buildStrip();
  strip.lastElementChild.classList.add("active");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quiz[quizIndex];
  document.querySelector("#quizScore").textContent = `${quizAnswers.filter((a,i)=>a===quiz[i].a).length} / ${quiz.length}`;
  document.querySelector("#quizBody").innerHTML = `<div class="quiz-content"><div class="quiz-question"><p class="eyebrow">კითხვა ${quizIndex + 1} · ${quiz.length}-დან</p><h3>${q.q}</h3><div class="quiz-options">${q.o.map((o,i)=>`<button class="quiz-option ${quizAnswers[quizIndex]===i ? "selected" : ""}" data-i="${i}">${o}</button>`).join("")}</div></div><div class="quiz-actions"><button class="secondary-btn" id="prevQuiz" ${quizIndex===0?"disabled":""}>წინა</button><button class="primary-btn" id="nextQuiz">${quizIndex===quiz.length-1?"დასრულება":"შემდეგი"}</button></div></div>`;
  document.querySelectorAll(".quiz-option").forEach(btn => btn.addEventListener("click", () => { quizAnswers[quizIndex] = Number(btn.dataset.i); renderQuizQuestion(); }));
  document.querySelector("#prevQuiz").addEventListener("click", () => { if (quizIndex) { quizIndex--; renderQuizQuestion(); } });
  document.querySelector("#nextQuiz").addEventListener("click", () => {
    if (quizAnswers[quizIndex] === null) { showToast("ჯერ აირჩიე პასუხი"); return; }
    if (quizIndex < quiz.length-1) { quizIndex++; renderQuizQuestion(); } else renderQuizResult();
  });
}

function renderQuizResult() {
  const score = quizAnswers.filter((a,i)=>a===quiz[i].a).length;
  document.querySelector("#quizScore").textContent = `${score} / ${quiz.length}`;
  const msg = score === quiz.length ? "შესანიშნავია — ყველა ცნება კარგად გაიგე!" : score >= 4 ? "კარგია — კიდევ ერთხელ გაიხსენე რთული საკითხები." : "დაუბრუნდი ახსნას და მშვიდად ივარჯიშე.";
  document.querySelector("#quizBody").innerHTML = `<div class="result-panel"><div class="result-medal">${score===quiz.length?"🏆":score>=4?"⭐":"🌱"}</div><h3>${score} სწორი პასუხი</h3><p>${msg}</p><button class="primary-btn" id="retryQuiz">ვიქტორინის გამეორება</button></div>`;
  document.querySelector("#retryQuiz").addEventListener("click", openQuiz);
}

document.querySelector("#soundBtn").addEventListener("click", e => {
  if (!getGeorgianVoice()) {
    soundOn = false;
    e.currentTarget.textContent = "🔇";
    showToast("ქართული ხმა ამ ბრაუზერში არ არის");
    return;
  }
  soundOn = !soundOn;
  e.currentTarget.textContent = soundOn ? "🔊" : "🔇";
});

if (window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", syncAudioControls);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

openLesson(window.initialMode === "vertical" ? 1 : 0);
syncAudioControls();
