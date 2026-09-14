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
  {
    title: "ვისწავლოთ შედარება",
    short: "ვისწავლოთ შედარება",
    explain: "ორ ჯგუფს ვადარებთ დაწყვილებით: თითო საგანს მეორე ჯგუფიდან ერთ საგანს ვუწყვილებთ. თუ არაფერი დარჩა — იმდენივეა.",
    tip: "ჯერ დააწყვილე, მხოლოდ შემდეგ თქვი: მეტი, ნაკლები თუ იმდენივე.",
    task: "შეადარე ჯგუფები დაწყვილებით. რომელ ჯგუფშია მეტი?",
    answer: 0,
    mode: "pair"
  }
];

const quiz = [
  { q: "ნინო ლუკას მარჯვნივ დგას. სად დგას ლუკა ნინოს მიმართ?", a: 0, o: ["მარცხნივ", "მარჯვნივ", "შორის"] },
  { q: "ბურთი მაგიდის ზედა თაროზე დევს. სადაა ბურთი ქვედა თაროს მიმართ?", a: 1, o: ["ქვევით", "ზევით", "იმავე სიმაღლეზე"] },
  { q: "დაწყვილების შემდეგ არც ერთ ჯგუფში არაფერი დარჩა. რას ვასკვნით?", a: 2, o: ["ერთში მეტია", "ერთში ნაკლებია", "იმდენივეა"] }
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
let verticalLearnDirection = "up";
let verticalPracticeDirection = "up";
let verticalPracticeRound = 0;
let verticalPracticeScore = 0;
let verticalPracticeMoves = { up: 0, down: 0 };
let verticalCheckRound = 0;
let verticalCheckScore = 0;
let frontBackLearnStep = 0;
let frontBackLearnScene = "chair";
let frontBackMarked = { front: false, back: false };
let frontBackPracticeRound = 0;
let frontBackPracticeScore = 0;
let frontBackCheckRound = 0;
let frontBackCheckScore = 0;
let sizeLearnStep = 0;
let sizeLearnScene = "basketball-tennis";
let sizeLearnMarked = { big: false, small: false };
let sizePracticeRound = 0;
let sizePracticeScore = 0;
let sizePracticeMarkedIds = new Set();
let sizeCheckRound = 0;
let sizeCheckScore = 0;

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
  "assets/characters/girl-back-right-hand-up.png",
  "assets/characters/girl-back-left-hand-up.png",
  "assets/characters/girl-walk-back-left-foot.png",
  "assets/characters/girl-walk-back-right-foot.png",
  "assets/characters/boy-back.png",
  "assets/characters/boy-back-right-hand-up.png",
  "assets/characters/boy-back-left-hand-up.png",
  "assets/characters/boy-walk-back-left-foot.png",
  "assets/characters/boy-walk-back-right-foot.png",
  "assets/book/check/book-boy-up.png",
  "assets/book/check/book-girl-down.png",
  "assets/book/check/book-girl-hands-up.png",
  "assets/book/check/book-boy-jump-up.png"
];

// Defer secondary asset cache warming so initial render is instantaneous
function warmImageCacheLazily() {
  const secondaryUrls = [...motionAssetUrls, ...criticalCharacterUrls];
  let index = 0;
  function loadNextBatch() {
    const batch = secondaryUrls.slice(index, index + 3);
    index += 3;
    batch.forEach(src => {
      try {
        const image = new Image();
        image.src = src;
      } catch (_) {}
    });
    if (index < secondaryUrls.length) {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(loadNextBatch, { timeout: 2000 });
      } else {
        setTimeout(loadNextBatch, 250);
      }
    }
  }

  if (typeof window !== "undefined") {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadNextBatch, { timeout: 3000 });
    } else {
      setTimeout(loadNextBatch, 1500);
    }
  }
}

if (typeof window !== "undefined") {
  if (document.readyState === "complete") {
    warmImageCacheLazily();
  } else {
    window.addEventListener("load", warmImageCacheLazily, { once: true });
  }
}

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

let strip = document.querySelector("#lessonStrip");
let title = document.querySelector("#lessonTitle");
let count = document.querySelector("#lessonCount");
let content = document.querySelector("#stageContent");
let stars = document.querySelector("#stars");
let learningCard = document.querySelector(".learning-card");
let quizCard = document.querySelector("#chapterQuiz");
let toast = document.querySelector("#toast");
let soundButton = document.querySelector("#soundBtn");

function ensureDOMElements() {
  strip = document.querySelector("#lessonStrip");
  title = document.querySelector("#lessonTitle");
  count = document.querySelector("#lessonCount");
  content = document.querySelector("#stageContent");
  stars = document.querySelector("#stars");
  learningCard = document.querySelector(".learning-card");
  quizCard = document.querySelector("#chapterQuiz");
  toast = document.querySelector("#toast");
  soundButton = document.querySelector("#soundBtn");
}

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
  const btn = soundButton || document.querySelector("#soundBtn");
  if (btn) {
    btn.hidden = !available;
    btn.textContent = soundOn ? "🔊" : "🔇";
  }
}

function announce(message) {
  window.setTimeout(() => speak(message), 180);
}

function buildStrip() {
  ensureDOMElements();
  if (!strip) return;
  strip.innerHTML = "";
  lessons.forEach((lesson, i) => {
    const b = document.createElement("button");
    b.className = `lesson-pill ${i === currentLesson ? "active" : ""}`;
    b.textContent = `${i + 1}. ${lesson.short}`;
    b.addEventListener("click", () => openLesson(i));
    strip.appendChild(b);
  });
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
  verticalLearnDirection = "up";
  verticalPracticeDirection = "up";
  verticalPracticeRound = 0;
  verticalPracticeScore = 0;
  verticalPracticeMoves = { up: 0, down: 0 };
  verticalCheckRound = 0;
  verticalCheckScore = 0;
  frontBackLearnStep = 0;
  frontBackLearnScene = "chair";
  frontBackMarked = { front: false, back: false };
  frontBackPracticeRound = 0;
  frontBackPracticeScore = 0;
  frontBackCheckRound = 0;
  frontBackCheckScore = 0;
  sizeLearnStep = 0;
  sizeLearnScene = "basketball-tennis";
  sizeLearnMarked = { big: false, small: false };
  sizePracticeRound = 0;
  sizePracticeScore = 0;
  sizePracticeMarkedIds = new Set();
  sizeCheckRound = 0;
  sizeCheckScore = 0;
  if (quizCard) quizCard.hidden = true;
  if (learningCard) learningCard.hidden = false;
  document.querySelectorAll(".stage-tab").forEach((tab, k) => tab.classList.toggle("active", k === 0));
  render();
}

function render() {
  ensureDOMElements();
  if (!title || !count || !content) return;
  const lesson = lessons[currentLesson];
  title.textContent = lesson.title;
  count.textContent = `გაკვეთილი ${currentLesson + 1} · ${lessons.length}-დან`;
  if (stars) stars.textContent = `${"★ ".repeat(scores[currentLesson])}${"☆ ".repeat(3 - scores[currentLesson])}`.trim();
  buildStrip();
  const isComparison = lesson.mode === "pair" || currentLesson === lessons.length - 1;
  const stageTabs = document.querySelector('.stage-tabs');
  if (stageTabs) stageTabs.hidden = isComparison;
  if (stars) stars.hidden = isComparison;
  if (isComparison) {
    content.innerHTML = `<iframe id="comparisonFrame" src="comparison/comparison.html?muted=${!soundOn}" title="ვისწავლოთ შედარება" style="display:block;width:100%;min-height:1050px;height:1100px;border:0"></iframe>`;
    return;
  }
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
  const isUp = verticalLearnDirection === "up";
  const headingText = isUp ? "ადის ზევით" : "ჩადის ქვევით";
  const arrowClass = isUp ? "up-arrow" : "down-arrow";
  const arrowSymbol = isUp ? "↑" : "↓";
  const descText = isUp ? "ისარს ერთხელ დააჭირე — ერთი საფეხური ზევით." : "ისარს ერთხელ დააჭირე — ერთი საფეხური ქვევით.";
  const audioText = isUp ? "გოგო ადის ზევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ზევით." : "ბიჭი ჩადის ქვევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ქვევით.";

  content.innerHTML = `
    <div class="stage-panel stair-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">1</span>
          <div>
            <h3 class="stair-heading">
              <span>${headingText}</span>
              <span class="stair-title-arrow ${arrowClass}" title="ისარი ${isUp ? "ზევით" : "ქვევით"}" aria-hidden="true">${arrowSymbol}</span>
            </h3>
            <p>${descText}</p>
          </div>
          ${audioButton(audioText)}
        </div>
        <div class="single-stair-board">
          ${isUp ? `
            <section class="stair-demo-card up-demo" data-stair-demo="up">
              <h4>გოგო ადის ზევით</h4>
              <div class="stair-demo-action">
                ${staircaseMarkup(upStairLevel, "upStairAvatar", "up")}
                <button class="stair-control stair-up" type="button" data-stair-move="up" aria-label="გოგო ერთი საფეხურით ზევით">
                  <span>↑</span><small>ზევით</small>
                </button>
              </div>
            </section>
          ` : `
            <section class="stair-demo-card down-demo" data-stair-demo="down">
              <h4>ბიჭი ჩადის ქვევით</h4>
              <div class="stair-demo-action">
                ${staircaseMarkup(downStairLevel, "downStairAvatar", "down")}
                <button class="stair-control stair-down" type="button" data-stair-move="down" aria-label="ბიჭი ერთი საფეხურით ქვევით">
                  <span>↓</span><small>ქვევით</small>
                </button>
              </div>
            </section>
          `}
        </div>
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">მინიშნება</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            მარჯვნიდან აირჩიე პერსონაჟი: <strong>გოგო (ზევით ასვლა ↑)</strong> ან <strong>ბიჭი (ქვევით ჩამოსვლა ↓)</strong>.
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note book-stair-note">
        <div class="speech"><strong>წიგნის მოდელი</strong>კიბეზე რიცხვები 1-იდან 5-მდე იზრდება. შეარჩიე:</div>
        
        <figure class="stair-choice-card ${isUp ? "active" : ""}" data-select-learn-dir="up" role="button" tabindex="0" aria-label="გოგო: ზევით ასვლა">
          ${isUp ? `<span class="active-indicator">არჩეულია ✓</span>` : ""}
          <img src="assets/book/staircase-up-book.png" alt="წიგნის ნახატი: მოსწავლე კიბეზე ზევით ადის">
          <figcaption>
            <strong>ზევით ასვლა ↑</strong>
            <small style="color:var(--muted)">გოგო ადის ზევით</small>
          </figcaption>
        </figure>

        <figure class="stair-choice-card ${!isUp ? "active" : ""}" data-select-learn-dir="down" role="button" tabindex="0" aria-label="ბიჭი: ქვევით ჩამოსვლა">
          ${!isUp ? `<span class="active-indicator">არჩეულია ✓</span>` : ""}
          <img src="assets/book/staircase-down-book.png" alt="წიგნის ნახატი: მოსწავლე კიბეზე ქვევით ჩამოდის">
          <figcaption>
            <strong>ქვევით ჩამოსვლა ↓</strong>
            <small style="color:var(--muted)">ბიჭი ჩადის ქვევით</small>
          </figcaption>
        </figure>

        <button class="primary-btn" data-next-stage>ახლა ივარჯიშე →</button>
      </aside>
    </div>`;

  bindAudio(content);
  bindStairControls(false);

  content.querySelectorAll("[data-select-learn-dir]").forEach(card => {
    card.addEventListener("click", () => {
      const dir = card.dataset.selectLearnDir;
      if (verticalLearnDirection === dir) return;
      verticalLearnDirection = dir;
      renderVerticalStairsLearn();
      speak(dir === "up" ? "გოგო ადის ზევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ზევით." : "ბიჭი ჩადის ქვევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ქვევით.");
    });
  });

  content.querySelector("[data-next-stage]").addEventListener("click", () => {
    verticalPracticeRound = 0;
    verticalPracticeScore = 0;
    verticalPracticeMoves = { up: 0, down: 0 };
    verticalPracticeDirection = "up";
    upStairLevel = 0;
    downStairLevel = 4;
    setStage("practice");
  });
  announce(isUp ? "ადის ზევით." : "ჩადის ქვევით.");
}

function bindStairControls(practice = false) {
  content.querySelectorAll("[data-stair-move]").forEach(button => button.addEventListener("click", () => {
    moveOneStair(button.dataset.stairMove, practice);
  }));
}

function moveOneStair(direction, practice = false) {
  const current = direction === "up" ? upStairLevel : downStairLevel;
  const delta = direction === "up" ? 1 : -1;
  const next = Math.max(0, Math.min(4, current + delta));
  if (next === current) {
    feedback(false, direction === "up" ? "კიბის თავში ხარ." : "კიბის ძირში ხარ.");
    speak(direction === "up" ? "კიბის თავში ხარ." : "კიბის ძირში ხარ.");
    return false;
  }
  const demo = content.querySelector(`[data-stair-demo="${direction}"]`) || content.querySelector("[data-stair-demo]");
  if (!demo) return false;
  const avatar = demo.querySelector(".stair-avatar");
  const buttons = content.querySelectorAll("[data-stair-move]");
  buttons.forEach(button => { button.disabled = true; });
  stairGait += 1;
  stairGaitByDirection[direction] = (stairGaitByDirection[direction] || 0) + 1;
  const phase = stairGaitByDirection[direction];
  avatar.classList.add(phase % 2 ? "step-a" : "step-b");
  avatar.src = verticalActor === "rabbit" ? stairCharacterAsset(direction, 1) : stairCharacterAsset(direction, phase);
  if (direction === "up") upStairLevel = next;
  else downStairLevel = next;
  const board = demo.querySelector(".number-staircase");
  board.className = `number-staircase ${direction === "down" ? "descending" : "ascending"} level-${next}`;
  board.dataset.level = next;
  const word = direction === "up" ? "ზევით" : "ქვევით";
  const message = verticalActor === "rabbit"
    ? direction === "up"
      ? "კურდღელი ასკუპდა ზევით და დადგა საფეხურზე."
      : "კურდღელი ჩამოსკუპდა ქვევით და დადგა საფეხურზე."
    : `ერთი საფეხური ${word} — ფეხი შეცვალა და დადგა.`;
  feedback(true, message);
  speak(message);
  window.setTimeout(() => {
    if (verticalActor === "rabbit") avatar.src = stairCharacterAsset(direction, 0);
    avatar.classList.remove("step-a", "step-b");
    buttons.forEach(button => { button.disabled = false; });
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
            <button class="hand-hotspot left-hand" data-hand="left" aria-label="მარცხენა ხელის აწევა" title="მარცხენა ხელის აწევა"><span></span></button>
            <button class="hand-hotspot right-hand" data-hand="right" aria-label="მარჯვენა ხელის აწევა" title="მარჯვენა ხელის აწევა"><span></span></button>
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
            დააჭირე ღილაკებს „მარცხენა ხელი“ ან „მარჯვენა ხელი“ (ან ყვითელ წრეებს), რომ პერსონაჟმა ხელი ასწიოს. ისარი ერთ ნაბიჯს ადგმევინებს.
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
  let handTimer = null;
  content.querySelectorAll("[data-hand]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.hand;
    const avatar = content.querySelector("#handAvatar");
    if (!avatar) return;

    if (handTimer) {
      clearTimeout(handTimer);
      handTimer = null;
    }

    const alreadyActive = button.classList.contains("active") || avatar.getAttribute("data-raised-hand") === chosen;
    if (alreadyActive) {
      avatar.src = currentBackWalkAsset();
      avatar.removeAttribute("data-raised-hand");
      content.querySelectorAll("[data-hand]").forEach(b => b.classList.remove("active"));
      const charName = selectedCharacter === "girl" ? "გოგომ" : "ბიჭმა";
      feedback(true, `${charName} ჩამოუშვა ხელი.`);
      speak(`${charName} ჩამოუშვა ხელი.`);
      return;
    }

    avatar.className = "back-avatar";
    avatar.src = currentCharacterAsset(`back-${chosen}-hand-up`);
    avatar.setAttribute("data-raised-hand", chosen);

    content.querySelectorAll("[data-hand]").forEach(b => {
      b.classList.toggle("active", b.dataset.hand === chosen);
    });

    const charName = selectedCharacter === "girl" ? "გოგომ" : "ბიჭმა";
    const word = chosen === "right" ? "მარჯვენა" : "მარცხენა";
    feedback(true, `${charName} ასწია ${word} ხელი! ✋`);
    speak(`${charName} ასწია ${word} ხელი.`);
    playAudioTone("success");

    handTimer = window.setTimeout(() => {
      avatar.src = currentBackWalkAsset();
      avatar.removeAttribute("data-raised-hand");
      content.querySelectorAll("[data-hand]").forEach(b => b.classList.remove("active"));
      handTimer = null;
    }, 3000);
  }));
  content.querySelectorAll("[data-move]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.move;
    const avatar = content.querySelector("#handAvatar");
    if (handTimer) {
      clearTimeout(handTimer);
      handTimer = null;
    }
    if (avatar) avatar.removeAttribute("data-raised-hand");
    content.querySelectorAll("[data-hand]").forEach(b => b.classList.remove("active"));
    content.querySelectorAll("[data-move]").forEach(control => { control.disabled = true; });
    const moved = startWalking(avatar, chosen, true);
    const word = chosen === "right" ? "მარჯვნივ" : "მარცხნივ";
    feedback(moved, moved ? `ერთი ნაბიჯი ${word} — ფეხი გაშალა და დადგა.` : "აქ გაჩერდი. მეორე მხარეს წადი.");
    speak(moved ? `ერთი ნაბიჯი ${word}. ფეხი გაშალა და დადგა.` : "აქ გაჩერდი.");
    window.setTimeout(() => {
      content.querySelectorAll("[data-move]").forEach(control => { control.disabled = false; });
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
  const completed = verticalPracticeMoves.up >= 2 && verticalPracticeMoves.down >= 2;
  const isUp = verticalPracticeDirection === "up";
  const headingText = isUp ? "კურდღელი ადის ზევით" : "კურდღელი ჩადის ქვევით";
  const arrowClass = isUp ? "up-arrow" : "down-arrow";
  const arrowSymbol = isUp ? "↑" : "↓";
  const descText = isUp
    ? "ისარს ერთხელ დააჭირე — კურდღელი ასკუპდება ერთი საფეხურით ზევით."
    : "ისარს ერთხელ დააჭირე — კურდღელი ჩამოსკუპდება ერთი საფეხურით ქვევით.";
  const audioText = isUp
    ? "კურდღელი ადის ზევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ზევით."
    : "კურდღელი ჩადის ქვევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ქვევით.";

  content.innerHTML = `
    <div class="stage-panel stair-stage">
      <div class="activity-area">
        <div class="instruction child-instruction practice-command">
          <span class="instruction-number">2</span>
          <div>
            <h3 class="stair-heading">
              <span>${headingText}</span>
              <span class="stair-title-arrow ${arrowClass}" title="ისარი ${isUp ? "ზევით" : "ქვევით"}" aria-hidden="true">${arrowSymbol}</span>
            </h3>
            <p>${descText}</p>
          </div>
          ${audioButton(audioText)}
        </div>
        <div class="single-stair-board practice-single-stair">
          ${isUp ? `
            <section class="stair-demo-card up-demo" data-stair-demo="up">
              <h4>კურდღელი ასკუპდება ზევით</h4>
              <div class="stair-demo-action">
                ${staircaseMarkup(upStairLevel, "practiceUpStairAvatar", "up")}
                <button class="stair-control stair-up" type="button" data-stair-move="up" data-practice-stair-move="up" aria-label="ერთი საფეხურით ზევით">
                  <span>↑</span><small>ზევით</small>
                </button>
              </div>
            </section>
          ` : `
            <section class="stair-demo-card down-demo" data-stair-demo="down">
              <h4>კურდღელი ჩამოსკუპდება ქვევით</h4>
              <div class="stair-demo-action">
                ${staircaseMarkup(downStairLevel, "practiceDownStairAvatar", "down")}
                <button class="stair-control stair-down" type="button" data-stair-move="down" data-practice-stair-move="down" aria-label="ერთი საფეხურით ქვევით">
                  <span>↓</span><small>ქვევით</small>
                </button>
              </div>
            </section>
          `}
        </div>
        <details class="hint-box">
          <summary>
            <span class="hint-icon" aria-hidden="true">💡</span>
            <span class="hint-title">მინიშნება</span>
            <span class="hint-badge">დააჭირე სანახავად</span>
            <span class="hint-arrow">▼</span>
          </summary>
          <div class="hint-content">
            მარჯვენა ბარათებიდან შეგიძლია აირჩიო მიმართულება: <strong>ზევით ასვლა ↑</strong> ან <strong>ქვევით ჩამოსვლა ↓</strong>.
          </div>
        </details>
        <div class="feedback" id="feedback" hidden></div>
      </div>
      <aside class="side-note book-stair-note">
        <div class="check-progress">
          <strong id="stairPracticeProgress">${verticalPracticeScore} / 4</strong>
          <div>
            ${Array.from({ length: 4 }, (_, index) => `<i class="${index < verticalPracticeScore ? "done" : ""}" data-practice-dot></i>`).join("")}
          </div>
        </div>
        <div class="speech">
          <strong>ივარჯიშე ორივე მიმართულებით</strong>
          კურდღელი 2-ჯერ აასკუპე ზევით და 2-ჯერ ჩამოსკუპე ქვევით.
        </div>

        <figure class="stair-choice-card ${isUp ? "active" : ""}" data-select-practice-dir="up" role="button" tabindex="0" aria-label="კურდღელი: ზევით ასვლა">
          ${isUp ? `<span class="active-indicator">არჩეულია ✓</span>` : ""}
          <div class="rabbit-card-preview">
            <img src="assets/objects/rabbit-hop.png?v=${motionAssetVersion}" alt="კურდღელი ასკუპდება ზევით" style="width:72px;height:72px;object-fit:contain;">
          </div>
          <figcaption>
            <strong>ზევით ასვლა ↑</strong>
            <small style="color:${verticalPracticeMoves.up >= 2 ? "#15803d" : "var(--muted)"};font-weight:800;">
              ${verticalPracticeMoves.up >= 2 ? "✓ შესრულებულია" : `${verticalPracticeMoves.up} / 2`}
            </small>
          </figcaption>
        </figure>

        <figure class="stair-choice-card ${!isUp ? "active" : ""}" data-select-practice-dir="down" role="button" tabindex="0" aria-label="კურდღელი: ქვევით ჩამოსვლა">
          ${!isUp ? `<span class="active-indicator">არჩეულია ✓</span>` : ""}
          <div class="rabbit-card-preview">
            <img src="assets/objects/rabbit-land.png?v=${motionAssetVersion}" alt="კურდღელი ჩამოსკუპდება ქვევით" style="width:72px;height:72px;object-fit:contain;transform:scaleX(-1);">
          </div>
          <figcaption>
            <strong>ქვევით ჩამოსვლა ↓</strong>
            <small style="color:${verticalPracticeMoves.down >= 2 ? "#15803d" : "var(--muted)"};font-weight:800;">
              ${verticalPracticeMoves.down >= 2 ? "✓ შესრულებულია" : `${verticalPracticeMoves.down} / 2`}
            </small>
          </figcaption>
        </figure>

        <button class="primary-btn" id="stairPracticeCheck" ${completed ? "" : "disabled"}>მოკლე შემოწმება →</button>
      </aside>
    </div>`;

  bindAudio(content);

  content.querySelectorAll("[data-select-practice-dir]").forEach(card => {
    card.addEventListener("click", () => {
      const dir = card.dataset.selectPracticeDir;
      if (verticalPracticeDirection === dir) return;
      verticalPracticeDirection = dir;
      renderVerticalPractice();
      speak(dir === "up" ? "კურდღელი ადის ზევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ზევით." : "კურდღელი ჩადის ქვევით. ისარს ერთხელ დააჭირე — ერთი საფეხური ქვევით.");
    });
  });

  content.querySelectorAll("[data-practice-stair-move]").forEach(button => button.addEventListener("click", () => {
    const chosen = button.dataset.stairMove;
    if (!moveOneStair(chosen, false)) return;
    verticalPracticeMoves[chosen] += 1;
    verticalPracticeScore = Math.min(verticalPracticeMoves.up, 2) + Math.min(verticalPracticeMoves.down, 2);
    const progress = content.querySelector("#stairPracticeProgress");
    if (progress) progress.textContent = `${verticalPracticeScore} / 4`;
    content.querySelectorAll("[data-practice-dot]").forEach((dot, index) => dot.classList.toggle("done", index < verticalPracticeScore));

    const upSmall = content.querySelector('[data-select-practice-dir="up"] small');
    if (upSmall) {
      upSmall.textContent = verticalPracticeMoves.up >= 2 ? "✓ შესრულებულია" : `${verticalPracticeMoves.up} / 2`;
      if (verticalPracticeMoves.up >= 2) upSmall.style.color = "#15803d";
    }
    const downSmall = content.querySelector('[data-select-practice-dir="down"] small');
    if (downSmall) {
      downSmall.textContent = verticalPracticeMoves.down >= 2 ? "✓ შესრულებულია" : `${verticalPracticeMoves.down} / 2`;
      if (verticalPracticeMoves.down >= 2) downSmall.style.color = "#15803d";
    }

    if (verticalPracticeMoves.up >= 2 && verticalPracticeMoves.down >= 2) {
      award(2);
      playAudioTone("complete");
      const checkButton = content.querySelector("#stairPracticeCheck");
      if (checkButton) checkButton.disabled = false;
      feedback(true, "ყოჩაღ! კურდღელი ორივე მიმართულებით ამოძრავე.");
      speak("ყოჩაღ! კურდღელი ორივე მიმართულებით ამოძრავე. გადადი შემოწმებაზე.");
    } else if (chosen === "up" && verticalPracticeMoves.up >= 2 && verticalPracticeMoves.down < 2) {
      feedback(true, "ყოჩაღ! ზევით ასვლა შესრულებულია. ახლა მარჯვნიდან აირჩიე „ქვევით ჩამოსვლა“.");
      speak("ყოჩაღ! ზევით ასვლა შესრულებულია. ახლა მარჯვნიდან აირჩიე ქვევით ჩამოსვლა.");
      window.setTimeout(() => {
        if (verticalPracticeMoves.down < 2 && verticalPracticeDirection === "up") {
          verticalPracticeDirection = "down";
          renderVerticalPractice();
        }
      }, 1300);
    } else if (chosen === "down" && verticalPracticeMoves.down >= 2 && verticalPracticeMoves.up < 2) {
      feedback(true, "ყოჩაღ! ქვევით ჩამოსვლა შესრულებულია. ახლა მარჯვნიდან აირჩიე „ზევით ასვლა“.");
      speak("ყოჩაღ! ქვევით ჩამოსვლა შესრულებულია. ახლა მარჯვნიდან აირჩიე ზევით ასვლა.");
      window.setTimeout(() => {
        if (verticalPracticeMoves.up < 2 && verticalPracticeDirection === "down") {
          verticalPracticeDirection = "up";
          renderVerticalPractice();
        }
      }, 1300);
    }
  }));

  content.querySelector("#stairPracticeCheck").addEventListener("click", () => setStage("check"));
  announce(isUp ? "კურდღელი ადის ზევით." : "კურდღელი ჩადის ქვევით.");
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
  content.querySelector("#nextLesson").addEventListener("click", () => openLesson(1));
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
  content.querySelector("#nextLesson").addEventListener("click", () => openLesson(1));
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
  content.querySelector("#nextLesson").addEventListener("click", () => openLesson(2));
  speak("ყოჩაღ! ოთხივე მაგალითი სწორად შეასრულე.");
}

// Front/Back Audio Tone Synthesizer
function playAudioTone(type = "success") {
  if (!soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "complete") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      osc.frequency.setValueAtTime(1046.50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (_) {}
}

// Front/Back High-Quality SVG Visuals
function svgTree(w = 220, h = 250) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 220 250" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ხე">
    <path d="M96 150 C96 195 72 235 55 245 C80 244 140 244 165 245 C148 235 124 195 124 150 Z" fill="#8c5836"/>
    <path d="M104 160 C104 190 85 228 72 242" stroke="#683d20" stroke-width="4" stroke-linecap="round"/>
    <path d="M116 160 C116 190 135 228 148 242" stroke="#683d20" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="110" cy="245" rx="65" ry="5" fill="#4d7c0f" opacity="0.3"/>
    <circle cx="68" cy="130" r="48" fill="#2d6a4f"/>
    <circle cx="152" cy="130" r="48" fill="#2d6a4f"/>
    <circle cx="65" cy="82" r="46" fill="#388e3c"/>
    <circle cx="155" cy="82" r="46" fill="#388e3c"/>
    <circle cx="110" cy="120" r="54" fill="#40916c"/>
    <circle cx="110" cy="65" r="52" fill="#52b788"/>
    <circle cx="100" cy="50" r="32" fill="#74c69d" opacity="0.85"/>
    <circle cx="60" cy="72" r="24" fill="#74c69d" opacity="0.75"/>
    <circle cx="155" cy="72" r="24" fill="#74c69d" opacity="0.75"/>
    <circle cx="75" cy="95" r="9" fill="#e63946"/><circle cx="73" cy="92" r="3" fill="#ffb703" opacity="0.8"/>
    <circle cx="145" cy="90" r="9" fill="#e63946"/><circle cx="143" cy="87" r="3" fill="#ffb703" opacity="0.8"/>
    <circle cx="115" cy="80" r="9" fill="#e63946"/><circle cx="113" cy="77" r="3" fill="#ffb703" opacity="0.8"/>
    <circle cx="95" cy="130" r="9" fill="#e63946"/><circle cx="93" cy="127" r="3" fill="#ffb703" opacity="0.8"/>
    <circle cx="138" cy="135" r="9" fill="#e63946"/><circle cx="136" cy="132" r="3" fill="#ffb703" opacity="0.8"/>
  </svg>`;
}

function svgDog(w = 130, h = 140) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 130 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ძაღლი">
    <path d="M102 96 C118 90 128 72 122 62 C116 54 108 65 102 80" stroke="#d97706" stroke-width="12" stroke-linecap="round"/>
    <path d="M120 64 C124 58 128 62 122 70" stroke="#fef3c7" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="70" cy="96" rx="34" ry="32" fill="#f59e0b"/>
    <ellipse cx="64" cy="98" rx="20" ry="24" fill="#fef3c7"/>
    <ellipse cx="46" cy="126" rx="14" ry="9" fill="#d97706"/>
    <ellipse cx="46" cy="125" rx="12" ry="7" fill="#fef3c7"/>
    <ellipse cx="80" cy="126" rx="14" ry="9" fill="#d97706"/>
    <ellipse cx="80" cy="125" rx="12" ry="7" fill="#fef3c7"/>
    <path d="M46 72 C58 82 74 82 86 72" stroke="#dc2626" stroke-width="8" stroke-linecap="round"/>
    <circle cx="66" cy="80" r="5.5" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/>
    <circle cx="65" cy="50" r="28" fill="#f59e0b"/>
    <ellipse cx="40" cy="52" rx="10" ry="20" fill="#b45309" transform="rotate(15 40 52)"/>
    <ellipse cx="90" cy="52" rx="10" ry="20" fill="#b45309" transform="rotate(-15 90 52)"/>
    <ellipse cx="65" cy="57" rx="15" ry="12" fill="#fef3c7"/>
    <ellipse cx="65" cy="52" rx="6" ry="4.5" fill="#1e293b"/>
    <circle cx="63" cy="50.5" r="1.5" fill="white"/>
    <path d="M65 56.5 L65 62 M61 62 C63 64 67 64 69 62" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
    <circle cx="54" cy="44" r="5" fill="#1e293b"/>
    <circle cx="52.5" cy="42.5" r="2" fill="white"/>
    <circle cx="76" cy="44" r="5" fill="#1e293b"/>
    <circle cx="74.5" cy="42.5" r="2" fill="white"/>
    <circle cx="47" cy="55" r="4" fill="#f87171" opacity="0.6"/>
    <circle cx="83" cy="55" r="4" fill="#f87171" opacity="0.6"/>
  </svg>`;
}

function svgBear(w = 135, h = 145) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 135 145" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="დათვი">
    <ellipse cx="68" cy="100" rx="42" ry="38" fill="#78350f"/>
    <ellipse cx="68" cy="102" rx="26" ry="28" fill="#92400e"/>
    <ellipse cx="68" cy="104" rx="18" ry="20" fill="#d97706" opacity="0.7"/>
    <circle cx="40" cy="38" r="16" fill="#78350f"/>
    <circle cx="40" cy="38" r="9" fill="#fde68a"/>
    <circle cx="96" cy="38" r="16" fill="#78350f"/>
    <circle cx="96" cy="38" r="9" fill="#fde68a"/>
    <circle cx="68" cy="56" r="32" fill="#78350f"/>
    <ellipse cx="68" cy="64" rx="18" ry="14" fill="#fde68a"/>
    <ellipse cx="68" cy="59" rx="8" ry="6" fill="#1e293b"/>
    <circle cx="65.5" cy="57" r="2" fill="white"/>
    <path d="M68 65 L68 70 M62 70 C65 73 71 73 74 70" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="54" cy="49" r="4.5" fill="#1e293b"/>
    <circle cx="52.5" cy="47.5" r="1.8" fill="white"/>
    <circle cx="82" cy="49" r="4.5" fill="#1e293b"/>
    <circle cx="80.5" cy="47.5" r="1.8" fill="white"/>
    <ellipse cx="26" cy="74" rx="12" ry="16" fill="#78350f" transform="rotate(-25 26 74)"/>
    <ellipse cx="26" cy="74" rx="7" ry="10" fill="#92400e" transform="rotate(-25 26 74)"/>
    <ellipse cx="110" cy="74" rx="12" ry="16" fill="#78350f" transform="rotate(25 110 74)"/>
    <ellipse cx="110" cy="74" rx="7" ry="10" fill="#92400e" transform="rotate(25 110 74)"/>
  </svg>`;
}

function svgFence(w = 260, h = 180) {
  const pickets = [20, 58, 96, 134, 172, 210].map(x => `
    <path d="M${x} 40 L${x + 14} 20 L${x + 28} 40 L${x + 28} 165 L${x} 165 Z" fill="#d97706" stroke="#92400e" stroke-width="2"/>
    <line x1="${x + 14}" y1="45" x2="${x + 14}" y2="155" stroke="#b45309" stroke-width="2" stroke-dasharray="8 6"/>
  `).join("");
  return `<svg width="${w}" height="${h}" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ღობე">
    <rect x="10" y="65" width="240" height="16" rx="4" fill="#b45309"/>
    <rect x="10" y="115" width="240" height="16" rx="4" fill="#b45309"/>
    ${pickets}
    <path d="M5 168 Q15 150 25 168 Q35 152 45 168" stroke="#4d7c0f" stroke-width="4" stroke-linecap="round"/>
    <path d="M120 168 Q130 148 140 168 Q150 150 160 168" stroke="#4d7c0f" stroke-width="4" stroke-linecap="round"/>
    <path d="M215 168 Q225 152 235 168 Q245 150 255 168" stroke="#4d7c0f" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

function svgCat(w = 120, h = 135) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 120 135" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="კატა">
    <path d="M92 98 C108 92 118 78 114 62 C110 52 102 58 100 70" stroke="#f97316" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="62" cy="94" rx="30" ry="28" fill="#ea580c"/>
    <ellipse cx="58" cy="96" rx="18" ry="20" fill="#fed7aa"/>
    <ellipse cx="44" cy="120" rx="11" ry="8" fill="#ea580c"/>
    <ellipse cx="44" cy="119" rx="8" ry="5" fill="#fff7ed"/>
    <ellipse cx="72" cy="120" rx="11" ry="8" fill="#ea580c"/>
    <ellipse cx="72" cy="119" rx="8" ry="5" fill="#fff7ed"/>
    <path d="M42 42 L32 18 L54 30 Z" fill="#ea580c"/>
    <path d="M42 38 L36 24 L50 32 Z" fill="#fbcfe8"/>
    <path d="M78 42 L88 18 L66 30 Z" fill="#ea580c"/>
    <path d="M78 38 L84 24 L70 32 Z" fill="#fbcfe8"/>
    <circle cx="60" cy="50" r="26" fill="#ea580c"/>
    <ellipse cx="50" cy="46" rx="4.5" ry="5.5" fill="#15803d"/>
    <circle cx="50" cy="46" r="2.5" fill="#1e293b"/>
    <circle cx="48.5" cy="44.5" r="1.5" fill="white"/>
    <ellipse cx="70" cy="46" rx="4.5" ry="5.5" fill="#15803d"/>
    <circle cx="70" cy="46" r="2.5" fill="#1e293b"/>
    <circle cx="68.5" cy="44.5" r="1.5" fill="white"/>
    <path d="M57 54 L63 54 L60 58 Z" fill="#f43f5e"/>
    <path d="M60 58 C58 61 54 61 52 59 M60 58 C62 61 66 61 68 59" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
    <line x1="32" y1="52" x2="48" y2="55" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="30" y1="58" x2="48" y2="58" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="88" y1="52" x2="72" y2="55" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="90" y1="58" x2="72" y2="58" stroke="#78350f" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

function svgRabbit(w = 110, h = 135) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 110 135" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="კურდღელი">
    <ellipse cx="44" cy="28" rx="8" ry="24" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
    <ellipse cx="44" cy="28" rx="4.5" ry="17" fill="#fbcfe8"/>
    <ellipse cx="66" cy="28" rx="8" ry="24" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
    <ellipse cx="66" cy="28" rx="4.5" ry="17" fill="#fbcfe8"/>
    <circle cx="86" cy="100" r="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <ellipse cx="55" cy="92" rx="28" ry="26" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <circle cx="55" cy="56" r="24" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
    <ellipse cx="42" cy="116" rx="12" ry="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <ellipse cx="68" cy="116" rx="12" ry="7" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
    <circle cx="47" cy="52" r="4" fill="#9333ea"/>
    <circle cx="45.5" cy="50.5" r="1.5" fill="white"/>
    <circle cx="63" cy="52" r="4" fill="#9333ea"/>
    <circle cx="61.5" cy="50.5" r="1.5" fill="white"/>
    <polygon points="53,59 57,59 55,62" fill="#f43f5e"/>
    <path d="M55 62 C53 65 50 65 48 63 M55 62 C57 65 60 65 62 63" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="42" cy="58" r="3.5" fill="#fbcfe8" opacity="0.8"/>
    <circle cx="68" cy="58" r="3.5" fill="#fbcfe8" opacity="0.8"/>
  </svg>`;
}

function svgChair(w = 140, h = 180) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="სკამი">
    <line x1="38" y1="40" x2="32" y2="170" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
    <line x1="102" y1="40" x2="108" y2="170" stroke="#78350f" stroke-width="7" stroke-linecap="round"/>
    <rect x="36" y="25" width="68" height="14" rx="4" fill="#b45309"/>
    <rect x="42" y="45" width="10" height="40" rx="3" fill="#d97706"/>
    <rect x="65" y="45" width="10" height="40" rx="3" fill="#d97706"/>
    <rect x="88" y="45" width="10" height="40" rx="3" fill="#d97706"/>
    <path d="M24 92 C24 88 116 88 116 92 L110 108 C110 112 30 112 30 108 Z" fill="#0284c7"/>
    <path d="M26 94 C26 90 114 90 114 94 L108 102 C108 106 32 106 32 102 Z" fill="#38bdf8"/>
    <line x1="32" y1="108" x2="28" y2="172" stroke="#92400e" stroke-width="8" stroke-linecap="round"/>
    <line x1="108" y1="108" x2="112" y2="172" stroke="#92400e" stroke-width="8" stroke-linecap="round"/>
    <line x1="30" y1="140" x2="110" y2="140" stroke="#78350f" stroke-width="5" stroke-linecap="round"/>
  </svg>`;
}

function svgBall(w = 95, h = 95) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 95 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ბურთი">
    <circle cx="47" cy="47" r="42" fill="#ea580c" stroke="#c2410c" stroke-width="3"/>
    <path d="M47 5 C47 5 30 25 30 47 C30 69 47 89 47 89" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <path d="M47 5 C47 5 64 25 64 47 C64 69 47 89 47 89" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
    <line x1="5" y1="47" x2="89" y2="47" stroke="#fff" stroke-width="6"/>
    <ellipse cx="32" cy="24" rx="10" ry="5" fill="#fff" opacity="0.6" transform="rotate(-30 32 24)"/>
  </svg>`;
}

function svgBag(w = 100, h = 120) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ჩანთა">
    <path d="M40 25 C40 12 60 12 60 25" stroke="#475569" stroke-width="6" stroke-linecap="round" fill="none"/>
    <rect x="18" y="24" width="64" height="85" rx="16" fill="#8b5cf6"/>
    <path d="M18 36 C18 24 82 24 82 36 L80 62 C80 68 20 68 20 62 Z" fill="#7c3aed"/>
    <rect x="44" y="55" width="12" height="16" rx="3" fill="#fbbf24"/>
    <rect x="26" y="74" width="48" height="28" rx="8" fill="#a78bfa"/>
    <line x1="32" y1="80" x2="68" y2="80" stroke="#6d28d9" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function svgMarchingKids(w = 260, h = 180) {
  return `<svg width="${w}" height="${h}" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ბავშვები მიდიან">
    <path d="M40 25 L210 25 M195 15 L220 25 L195 35" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="110" y="20" fill="#2563eb" font-size="14" font-weight="900" text-anchor="middle">მოძრაობა წინ →</text>
    <g transform="translate(45, 40)">
      <circle cx="35" cy="25" r="16" fill="#fbcfe8"/>
      <path d="M22 22 Q35 10 48 22" fill="#78350f"/>
      <rect x="25" y="44" width="20" height="34" rx="6" fill="#0284c7"/>
      <line x1="28" y1="78" x2="22" y2="115" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <line x1="42" y1="78" x2="48" y2="115" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <text x="35" y="132" fill="#64748b" font-size="13" font-weight="800" text-anchor="middle">ბიჭი (უკან)</text>
    </g>
    <g transform="translate(145, 40)">
      <circle cx="35" cy="25" r="16" fill="#fed7aa"/>
      <path d="M18 24 Q35 6 52 24" fill="#b45309"/>
      <path d="M20 28 Q14 42 16 52 M50 28 Q56 42 54 52" stroke="#b45309" stroke-width="4" fill="none"/>
      <path d="M25 44 L45 44 L52 78 L18 78 Z" fill="#ec4899"/>
      <line x1="28" y1="78" x2="22" y2="115" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <line x1="42" y1="78" x2="48" y2="115" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <text x="35" y="132" fill="#16a34a" font-size="13" font-weight="900" text-anchor="middle">გოგო (წინ) ✓</text>
    </g>
  </svg>`;
}

const frontBackScenes = {
  chair: {
    name: "სკამი, ბურთი და ჩანთა",
    tabLabel: "🪑 სკამი, ბურთი და ჩანთა",
    refName: "სკამი",
    refGenitive: "სკამის",
    isItem: true,
    refSvg: () => `
      <div class="fb-ref-wrap" style="position:relative;display:flex;align-items:center;justify-content:center;">
        <img src="assets/objects/chair-single.png" alt="სკამი" class="fb-object-art chair-art" style="width:190px;height:auto;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.12));pointer-events:none;" onerror="this.outerHTML=svgChair(150, 200)" />
      </div>
    `,
    frontName: "ბურთი",
    frontIcon: "⚽",
    frontSvg: () => `
      <img src="assets/objects/ball-orange.png" alt="ბურთი" class="fb-object-art ball-art" style="width:105px;height:auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.22));" onerror="this.outerHTML=svgBall(100, 100)" />
    `,
    frontVoice: "ბურთი სკამის წინ დევს",
    backName: "ჩანთა",
    backIcon: "🎒",
    backSvg: () => `
      <img src="assets/objects/schoolbag-red.png" alt="ჩანთა" class="fb-object-art bag-art" style="width:125px;height:auto;filter:drop-shadow(0 8px 16px rgba(0,0,0,0.18));" onerror="this.outerHTML=svgBag(110, 130)" />
    `,
    backVoice: "ჩანთა სკამის უკან დევს",
    behindStyle: "left: 28%; bottom: 85px;",
    midStyle: "left: 37%; bottom: 30px;",
    frontStyle: "left: 51%; bottom: 15px;"
  },
  tree: {
    name: "ხე, ძაღლი და დათვი",
    tabLabel: "🌳 ხე, ძაღლი და დათვი",
    refName: "ხე",
    refGenitive: "ხის",
    isItem: false,
    refSvg: () => svgTree(230, 260),
    frontName: "ძაღლი",
    frontIcon: "🐶",
    frontSvg: () => svgDog(135, 145),
    frontVoice: "ძაღლი ხის წინ დგას",
    backName: "დათვი",
    backIcon: "🐻",
    backSvg: () => svgBear(140, 150),
    backVoice: "დათვი ხის უკან დგას",
    behindStyle: "left: 18%; bottom: 65px;",
    midStyle: "left: 36%; bottom: 35px;",
    frontStyle: "left: 48%; bottom: 25px;"
  },
  fence: {
    name: "ღობე, კატა და კურდღელი",
    tabLabel: "🏡 ღობე, კატა და კურდღელი",
    refName: "ღობე",
    refGenitive: "ღობის",
    isItem: false,
    refSvg: () => svgFence(260, 180),
    frontName: "კატა",
    frontIcon: "🐱",
    frontSvg: () => svgCat(120, 135),
    frontVoice: "კატა ღობის წინ დგას",
    backName: "კურდღელი",
    backIcon: "🐰",
    backSvg: () => svgRabbit(110, 135),
    backVoice: "კურდღელი ღობის უკან დგას",
    behindStyle: "left: 20%; bottom: 55px;",
    midStyle: "left: 28%; bottom: 30px;",
    frontStyle: "left: 56%; bottom: 20px;"
  }
};

function renderFrontBackLearn() {
  const scene = frontBackScenes[frontBackLearnScene] || frontBackScenes.chair;
  const isItem = !!scene.isItem;
  const refGen = scene.refGenitive || `${scene.refName}-ის`;
  const verb = isItem ? "დევს" : "დგას";
  const relPronoun = isItem ? "რაც" : "ვინც";
  const whatWho = isItem ? "რა" : "ვინ";

  let instructionTitle = "ნახე და გაიგე: რომელია წინ და რომელია უკან?";
  let instructionDesc = `ჯერ მონიშნე, ${relPronoun} ${refGen} წინ ${verb}, შემდეგ — ${relPronoun} უკან ${verb}.`;
  let voicePrompt = `ნახე და გაიგე. ${whatWho} ${verb} ${refGen} წინ? შეეხე.`;

  if (frontBackLearnStep === 0) {
    instructionTitle = `ნაბიჯი 1: რომელია წინ? ${scene.frontIcon}`;
    instructionDesc = `შეეხე იმას, ${relPronoun} ${refGen} წინ ${verb}.`;
    voicePrompt = `რომელია წინ? შეეხე იმას, ${relPronoun} ${refGen} წინ ${verb}.`;
  } else if (frontBackLearnStep === 1) {
    instructionTitle = `ნაბიჯი 2: რომელია უკან? ${scene.backIcon}`;
    instructionDesc = `ახლა შეეხე იმას, ${relPronoun} ${refGen} უკან ${verb}.`;
    voicePrompt = `ახლა რომელია უკან? შეეხე იმას, ${relPronoun} ${refGen} უკან ${verb}.`;
  } else {
    instructionTitle = `ყოჩაღ! ორივე სწორად მონიშნე! ⭐`;
    instructionDesc = `${scene.frontName} წინ ${verb}, ${scene.backName} — უკან.`;
    voicePrompt = `ყოჩაღ! ორივე სწორად მონიშნე. ${scene.frontName} წინ ${verb}, ${scene.backName} — უკან.`;
  }

  content.innerHTML = `
    <div class="stage-panel front-back-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">${frontBackLearnStep === 2 ? "✓" : frontBackLearnStep + 1}</span>
          <div>
            <h3>${instructionTitle}</h3>
            <p>${instructionDesc}</p>
          </div>
          ${audioButton(voicePrompt)}
        </div>

        <div class="scene-picker-bar" role="tablist" aria-label="აირჩიე სურათი">
          ${Object.entries(frontBackScenes).map(([key, item]) => `
            <button type="button" class="scene-tab ${frontBackLearnScene === key ? "active" : ""}" data-scene="${key}" aria-selected="${frontBackLearnScene === key}">
              ${item.tabLabel}
            </button>
          `).join("")}
        </div>

        <div class="front-back-board">
          <div class="fb-scene-container">
            <!-- Behind Item Layer -->
            <div class="fb-layer-behind" style="${scene.behindStyle}">
              <button type="button" class="fb-interactive-item ${frontBackMarked.back ? "marked-back" : ""}" data-fb-target="back" aria-label="${scene.backName} ${refGen} უკან">
                ${frontBackMarked.back ? `<span class="fb-status-badge badge-back">✓ უკან</span>` : ""}
                ${scene.backSvg()}
                <span class="fb-item-label">${scene.backName}</span>
              </button>
            </div>

            <!-- Middle Reference Layer -->
            <div class="fb-layer-mid" style="${scene.midStyle}">
              ${scene.refSvg()}
            </div>

            <!-- Front Item Layer -->
            <div class="fb-layer-front" style="${scene.frontStyle}">
              <button type="button" class="fb-interactive-item ${frontBackMarked.front ? "marked-front" : ""}" data-fb-target="front" aria-label="${scene.frontName} ${refGen} წინ">
                ${frontBackMarked.front ? `<span class="fb-status-badge badge-front">✓ წინ</span>` : ""}
                ${scene.frontSvg()}
                <span class="fb-item-label">${scene.frontName}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="feedback" id="feedback">
          ${frontBackLearnStep === 0 ? `ჯერ შეეხე: რომელია წინ? ${scene.frontIcon}` : frontBackLearnStep === 1 ? `ახლა შეეხე: რომელია უკან? ${scene.backIcon}` : `ორივე პოზიცია სწორად გაქვს მონიშნული! გადადი ვარჯიშზე.`}
        </div>
      </div>

      <aside class="side-note">
        <div class="step-guide-card">
          <h4>დავალების ნაბიჯები</h4>
          <div class="step-item ${frontBackMarked.front ? "done" : frontBackLearnStep === 0 ? "active" : ""}">
            <span class="step-num">${frontBackMarked.front ? "✓" : "1"}</span>
            <div>
              <strong>მონიშნე წინ</strong>
              <small>${scene.frontName} ${refGen} წინაა</small>
            </div>
          </div>
          <div class="step-item ${frontBackMarked.back ? "done" : frontBackLearnStep === 1 ? "active" : ""}">
            <span class="step-num">${frontBackMarked.back ? "✓" : "2"}</span>
            <div>
              <strong>მონიშნე უკან</strong>
              <small>${scene.backName} ${refGen} უკანაა</small>
            </div>
          </div>
        </div>

        <div class="speech">
          <strong>დაიმახსოვრე</strong>
          რაც წინ არის, წინა პლანზეა და მთლიანად ჩანს. რაც უკან არის, მის მიღმაა და ნაწილობრივ იმალება.
        </div>

        <button class="primary-btn" id="fbNextStage">ახლა ივარჯიშე →</button>
      </aside>
    </div>
  `;

  bindAudio(content);

  // Scene switcher
  content.querySelectorAll("[data-scene]").forEach(btn => btn.addEventListener("click", () => {
    frontBackLearnScene = btn.dataset.scene;
    frontBackLearnStep = 0;
    frontBackMarked = { front: false, back: false };
    renderFrontBackLearn();
    const newScene = frontBackScenes[frontBackLearnScene];
    const nVerb = newScene.isItem ? "დევს" : "დგას";
    const nRel = newScene.isItem ? "რა" : "ვინ";
    speak(`არჩეულია ${newScene.name}. ჯერ მონიშნე, ${nRel} ${nVerb} წინ, მერე — უკან.`);
  }));

  // Target item click handler
  content.querySelectorAll("[data-fb-target]").forEach(item => item.addEventListener("click", () => {
    const target = item.dataset.fbTarget;
    if (frontBackLearnStep === 0) {
      if (target === "front") {
        playAudioTone("success");
        frontBackMarked.front = true;
        frontBackLearnStep = 1;
        feedback(true, `სწორია! ${scene.frontName} ${refGen} წინ ${verb}! ახლა იპოვე, ${whatWho} ${verb} უკან.`);
        speak(`სწორია! ${scene.frontName} ${refGen} წინაა. ახლა მონიშნე, ${whatWho} ${verb} უკან.`);
        window.setTimeout(() => renderFrontBackLearn(), 600);
      } else {
        playAudioTone("error");
        feedback(false, `${scene.backName} ${refGen} უკან ${verb}. ჯერ იპოვე, ${whatWho} ${verb} წინ!`);
        speak(`ჯერ იპოვე, ${whatWho} ${verb} წინ.`);
      }
    } else if (frontBackLearnStep === 1) {
      if (target === "back") {
        playAudioTone("complete");
        frontBackMarked.back = true;
        frontBackLearnStep = 2;
        award(1);
        feedback(true, `ყოჩაღ! ${scene.backName} ${refGen} უკან ${verb}! ორივე სწორად განსაზღვრე! ⭐`);
        speak(`ყოჩაღ! ორივე სწორად მონიშნე.`);
        window.setTimeout(() => renderFrontBackLearn(), 600);
      } else {
        playAudioTone("error");
        feedback(false, `${scene.frontName} წინ ${verb}. ახლა შეეხე იმას, ${relPronoun} ${refGen} უკან ${verb}!`);
        speak(`ეს წინ ${verb}. იპოვე, ${whatWho} ${verb} უკან.`);
      }
    } else {
      speak(target === "front" ? `${scene.frontName} წინ ${verb}.` : `${scene.backName} უკან ${verb}.`);
    }
  }));

  content.querySelector("#fbNextStage").addEventListener("click", () => setStage("practice"));
}

const frontBackPracticeTasks = [
  { prompt: "დადე ბურთი სკამის წინ ⚽", voice: "დადე ბურთი სკამის წინ.", target: "front", objectName: "ბურთი", icon: "⚽", scene: "chair" },
  { prompt: "დადე ჩანთა სკამის უკან 🎒", voice: "დადე ჩანთა სკამის უკან.", target: "back", objectName: "ჩანთა", icon: "🎒", scene: "chair" },
  { prompt: "დააყენე ძაღლი ხის წინ 🐕", voice: "დააყენე ძაღლი ხის წინ.", target: "front", objectName: "ძაღლი", icon: "🐕", scene: "tree" },
  { prompt: "დააყენე დათვი ხის უკან 🐻", voice: "დააყენე დათვი ხის უკან.", target: "back", objectName: "დათვი", icon: "🐻", scene: "tree" }
];

function renderFrontBackPractice() {
  const task = frontBackPracticeTasks[frontBackPracticeRound] || frontBackPracticeTasks[0];
  const scene = frontBackScenes[task.scene];
  const refGen = scene.refGenitive || `${scene.refName}-ის`;

  content.innerHTML = `
    <div class="stage-panel front-back-stage">
      <div class="activity-area">
        <div class="instruction child-instruction practice-command">
          <span class="instruction-number">2</span>
          <div>
            <h3>${task.prompt}</h3>
            <p>შეეხე სწორ ადგილს (უკან ან წინ) ან გადაიტანე ნივთი.</p>
          </div>
          ${audioButton(task.voice)}
        </div>

        <div class="fb-practice-board">
          <div class="fb-scene-container" style="height: 250px; pointer-events: none;">
            <div class="fb-layer-mid" style="left: 36%; bottom: 15px;">
              ${scene.refSvg()}
            </div>
          </div>

          <div class="fb-drop-zones-container">
            <button type="button" class="fb-zone-slot" data-fb-zone="back">
              <span>⬅ უკან</span>
              <small>(${refGen} მიღმა)</small>
            </button>
            <button type="button" class="fb-zone-slot" data-fb-zone="front">
              <span>წინ ➡</span>
              <small>(${refGen} წინა პლანზე)</small>
            </button>
          </div>
        </div>

        <div class="drag-tray" style="margin-top: 14px; min-height: 80px;">
          <div id="fbPracticeToken" class="drag-token draggable" draggable="true" style="display:inline-flex;align-items:center;gap:10px;padding:8px 18px;border-radius:18px;background:white;box-shadow:0 4px 14px rgba(0,0,0,.12);border:2px solid var(--blue);cursor:grab;">
            <span style="font-size:2rem">${task.icon}</span>
            <strong style="color:var(--blue-deep);font-size:1.1rem">${task.objectName}</strong>
          </div>
        </div>

        <div class="feedback" id="feedback">
          დააჭირე შესაბამის ველს ან გადაიტანე ${task.objectName}.
        </div>
      </div>

      <aside class="side-note">
        <div class="check-progress">
          <strong id="fbPracticeProgress">${frontBackPracticeScore} / 4</strong>
          <div>
            ${Array.from({ length: 4 }, (_, i) => `<i class="${i < frontBackPracticeScore ? "done" : ""}"></i>`).join("")}
          </div>
        </div>

        <div class="speech">
          <strong>სავარჯიშო ${frontBackPracticeRound + 1} · 4-დან</strong>
          განსაზღვრე, სად უნდა დადგეს საგანი: წინ თუ უკან.
        </div>

        <button class="primary-btn" id="fbPracticeCheckBtn" ${frontBackPracticeScore >= 4 ? "" : "disabled"}>
          მოკლე შემოწმება →
        </button>
      </aside>
    </div>
  `;

  bindAudio(content);

  const zones = content.querySelectorAll("[data-fb-zone]");
  const token = content.querySelector("#fbPracticeToken");

  const evaluatePractice = (zone) => {
    const chosen = zone.dataset.fbZone;
    if (chosen === task.target) {
      playAudioTone("success");
      zone.classList.add("correct");
      zones.forEach(z => { z.disabled = true; });
      token.style.opacity = "0.5";
      frontBackPracticeScore = Math.min(4, frontBackPracticeScore + 1);
      const prog = content.querySelector("#fbPracticeProgress");
      if (prog) prog.textContent = `${frontBackPracticeScore} / 4`;
      content.querySelectorAll(".check-progress i").forEach((dot, idx) => {
        dot.classList.toggle("done", idx < frontBackPracticeScore);
      });
      feedback(true, `სწორია! ${task.objectName} ზუსტად ${chosen === "front" ? "წინ" : "უკან"} განათავსე.`);
      speak("სწორია!");
      if (frontBackPracticeScore >= 4) award(2);

      window.setTimeout(() => {
        if (frontBackPracticeRound < frontBackPracticeTasks.length - 1) {
          frontBackPracticeRound += 1;
          renderFrontBackPractice();
        } else {
          finishFrontBackPractice();
        }
      }, 750);
    } else {
      playAudioTone("error");
      zone.classList.add("wrong");
      feedback(false, `კიდევ დააკვირდი: დავალებაა განათავსო ${task.target === "front" ? "წინ" : "უკან"}.`);
      speak("კიდევ სცადე.");
      window.setTimeout(() => zone.classList.remove("wrong"), 600);
    }
  };

  zones.forEach(zone => {
    zone.addEventListener("click", () => evaluatePractice(zone));
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("hover"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("hover"));
    zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("hover"); evaluatePractice(zone); });
  });

  token.addEventListener("dragstart", () => {});
  content.querySelector("#fbPracticeCheckBtn")?.addEventListener("click", () => setStage("check"));
}

function finishFrontBackPractice() {
  award(2);
  content.innerHTML = `
    <div class="result-panel lesson-result">
      <div class="result-medal">⭐</div>
      <div class="final-star-score">★ 4 / 4</div>
      <h3>ოთხივე სავარჯიშო სწორად შეასრულე!</h3>
      <p>შენ ზუსტად იცი, რა არის საგნის წინ და რა — უკან.</p>
      <button class="primary-btn" id="startCheckBtn">მოკლე შემოწმება →</button>
    </div>
  `;
  content.querySelector("#startCheckBtn").addEventListener("click", () => setStage("check"));
  speak("ყოჩაღ! ოთხივე სავარჯიშო სწორად შეასრულე.");
}

const frontBackCheckChallenges = [
  {
    prompt: "ვინ დგას ხის წინ?",
    voice: "ვინ დგას ხის წინ? მონიშნე სწორი პასუხი.",
    hint: "დააკვირდი ხეს: ვინ დგას მის წინა პლანზე?",
    renderVisual: () => `
      <div class="fb-scene-container" style="height:260px">
        <div class="fb-layer-behind" style="left:18%;bottom:35px">${svgBear(115, 125)}</div>
        <div class="fb-layer-mid" style="left:35%;bottom:18px">${svgTree(190, 220)}</div>
        <div class="fb-layer-front" style="left:48%;bottom:12px">${svgDog(115, 125)}</div>
      </div>
    `,
    options: [
      { id: "dog", label: "ძაღლი", icon: "🐕", correct: true },
      { id: "bear", label: "დათვი", icon: "🐻", correct: false }
    ]
  },
  {
    prompt: "ვინ დგას ხის უკან?",
    voice: "ვინ დგას ხის უკან? მონიშნე სწორი პასუხი.",
    hint: "დააკვირდი ხეს: ვინ იმალება მის მიღმა?",
    renderVisual: () => `
      <div class="fb-scene-container" style="height:260px">
        <div class="fb-layer-behind" style="left:18%;bottom:35px">${svgBear(115, 125)}</div>
        <div class="fb-layer-mid" style="left:35%;bottom:18px">${svgTree(190, 220)}</div>
        <div class="fb-layer-front" style="left:48%;bottom:12px">${svgDog(115, 125)}</div>
      </div>
    `,
    options: [
      { id: "dog", label: "ძაღლი", icon: "🐕", correct: false },
      { id: "bear", label: "დათვი", icon: "🐻", correct: true }
    ]
  },
  {
    prompt: "რომელი ცხოველია ღობის წინ?",
    voice: "რომელი ცხოველია ღობის წინ? მონიშნე.",
    hint: "დააკვირდი ღობეს: ვინ ზის ღობის წინა მხარეს?",
    renderVisual: () => `
      <div class="fb-scene-container" style="height:260px">
        <div class="fb-layer-behind" style="left:20%;bottom:30px">${svgRabbit(95, 115)}</div>
        <div class="fb-layer-mid" style="left:28%;bottom:15px">${svgFence(220, 150)}</div>
        <div class="fb-layer-front" style="left:56%;bottom:10px">${svgCat(105, 115)}</div>
      </div>
    `,
    options: [
      { id: "cat", label: "კატა", icon: "🐱", correct: true },
      { id: "rabbit", label: "კურდღელი", icon: "🐰", correct: false }
    ]
  },
  {
    prompt: "რომელი საგანი დევს სკამის უკან?",
    voice: "რომელი საგანი დევს სკამის უკან? მონიშნე.",
    hint: "დააკვირდი სკამს: რა დევს სკამის მიღმა?",
    renderVisual: () => `
      <div class="fb-scene-container" style="height:260px">
        <div class="fb-layer-behind" style="left:26%;bottom:60px">
          <img src="assets/objects/schoolbag-red.png" alt="ჩანთა" style="width:100px;height:auto;filter:drop-shadow(0 8px 14px rgba(0,0,0,0.18));" onerror="this.outerHTML=svgBag(95, 110)" />
        </div>
        <div class="fb-layer-mid" style="left:37%;bottom:20px">
          <img src="assets/objects/chair-single.png" alt="სკამი" style="width:150px;height:auto;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.12));" onerror="this.outerHTML=svgChair(130, 175)" />
        </div>
        <div class="fb-layer-front" style="left:52%;bottom:10px">
          <img src="assets/objects/ball-orange.png" alt="ბურთი" style="width:85px;height:auto;filter:drop-shadow(0 8px 14px rgba(0,0,0,0.22));" onerror="this.outerHTML=svgBall(85, 85)" />
        </div>
      </div>
    `,
    options: [
      { id: "bag", label: "ჩანთა", icon: "🎒", correct: true },
      { id: "ball", label: "ბურთი", icon: "⚽", correct: false }
    ]
  },
  {
    prompt: "რომელი ბავშვი მიდის წინ?",
    voice: "რომელი ბავშვი მიდის წინ? მონიშნე.",
    hint: "ისარი გვიჩვენებს მოძრაობის მიმართულებას. ვინ მიდის წინ?",
    renderVisual: () => `
      <div class="fb-scene-container" style="height:260px;background:rgba(255,255,255,.5);border-radius:18px">
        ${svgMarchingKids(250, 190)}
      </div>
    `,
    options: [
      { id: "girl", label: "გოგო", icon: "👧", correct: true },
      { id: "boy", label: "ბიჭი", icon: "👦", correct: false }
    ]
  }
];

function renderFrontBackCheck() {
  const challenge = frontBackCheckChallenges[frontBackCheckRound];
  if (!challenge) {
    finishFrontBackCheck();
    return;
  }

  content.innerHTML = `
    <div class="stage-panel fb-check-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">${frontBackCheckRound + 1}</span>
          <div>
            <h3>${challenge.prompt}</h3>
            <p>დააკვირდი სურათს და მონიშნე სწორი პასუხი.</p>
          </div>
          ${audioButton(challenge.voice)}
        </div>

        <div class="fb-check-photo-card">
          <div class="fb-check-visual-wrap">
            ${challenge.renderVisual()}
          </div>
          <div class="fb-check-action-bar">
            <div class="fb-check-options-grid">
              ${challenge.options.map((opt, i) => `
                <button type="button" class="fb-check-btn" data-fb-correct="${opt.correct}" data-index="${i}">
                  <span style="font-size:1.6rem">${opt.icon}</span>
                  <span>${opt.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="hint-box" style="margin-top:14px;">
          <span aria-hidden="true">💡</span>
          <div><strong>მინიშნება:</strong> ${challenge.hint}</div>
        </div>

        <div class="feedback" id="feedback">დააკვირდი ფოტოს და აირჩიე პასუხი.</div>
      </div>

      <aside class="side-note">
        <div class="vertical-star-counter">
          <span>★</span>
          <div>
            <strong id="fbCheckStarCount">${frontBackCheckScore}</strong>
            <small>სწორი პასუხი 5-დან</small>
          </div>
        </div>

        <div class="check-progress">
          <strong>კითხვა ${frontBackCheckRound + 1} / 5</strong>
          <div style="grid-template-columns: repeat(5, 1fr);">
            ${Array.from({ length: 5 }, (_, i) => `<i class="${i < frontBackCheckScore ? "done" : ""}"></i>`).join("")}
          </div>
        </div>

        <div class="speech">
          <strong>შეამოწმე თავი</strong>
          სურათზე ნათლად ჩანს, რომელი საგანია წინ და რომელი — უკან.
        </div>
      </aside>
    </div>
  `;

  bindAudio(content);

  let answered = false;
  const buttons = content.querySelectorAll(".fb-check-btn");

  buttons.forEach(btn => btn.addEventListener("click", () => {
    if (answered) return;
    const isCorrect = btn.dataset.fbCorrect === "true";

    if (!isCorrect) {
      playAudioTone("error");
      btn.classList.add("wrong");
      feedback(false, "კიდევ დააკვირდი სურათს: რომელია წინ და რომელი — უკან?");
      speak("კიდევ დააკვირდი და სცადე.");
      window.setTimeout(() => btn.classList.remove("wrong"), 500);
      return;
    }

    answered = true;
    playAudioTone("success");
    frontBackCheckScore += 1;
    btn.classList.add("correct");
    buttons.forEach(b => { b.disabled = true; });

    const starCount = content.querySelector("#fbCheckStarCount");
    if (starCount) starCount.textContent = frontBackCheckScore;

    const star = document.createElement("div");
    star.className = "fb-star-pop";
    star.textContent = "★";
    content.querySelector(".fb-check-photo-card")?.appendChild(star);
    window.setTimeout(() => star.remove(), 800);

    feedback(true, "სწორია! პასუხი სურათს ზუსტად შეესაბამება.");
    speak("სწორია!");

    window.setTimeout(() => {
      frontBackCheckRound += 1;
      if (frontBackCheckRound < frontBackCheckChallenges.length) {
        renderFrontBackCheck();
      } else {
        finishFrontBackCheck();
      }
    }, 750);
  }));
}

function finishFrontBackCheck() {
  award(3);
  content.innerHTML = `
    <div class="result-panel lesson-result">
      <div class="result-medal">⭐</div>
      <div class="final-star-score">★ ${frontBackCheckScore} / ${frontBackCheckChallenges.length}</div>
      <h3>ხუთივე დავალება სწორად შეასრულე!</h3>
      <p>შენ შესანიშნავად არჩევ, რა არის წინ და რა — უკან.</p>
      <button class="primary-btn" id="nextLesson">შემდეგი გაკვეთილი →</button>
    </div>
  `;
  content.querySelector("#nextLesson").addEventListener("click", () => openLesson(2));
  speak("ყოჩაღ! ხუთივე დავალება სწორად შეასრულე.");
}

// ------------------------------------------------------------
// Size (დიდი და პატარა) SVG Visual Generators
// ------------------------------------------------------------
function svgBasketball(size = 120) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="bballGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ff8c42"/>
        <stop offset="60%" stop-color="#e65100"/>
        <stop offset="100%" stop-color="#bf360c"/>
      </radialGradient>
      <radialGradient id="bballShine" cx="30%" cy="25%" r="35%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="114" rx="46" ry="6" fill="#000000" opacity="0.18"/>
    <circle cx="60" cy="60" r="52" fill="url(#bballGrad)" stroke="#8d2700" stroke-width="2"/>
    <path d="M8 60 H112" stroke="#261005" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M60 8 V112" stroke="#261005" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M22 22 C42 42 42 78 22 98" stroke="#261005" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M98 22 C78 42 78 78 98 98" stroke="#261005" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="52" fill="url(#bballShine)"/>
  </svg>`;
}

function svgTennisBall(size = 60) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="tennisGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ccff00"/>
        <stop offset="65%" stop-color="#a6e22e"/>
        <stop offset="100%" stop-color="#73a910"/>
      </radialGradient>
    </defs>
    <ellipse cx="40" cy="76" rx="30" ry="4" fill="#000000" opacity="0.16"/>
    <circle cx="40" cy="40" r="34" fill="url(#tennisGrad)" stroke="#58850c" stroke-width="1.5"/>
    <path d="M14 24 C30 32 30 48 14 56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9"/>
    <path d="M66 24 C50 32 50 48 66 56" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9"/>
    <circle cx="30" cy="26" r="14" fill="#ffffff" opacity="0.25"/>
  </svg>`;
}

function svgSoccerBall(size = 120) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="soccerGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="70%" stop-color="#f1f5f9"/>
        <stop offset="100%" stop-color="#94a3b8"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="114" rx="46" ry="6" fill="#000000" opacity="0.18"/>
    <circle cx="60" cy="60" r="52" fill="url(#soccerGrad)" stroke="#475569" stroke-width="2"/>
    <polygon points="60,42 74,52 69,68 51,68 46,52" fill="#1e293b"/>
    <polygon points="46,52 28,48 24,32 39,26 52,32" fill="#1e293b"/>
    <polygon points="74,52 92,48 96,32 81,26 68,32" fill="#1e293b"/>
    <polygon points="51,68 44,84 60,94 76,84 69,68" fill="#1e293b"/>
    <line x1="60" y1="42" x2="60" y2="28" stroke="#334155" stroke-width="2"/>
    <line x1="46" y1="52" x2="35" y2="60" stroke="#334155" stroke-width="2"/>
    <line x1="74" y1="52" x2="85" y2="60" stroke="#334155" stroke-width="2"/>
    <line x1="51" y1="68" x2="35" y2="60" stroke="#334155" stroke-width="2"/>
    <line x1="69" y1="68" x2="85" y2="60" stroke="#334155" stroke-width="2"/>
  </svg>`;
}

function svgBeachBall(size = 120) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="60" cy="114" rx="46" ry="6" fill="#000000" opacity="0.16"/>
    <circle cx="60" cy="60" r="52" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <path d="M60 8 C40 18 30 40 30 60 C30 80 40 102 60 112 C40 100 20 80 15 60 C12 45 25 20 60 8 Z" fill="#ef4444"/>
    <path d="M60 8 C40 18 30 40 30 60 C30 80 40 102 60 112 C52 100 48 80 48 60 C48 40 52 20 60 8 Z" fill="#3b82f6"/>
    <path d="M60 8 C80 18 90 40 90 60 C90 80 80 102 60 112 C72 100 68 80 68 60 C68 40 72 20 60 8 Z" fill="#eab308"/>
    <path d="M60 8 C80 18 90 40 90 60 C90 80 80 102 60 112 C80 100 100 80 105 60 C108 45 95 20 60 8 Z" fill="#10b981"/>
    <circle cx="60" cy="20" r="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  </svg>`;
}

function svgRubberBall(size = 60, color = "blue") {
  const colors = {
    blue: { c2: "#0284c7", stroke: "#075985" },
    red: { c2: "#dc2626", stroke: "#7f1d1d" },
    purple: { c2: "#9333ea", stroke: "#581c87" },
    green: { c2: "#16a34a", stroke: "#14532d" },
    orange: { c2: "#ea580c", stroke: "#9a3412" }
  };
  const c = colors[color] || colors.blue;
  return `<svg width="${size}" height="${size}" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="40" cy="76" rx="30" ry="4" fill="#000000" opacity="0.16"/>
    <circle cx="40" cy="40" r="34" fill="${c.c2}" stroke="${c.stroke}" stroke-width="1.5"/>
    <circle cx="28" cy="26" r="14" fill="#ffffff" opacity="0.4"/>
    <path d="M16 48 C30 58 50 58 64 48" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`;
}

function renderBallSvg(type, size = 100, color = "blue") {
  if (type === "basketball") return svgBasketball(size);
  if (type === "tennis") return svgTennisBall(size);
  if (type === "soccer") return svgSoccerBall(size);
  if (type === "beach") return svgBeachBall(size);
  if (type === "rubber-red") return svgRubberBall(size, "red");
  if (type === "rubber-blue") return svgRubberBall(size, "blue");
  if (type === "rubber-green") return svgRubberBall(size, "green");
  if (type === "rubber-orange") return svgRubberBall(size, "orange");
  if (type === "rubber-purple") return svgRubberBall(size, "purple");
  return svgRubberBall(size, color);
}

// ------------------------------------------------------------
// Size Lesson: 1. Learn Stage (ნახე და გაიგე)
// ------------------------------------------------------------
const sizeLearnScenes = {
  "basketball-tennis": {
    tabLabel: "🏀 🎾 კალათბურთი და ჩოგბურთი",
    bigName: "დიდი ბურთი",
    bigSub: "კალათბურთის ბურთი",
    bigType: "basketball",
    smallName: "პატარა ბურთი",
    smallSub: "ჩოგბურთის ბურთი",
    smallType: "tennis",
    bigIcon: "🏀",
    smallIcon: "🎾"
  },
  "soccer-rubber": {
    tabLabel: "⚽ 🔴 ფეხბურთი და წითელი ბურთი",
    bigName: "დიდი ბურთი",
    bigSub: "ფეხბურთის ბურთი",
    bigType: "soccer",
    smallName: "პატარა ბურთი",
    smallSub: "პატარა წითელი ბურთი",
    smallType: "rubber-red",
    bigIcon: "⚽",
    smallIcon: "🔴"
  },
  "beach-blue": {
    tabLabel: "🏖️ 🔵 ჭრელი და ლურჯი ბურთი",
    bigName: "დიდი ბურთი",
    bigSub: "დიდი ჭრელი ბურთი",
    bigType: "beach",
    smallName: "პატარა ბურთი",
    smallSub: "პატარა ლურჯი ბურთი",
    smallType: "rubber-blue",
    bigIcon: "🏖️",
    smallIcon: "🔵"
  }
};

function renderSizeLearn() {
  const scene = sizeLearnScenes[sizeLearnScene] || sizeLearnScenes["basketball-tennis"];
  let instructionTitle = "ნახე და გაიგე: რომელია დიდი და რომელია პატარა?";
  let instructionDesc = "შეადარე ბურთების ზომა: ჯერ მონიშნე დიდი ბურთი, შემდეგ — პატარა ბურთი.";
  let voicePrompt = "ნახე და გაიგე. რომელია დიდი ბურთი? შეეხე დიდ ბურთს.";

  if (sizeLearnStep === 0) {
    instructionTitle = `ნაბიჯი 1: რომელია დიდი? ${scene.bigIcon}`;
    instructionDesc = "შეეხე დიდ ბურთს, რომ მონიშნო.";
    voicePrompt = "რომელია დიდი ბურთი? შეეხე დიდ ბურთს.";
  } else if (sizeLearnStep === 1) {
    instructionTitle = `ნაბიჯი 2: რომელია პატარა? ${scene.smallIcon}`;
    instructionDesc = "ახლა შეეხე პატარა ბურთს.";
    voicePrompt = "ახლა რომელია პატარა ბურთი? შეეხე პატარა ბურთს.";
  } else {
    instructionTitle = "ყოჩაღ! ორივე სწორად მონიშნე! ⭐";
    instructionDesc = `ერთი ბურთი დიდია (${scene.bigSub}), მეორე — პატარა (${scene.smallSub}).`;
    voicePrompt = "ყოჩაღ! ორივე სწორად მონიშნე. ერთი ბურთი დიდია, მეორე პატარა.";
  }

  content.innerHTML = `
    <div class="stage-panel size-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">${sizeLearnStep === 2 ? "✓" : sizeLearnStep + 1}</span>
          <div>
            <h3>${instructionTitle}</h3>
            <p>${instructionDesc}</p>
          </div>
          ${audioButton(voicePrompt)}
        </div>

        <div class="scene-picker-bar" role="tablist" aria-label="აირჩიე ბურთების წყვილი">
          ${Object.entries(sizeLearnScenes).map(([key, item]) => `
            <button type="button" class="scene-tab ${sizeLearnScene === key ? "active" : ""}" data-size-scene="${key}">
              ${item.tabLabel}
            </button>
          `).join("")}
        </div>

        <div class="size-board">
          <div class="size-learn-container">
            <!-- Big Ball Podium -->
            <div class="size-podium">
              <button type="button" class="size-ball-item ${sizeLearnMarked.big ? "marked-big" : ""}" data-size-target="big" aria-label="${scene.bigName}">
                ${sizeLearnMarked.big ? `<span class="size-status-badge badge-big">✓ დიდი</span>` : ""}
                ${renderBallSvg(scene.bigType, 150)}
                <span class="size-item-label">${scene.bigName}</span>
              </button>
              <div class="size-podium-base" style="min-width: 150px;"></div>
            </div>

            <!-- Small Ball Podium -->
            <div class="size-podium">
              <button type="button" class="size-ball-item ${sizeLearnMarked.small ? "marked-small" : ""}" data-size-target="small" aria-label="${scene.smallName}">
                ${sizeLearnMarked.small ? `<span class="size-status-badge badge-small">✓ პატარა</span>` : ""}
                ${renderBallSvg(scene.smallType, 68)}
                <span class="size-item-label">${scene.smallName}</span>
              </button>
              <div class="size-podium-base" style="min-width: 90px; height: 16px;"></div>
            </div>
          </div>
        </div>

        <div class="feedback" id="feedback">
          ${sizeLearnStep === 0 ? `ჯერ შეეხე: რომელია დიდი ბურთი? ${scene.bigIcon}` : sizeLearnStep === 1 ? `ახლა შეეხე: რომელია პატარა ბურთი? ${scene.smallIcon}` : `ორივე ზომა სწორად გაქვს მონიშნული! გადადი ვარჯიშზე.`}
        </div>
      </div>

      <aside class="side-note">
        <div class="step-guide-card">
          <h4>ნაბიჯ-ნაბიჯ დავალება</h4>
          <div class="step-item ${sizeLearnMarked.big ? "done" : sizeLearnStep === 0 ? "active" : ""}">
            <span class="step-num">${sizeLearnMarked.big ? "✓" : "1"}</span>
            <div>
              <strong>მონიშნე დიდი ბურთი</strong>
              <small>${sizeLearnMarked.big ? "შესრულებულია ✓" : "შეეხე დიდ ბურთს"}</small>
            </div>
          </div>
          <div class="step-item ${sizeLearnMarked.small ? "done" : sizeLearnStep === 1 ? "active" : ""}">
            <span class="step-num">${sizeLearnMarked.small ? "✓" : "2"}</span>
            <div>
              <strong>მონიშნე პატარა ბურთი</strong>
              <small>${sizeLearnMarked.small ? "შესრულებულია ✓" : "შეეხე პატარა ბურთს"}</small>
            </div>
          </div>
        </div>

        <div class="speech">
          <strong>დაიმახსოვრე</strong>
          როდესაც ორ ერთნაირ ნივთს ვადარებთ, ერთი შეიძლება იყოს <strong>დიდი</strong>, მეორე კი — <strong>პატარა</strong>.
        </div>

        <button class="primary-btn" data-next-stage>
          ახლა ვივარჯიშოთ →
        </button>
      </aside>
    </div>
  `;

  bindAudio(content);
  content.querySelector("[data-next-stage]").addEventListener("click", () => setStage("practice"));

  content.querySelectorAll("[data-size-scene]").forEach(btn => btn.addEventListener("click", () => {
    sizeLearnScene = btn.dataset.sizeScene;
    sizeLearnStep = 0;
    sizeLearnMarked = { big: false, small: false };
    renderSizeLearn();
  }));

  content.querySelectorAll("[data-size-target]").forEach(btn => btn.addEventListener("click", () => {
    const target = btn.dataset.sizeTarget;
    if (sizeLearnStep === 0) {
      if (target === "big") {
        sizeLearnMarked.big = true;
        sizeLearnStep = 1;
        playAudioTone("success");
        showToast("ყოჩაღ! ეს დიდია! ★");
        renderSizeLearn();
        speak("სწორია! ეს არის დიდი ბურთი. ახლა მონიშნე პატარა ბურთი.");
      } else {
        btn.classList.add("ball-shake");
        window.setTimeout(() => btn.classList.remove("ball-shake"), 400);
        playAudioTone("try");
        showToast("ეს პატარაა, ჯერ მონიშნე დიდი!");
        speak("ეს პატარა ბურთია. ჯერ მონიშნე დიდი ბურთი.");
      }
    } else if (sizeLearnStep === 1) {
      if (target === "small") {
        sizeLearnMarked.small = true;
        sizeLearnStep = 2;
        award(1);
        playAudioTone("complete");
        showToast("ყოჩაღ! ორივე სწორად მონიშნე! ★");
        renderSizeLearn();
        speak("ყოჩაღ! ორივე სწორად მონიშნე. ახლა გადადი ვარჯიშზე!");
      } else {
        btn.classList.add("ball-shake");
        window.setTimeout(() => btn.classList.remove("ball-shake"), 400);
        playAudioTone("try");
        showToast("ეს დიდია, ახლა მონიშნე პატარა!");
        speak("ეს დიდი ბურთია. ახლა მონიშნე პატარა ბურთი.");
      }
    }
  }));
}

// ------------------------------------------------------------
// Size Lesson: 2. Practice Stage (ივარჯიშე)
// Includes explicit tasks requested by user:
// 1. "მონიშნე დიდი" (Mark the big ball)
// 2. "ახალი დავალება: მონიშნე პატარები" (New task: Mark the small balls!)
// ------------------------------------------------------------
const sizePracticeTasks = [
  {
    id: "task-1-big",
    title: "დავალება 1: მონიშნე დიდი ბურთი",
    badgeLabel: "დავალება 1",
    isNewTaskBanner: false,
    prompt: "მონიშნე დიდი ბურთი! 🏀",
    voice: "მონიშნე დიდი ბურთი. შეეხე დიდ ბურთს.",
    targetType: "big",
    requiredCount: 1,
    instructionDesc: "დააკვირდი ბურთებს და შეეხე დიდ ბურთს.",
    balls: [
      { id: "b1", type: "basketball", size: "big", px: 135, name: "დიდი კალათბურთის ბურთი" },
      { id: "s1", type: "tennis", size: "small", px: 56, name: "პატარა ჩოგბურთის ბურთი" },
      { id: "s2", type: "rubber-blue", size: "small", px: 56, name: "პატარა ლურჯი ბურთი" },
      { id: "s3", type: "rubber-orange", size: "small", px: 58, name: "პატარა ნარინჯისფერი ბურთი" }
    ],
    hint: "დააკვირდი: ერთი ბურთი სხვებზე ბევრად დიდია!"
  },
  {
    id: "task-2-smalls",
    title: "ახალი დავალება: მონიშნე პატარები!",
    badgeLabel: "ახალი დავალება",
    isNewTaskBanner: true,
    prompt: "ახალი დავალება: მონიშნე პატარები! 🎾",
    voice: "ახალი დავალება: მონიშნე პატარები! შეეხე ყველა პატარა ბურთს.",
    targetType: "small",
    requiredCount: 3,
    instructionDesc: "შეეხე ყველა პატარა ბურთს (სულ 3 პატარა ბურთია).",
    balls: [
      { id: "b1", type: "soccer", size: "big", px: 135, name: "დიდი ფეხბურთის ბურთი" },
      { id: "s1", type: "tennis", size: "small", px: 56, name: "პატარა ჩოგბურთის ბურთი" },
      { id: "b2", type: "beach", size: "big", px: 135, name: "დიდი ჭრელი ბურთი" },
      { id: "s2", type: "rubber-red", size: "small", px: 58, name: "პატარა წითელი ბურთი" },
      { id: "s3", type: "rubber-purple", size: "small", px: 56, name: "პატარა იისფერი ბურთი" }
    ],
    hint: "იპოვე და შეეხე თითოეულ პატარა ბურთს!"
  },
  {
    id: "task-3-bigs",
    title: "ახალი დავალება: მონიშნე დიდი ბურთები!",
    badgeLabel: "დავალება 3",
    isNewTaskBanner: true,
    prompt: "ახალი დავალება: მონიშნე დიდი ბურთები! 🏀⚽",
    voice: "ახალი დავალება: მონიშნე დიდი ბურთები! შეეხე ყველა დიდ ბურთს.",
    targetType: "big",
    requiredCount: 2,
    instructionDesc: "შეეხე ყველა დიდ ბურთს (სულ 2 დიდი ბურთია).",
    balls: [
      { id: "b1", type: "basketball", size: "big", px: 135, name: "დიდი კალათბურთის ბურთი" },
      { id: "s1", type: "rubber-green", size: "small", px: 56, name: "პატარა მწვანე ბურთი" },
      { id: "b2", type: "soccer", size: "big", px: 135, name: "დიდი ფეხბურთის ბურთი" },
      { id: "s2", type: "tennis", size: "small", px: 56, name: "პატარა ჩოგბურთის ბურთი" },
      { id: "s3", type: "rubber-blue", size: "small", px: 56, name: "პატარა ლურჯი ბურთი" }
    ],
    hint: "იპოვე და მონიშნე ორივე დიდი ბურთი!"
  },
  {
    id: "task-4-small-single",
    title: "ახალი დავალება: მონიშნე პატარა ბურთი!",
    badgeLabel: "დავალება 4",
    isNewTaskBanner: true,
    prompt: "იპოვე და მონიშნე პატარა ბურთი! 🎾",
    voice: "იპოვე და მონიშნე პატარა ბურთი. შეეხე პატარა ბურთს.",
    targetType: "small",
    requiredCount: 1,
    instructionDesc: "შეეხე ერთადერთ პატარა ბურთს დიდ ბურთებს შორის.",
    balls: [
      { id: "b1", type: "beach", size: "big", px: 135, name: "დიდი ჭრელი ბურთი" },
      { id: "b2", type: "basketball", size: "big", px: 135, name: "დიდი კალათბურთის ბურთი" },
      { id: "s1", type: "tennis", size: "small", px: 56, name: "პატარა ჩოგბურთის ბურთი" },
      { id: "b3", type: "soccer", size: "big", px: 135, name: "დიდი ფეხბურთის ბურთი" }
    ],
    hint: "დიდ ბურთებს შორის მხოლოდ ერთი პატარა ბურთია!"
  }
];

function renderSizePractice() {
  const task = sizePracticeTasks[sizePracticeRound] || sizePracticeTasks[0];
  const markedCount = sizePracticeMarkedIds.size;
  const isCompleted = markedCount >= task.requiredCount;

  content.innerHTML = `
    <div class="stage-panel size-stage">
      <div class="activity-area">
        <div class="instruction child-instruction practice-command">
          <span class="instruction-number">2</span>
          <div>
            <h3>${task.prompt}</h3>
            <p>${task.instructionDesc}</p>
          </div>
          ${audioButton(task.voice)}
        </div>

        <div class="size-board">
          ${task.isNewTaskBanner ? `
            <div class="size-task-banner">
              <span>✨</span>
              <span>ახალი დავალება!</span>
              <span>✨</span>
            </div>
          ` : ""}

          <div class="size-practice-field">
            ${task.balls.map(ball => {
              const isMarked = sizePracticeMarkedIds.has(ball.id);
              const markClass = isMarked ? (ball.size === "big" ? "marked-big" : "marked-small") : "";
              const badgeText = isMarked ? (ball.size === "big" ? "✓ დიდი" : "✓ პატარა") : "";
              const badgeClass = isMarked ? (ball.size === "big" ? "badge-big" : "badge-small") : "";
              return `
                <button type="button" class="size-ball-item ${markClass}" data-practice-ball-id="${ball.id}" aria-label="${ball.name}">
                  ${isMarked ? `<span class="size-status-badge ${badgeClass}">${badgeText}</span>` : ""}
                  ${renderBallSvg(ball.type, ball.px)}
                  <span class="size-item-label">${ball.size === "big" ? "დიდი" : "პატარა"}</span>
                </button>
              `;
            }).join("")}
          </div>

          <div class="size-counter-pill">
            <span>🎯 მონიშნულია:</span>
            <strong id="sizeTaskCounter">${markedCount} / ${task.requiredCount}</strong>
          </div>
        </div>

        <div class="feedback" id="feedback">
          ${isCompleted ? "ყოჩაღ! დავალება წარმატებით შეასრულე!" : task.hint}
        </div>
      </div>

      <aside class="side-note">
        <div class="check-progress">
          <strong id="sizePracticeProgress">${sizePracticeScore} / 4</strong>
          <div>
            ${Array.from({ length: 4 }, (_, i) => `<i class="${i < sizePracticeScore ? "done" : ""}"></i>`).join("")}
          </div>
        </div>

        <div class="speech">
          <strong>სავარჯიშო ${sizePracticeRound + 1} · 4-დან</strong>
          ${task.title}
        </div>

        <button class="primary-btn" id="sizePracticeCheckBtn" ${sizePracticeScore >= 4 ? "" : "disabled"}>
          მოკლე შემოწმება →
        </button>
      </aside>
    </div>
  `;

  bindAudio(content);

  const checkBtn = content.querySelector("#sizePracticeCheckBtn");
  if (checkBtn) {
    checkBtn.addEventListener("click", () => setStage("check"));
  }

  content.querySelectorAll("[data-practice-ball-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const ballId = btn.dataset.practiceBallId;
      const ball = task.balls.find(b => b.id === ballId);
      if (!ball) return;

      if (ball.size === task.targetType) {
        if (!sizePracticeMarkedIds.has(ballId)) {
          sizePracticeMarkedIds.add(ballId);
          playAudioTone("success");

          const nowCount = sizePracticeMarkedIds.size;
          if (nowCount < task.requiredCount) {
            const left = task.requiredCount - nowCount;
            showToast(`ყოჩაღ! კიდევ ${left} დარჩა ★`);
            speak(`ყოჩაღ! სწორად მონიშნე. კიდევ ${left} დარჩა.`);
            renderSizePractice();
          } else {
            // Task complete!
            playAudioTone("complete");
            sizePracticeScore = Math.max(sizePracticeScore, sizePracticeRound + 1);
            if (sizePracticeScore >= 4) award(2);
            showToast("ყოჩაღ! დავალება შესრულებულია! ★");
            speak("ყოჩაღ! ყველა სწორად მონიშნე.");
            renderSizePractice();

            window.setTimeout(() => {
              if (sizePracticeRound < sizePracticeTasks.length - 1) {
                sizePracticeRound += 1;
                sizePracticeMarkedIds = new Set();
                renderSizePractice();
                speak(sizePracticeTasks[sizePracticeRound].voice);
              } else {
                setStage("check");
              }
            }, 1200);
          }
        }
      } else {
        // Wrong size chosen
        btn.classList.add("ball-shake");
        window.setTimeout(() => btn.classList.remove("ball-shake"), 400);
        playAudioTone("try");
        if (task.targetType === "big") {
          showToast("ეს პატარაა, მონიშნე დიდი ბურთი!");
          speak("ეს პატარა ბურთია. დავალებაა: მონიშნე დიდი ბურთი.");
        } else {
          showToast("ეს დიდია, მონიშნე პატარები!");
          speak("ეს დიდი ბურთია. დავალებაა: მონიშნე პატარები.");
        }
      }
    });
  });
}

// ------------------------------------------------------------
// Size Lesson: 3. Check Stage (შეამოწმე თავი)
// ------------------------------------------------------------
const sizeCheckChallenges = [
  {
    prompt: "რომელია დიდი ბურთი? 🏀",
    voice: "რომელია დიდი ბურთი? შეეხე სწორ პასუხს.",
    visualHtml: `
      <div style="display:flex;align-items:flex-end;gap:36px;justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("basketball", 130)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ა</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("tennis", 54)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ბ</span>
        </div>
      </div>
    `,
    options: [
      { text: "დიდი ბურთი (ვარიანტი ა)", isCorrect: true },
      { text: "პატარა ბურთი (ვარიანტი ბ)", isCorrect: false }
    ]
  },
  {
    prompt: "რომელია პატარა ბურთი? 🔴",
    voice: "რომელია პატარა ბურთი? შეეხე სწორ პასუხს.",
    visualHtml: `
      <div style="display:flex;align-items:flex-end;gap:36px;justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("soccer", 130)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ა</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("rubber-red", 54)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ბ</span>
        </div>
      </div>
    `,
    options: [
      { text: "დიდი ბურთი (ვარიანტი ა)", isCorrect: false },
      { text: "პატარა ბურთი (ვარიანტი ბ)", isCorrect: true }
    ]
  },
  {
    prompt: "რომელია პატარა ბურთი? 🔵",
    voice: "რომელია პატარა ბურთი? შეეხე სწორ პასუხს.",
    visualHtml: `
      <div style="display:flex;align-items:flex-end;gap:36px;justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("rubber-blue", 54)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ა</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("beach", 130)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:8px;">ვარიანტი ბ</span>
        </div>
      </div>
    `,
    options: [
      { text: "პატარა ბურთი (ვარიანტი ა)", isCorrect: true },
      { text: "დიდი ბურთი (ვარიანტი ბ)", isCorrect: false }
    ]
  },
  {
    prompt: "დააკვირდი: რომელი ბურთია ყველაზე დიდი? 🏀",
    voice: "დააკვირდი სამ ბურთს. რომელია ყველაზე დიდი ბურთი?",
    visualHtml: `
      <div style="display:flex;align-items:flex-end;gap:24px;justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("tennis", 48)}
          <span style="font-weight:800;color:var(--muted);margin-top:6px;font-size:.8rem;">ჩოგბურთი</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("rubber-purple", 76)}
          <span style="font-weight:800;color:var(--muted);margin-top:6px;font-size:.8rem;">საშუალო</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          ${renderBallSvg("basketball", 132)}
          <span style="font-weight:800;color:var(--blue-deep);margin-top:6px;font-size:.8rem;">კალათბურთი</span>
        </div>
      </div>
    `,
    options: [
      { text: "კალათბურთის ბურთი (ყველაზე დიდი)", isCorrect: true },
      { text: "ჩოგბურთის ბურთი", isCorrect: false }
    ]
  },
  {
    prompt: "რომელი ბურთი ჩაეტევა პატარა ყუთში? 📦",
    voice: "რომელი ბურთი ჩაეტევა პატარა ყუთში? დიდი თუ პატარა?",
    visualHtml: `
      <div style="display:flex;align-items:center;gap:30px;justify-content:center;">
        <div style="display:flex;flex-direction:column;align-items:center;background:#f8fafc;padding:12px;border:2px dashed #94a3b8;border-radius:18px;">
          <span style="font-size:2.8rem">📦</span>
          <strong style="color:var(--blue-deep);font-size:.85rem;margin-top:4px;">პატარა ყუთი</strong>
        </div>
        <div style="display:flex;align-items:flex-end;gap:20px;">
          <div style="display:flex;flex-direction:column;align-items:center;">
            ${renderBallSvg("soccer", 120)}
            <small style="font-weight:800;color:var(--muted);margin-top:4px;">დიდი ბურთი</small>
          </div>
          <div style="display:flex;flex-direction:column;align-items:center;">
            ${renderBallSvg("tennis", 54)}
            <small style="font-weight:800;color:var(--muted);margin-top:4px;">პატარა ბურთი</small>
          </div>
        </div>
      </div>
    `,
    options: [
      { text: "პატარა ბურთი ჩაეტევა", isCorrect: true },
      { text: "დიდი ბურთი ჩაეტევა", isCorrect: false }
    ]
  }
];

function renderSizeCheck() {
  const challenge = sizeCheckChallenges[sizeCheckRound] || sizeCheckChallenges[0];

  content.innerHTML = `
    <div class="stage-panel fb-check-stage">
      <div class="activity-area">
        <div class="instruction child-instruction">
          <span class="instruction-number">${sizeCheckRound + 1}</span>
          <div>
            <h3>${challenge.prompt}</h3>
            <p>დააკვირდი ზომებს და შეეხე სწორ პასუხს.</p>
          </div>
          ${audioButton(challenge.voice)}
        </div>

        <div class="fb-check-photo-card">
          <div class="size-check-visual-wrap">
            ${challenge.visualHtml}
            <div class="fb-star-pop" id="sizeStarPop" hidden>⭐</div>
          </div>

          <div class="fb-check-action-bar">
            <div class="size-check-options-grid">
              ${challenge.options.map((opt, i) => `
                <button type="button" class="fb-check-btn" data-size-check-opt="${i}">
                  <span>${opt.text}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="feedback" id="feedback">
          აირჩიე სწორი პასუხი.
        </div>
      </div>

      <aside class="side-note">
        <div class="check-progress">
          <strong id="sizeCheckScore">${sizeCheckScore} / 5</strong>
          <div>
            ${Array.from({ length: 5 }, (_, i) => `<i class="${i < sizeCheckScore ? "done" : ""}"></i>`).join("")}
          </div>
        </div>

        <div class="speech">
          <strong>კითხვა ${sizeCheckRound + 1} / 5</strong>
          დააკვირდი საგნების ზომას და უპასუხე.
        </div>
      </aside>
    </div>
  `;

  bindAudio(content);

  const buttons = content.querySelectorAll("[data-size-check-opt]");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    const idx = Number(btn.dataset.sizeCheckOpt);
    const opt = challenge.options[idx];

    if (opt.isCorrect) {
      btn.classList.add("correct");
      buttons.forEach(b => { b.disabled = true; });
      sizeCheckScore += 1;
      playAudioTone("success");
      const starPop = content.querySelector("#sizeStarPop");
      if (starPop) starPop.hidden = false;
      showToast("სწორია! ★");
      feedback(true, "სწორია! პასუხი ზუსტად შეესაბამება ზომას.");
      speak("სწორია!");

      window.setTimeout(() => {
        sizeCheckRound += 1;
        if (sizeCheckRound < sizeCheckChallenges.length) {
          renderSizeCheck();
        } else {
          finishSizeCheck();
        }
      }, 800);
    } else {
      btn.classList.add("wrong");
      playAudioTone("try");
      showToast("კიდევ ერთხელ დააკვირდი");
      feedback(false, "არასწორია. კარგად დააკვირდი ბურთების ზომებს და სცადე კვლავ.");
      speak("არასწორია. კარგად დააკვირდი ბურთების ზომებს.");
      window.setTimeout(() => btn.classList.remove("wrong"), 600);
    }
  }));
}

function finishSizeCheck() {
  award(3);
  content.innerHTML = `
    <div class="result-panel lesson-result">
      <div class="result-medal">⭐</div>
      <div class="final-star-score">★ ${sizeCheckScore} / ${sizeCheckChallenges.length}</div>
      <h3>ხუთივე დავალება სწორად შეასრულე!</h3>
      <p>შენ შესანიშნავად განასხვავებ დიდ და პატარა საგნებს.</p>
      <button class="primary-btn" id="nextLesson">შემდეგი გაკვეთილი →</button>
    </div>
  `;
  content.querySelector("#nextLesson").addEventListener("click", () => openLesson(5));
  speak("ყოჩაღ! ხუთივე დავალება სწორად შეასრულე.");
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
  content.innerHTML = `<div class="stage-panel"><div class="activity-area"><div class="instruction"><span class="instruction-number">3</span><div><h3>${q.q}</h3><p>აირჩიე ერთი პასუხი.</p></div></div><div class="choice-grid">${q.o.map((o,i)=>`<button class="choice" data-i="${i}">${o}</button>`).join("")}</div><div class="feedback" id="feedback">მზად ხარ? აირჩიე პასუხი.</div></div><aside class="side-note"><div class="speech"><strong>შეამოწმე თავი</strong>პასუხამდე ჩუმად თქვი, რას ხედავ სურათში ან ამოცანაში.</div><button class="primary-btn" id="nextLesson">${currentLesson < lessons.length - 1 ? "შემდეგი გაკვეთილი" : "პირველი გაკვეთილი"}</button></aside></div>`;
  content.querySelectorAll(".choice").forEach(btn => btn.addEventListener("click", () => {
    const ok = Number(btn.dataset.i) === q.a;
    content.querySelectorAll(".choice").forEach(b => b.classList.remove("correct","wrong"));
    btn.classList.add(ok ? "correct" : "wrong");
    feedback(ok, ok ? "სწორია — ცოდნა დამოუკიდებლად გამოიყენე!" : "ჯერ გაიხსენე ახსნა და კვლავ სცადე.");
    if (ok) award(3);
  }));
  content.querySelector("#nextLesson").addEventListener("click", () => currentLesson < lessons.length - 1 ? openLesson(currentLesson + 1) : openLesson(0));
}

function setStage(stage) {
  if (currentLesson === 1) {
    if (stage === "learn" && currentStage !== "learn") {
      stairLevel = 0;
      stairGait = 0;
      upStairLevel = 0;
      downStairLevel = 4;
      verticalActor = "children";
    }
    if (stage === "practice" && currentStage !== "practice") {
      verticalPracticeRound = 0;
      verticalPracticeScore = 0;
      verticalPracticeMoves = { up: 0, down: 0 };
    }
    if (stage === "check" && currentStage !== "check") {
      verticalCheckRound = 0;
      verticalCheckScore = 0;
    }
  }
  currentStage = stage;
  document.querySelectorAll(".stage-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.stage === stage));
  render();
}

document.querySelectorAll(".stage-tab").forEach(tab => tab.addEventListener("click", () => setStage(tab.dataset.stage)));

function openQuiz() {
  ensureDOMElements();
  if (learningCard) learningCard.hidden = true;
  if (quizCard) quizCard.hidden = false;
  quizIndex = 0;
  quizAnswers = Array(quiz.length).fill(null);
  buildStrip();
  if (strip?.lastElementChild) strip.lastElementChild.classList.add("active");
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quiz[quizIndex];
  document.querySelector("#quizScore").textContent = `${quizAnswers.filter((a,i)=>a===quiz[i].a).length} / ${quiz.length}`;
  document.querySelector("#quizBody").innerHTML = `<div class="quiz-content"><div class="quiz-question"><p class="eyebrow">კითხვა ${quizIndex + 1} · ${quiz.length}-დან</p><h3>${q.q}</h3><div class="quiz-options">${q.o.map((o,i)=>`<button class="quiz-option ${quizAnswers[quizIndex]===i ? "selected" : ""}" data-i="${i}">${o}</button>`).join("")}</div></div><div class="quiz-actions"><button class="secondary-btn" id="prevQuiz" ${quizIndex===0?"disabled":""}>წინა</button><button class="primary-btn" id="nextQuiz">${quizIndex === quiz.length - 1 ? "დასრულება" : "შემდეგი"}</button></div></div>`;
  document.querySelectorAll(".quiz-option").forEach(btn => btn.addEventListener("click", () => { quizAnswers[quizIndex] = Number(btn.dataset.i); renderQuizQuestion(); }));
  document.querySelector("#prevQuiz").addEventListener("click", () => { if (quizIndex) { quizIndex--; renderQuizQuestion(); } });
  document.querySelector("#nextQuiz").addEventListener("click", () => {
    if (quizAnswers[quizIndex] === null) { showToast("ჯერ აირჩიე პასუხი"); return; }
    if (quizIndex < quiz.length - 1) { quizIndex++; renderQuizQuestion(); } else renderQuizResult();
  });
}

function renderQuizResult() {
  const score = quizAnswers.filter((a,i)=>a===quiz[i].a).length;
  document.querySelector("#quizScore").textContent = `${score} / ${quiz.length}`;
  const msg = score === quiz.length ? "შესანიშნავია — ყველა ცნება კარგად გაიგე!" : score >= 2 ? "კარგია — კიდევ ერთხელ გაიხსენე რთული საკითხები." : "დაუბრუნდი ახსნას და მშვიდად ივარჯიშე.";
  document.querySelector("#quizBody").innerHTML = `<div class="result-panel"><div class="result-medal">${score===quiz.length?"🏆":score>=2?"⭐":"🌱"}</div><h3>${score} სწორი პასუხი</h3><p>${msg}</p><button class="primary-btn" id="retryQuiz">ვიქტორინის გამეორება</button></div>`;
  document.querySelector("#retryQuiz").addEventListener("click", openQuiz);
}

document.querySelector("#soundBtn")?.addEventListener("click", e => {
  if (!getGeorgianVoice()) {
    soundOn = false;
    e.currentTarget.textContent = "🔇";
    showToast("ქართული ხმა ამ ბრაუზერში არ არის");
    return;
  }
  soundOn = !soundOn;
  e.currentTarget.textContent = soundOn ? "🔊" : "🔇";
});

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

let isAppInitialized = false;
let startupInterval = null;
let startupTimeout = null;

function clearStartupTimers() {
  if (startupInterval) {
    clearInterval(startupInterval);
    startupInterval = null;
  }
  if (startupTimeout) {
    clearTimeout(startupTimeout);
    startupTimeout = null;
  }
}

function startApp() {
  ensureDOMElements();
  if (!strip || !title || !count || !content) {
    return false;
  }
  if (isAppInitialized) {
    clearStartupTimers();
    return true;
  }
  isAppInitialized = true;
  clearStartupTimers();

  document.querySelectorAll(".stage-tab").forEach(tab => {
    tab.onclick = () => setStage(tab.dataset.stage);
  });
  try {
    render();
  } catch (err) {
    console.error("render error:", err);
  }
  try {
    syncAudioControls();
  } catch (err) {
    console.error("syncAudioControls error:", err);
  }
  return true;
}

// 1. Immediate attempt (if DOM is already available)
startApp();

// 2. DOMContentLoaded event
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    startApp();
  });
} else {
  startApp();
}

// 3. Window load event fallback
window.addEventListener("load", () => {
  startApp();
});

// 4. Polling fallback for the first 3 seconds in case of slow DOM or iframe embedding
if (!isAppInitialized) {
  startupInterval = setInterval(() => {
    if (startApp()) {
      clearStartupTimers();
    }
  }, 40);
  startupTimeout = setTimeout(() => clearStartupTimers(), 3000);
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  try {
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", syncAudioControls);
    } else {
      window.speechSynthesis.onvoiceschanged = syncAudioControls;
    }
  } catch (e) {
    console.warn("speechSynthesis voiceschanged error:", e);
  }
}

window.addEventListener('message', e => {
  const frame = document.querySelector('#comparisonFrame');
  if (!frame || e.source !== frame.contentWindow || e.origin !== location.origin) return;
  if (e.data?.type === 'comparison-height' && Number.isFinite(e.data.height)) {
    frame.style.height = `${Math.max(400, e.data.height + 24)}px`;
  }
});

// Apply the same sound toggle to the embedded activity.
document.querySelector('#soundBtn')?.addEventListener('click', () => {
  document.querySelector('#comparisonFrame')?.contentWindow?.postMessage({ type: 'comparison-mute', muted: !soundOn }, location.origin);
});
