'use strict';

// if (module.hot) {
//   module.hot.accept();
// }

import $ from 'jquery';

import * as model from './model.js';

import topBarView from './views/topBarView.js';

import '../sass/main.scss';

// import '../img/char/icons';

const recordArea = document.querySelector('.section-list__recordArea');
const heroListEl = document.querySelector('.section-list__characters');

let heroList;
let record;
let fox;
let currentHero;
// fiend , isys , sirocco , ozma , Ex , OCU ,panda , bp ,[day]cardTW
let initRaidArray = [2, 2, 2, 2, 3, 3, 2, 3, 'no'];

function init() {
  // recordArea.innerHTML = '';
  guideInit();
  foxCheck();
  setInterval(checkDayReset, 1000);
  topBarView.creatFox(fox);
  topBarView.addHandler(foxClick);
  heroList = getLocal('heroList');
  record = getLocal('record');
  renderOthers('meeting');
  renderOthers('revelation', 6);
  showHeroList();
}

init();

function guideInit() {
  if (!getLocal('guideLimit')) {
    let guideLimit = {
      field: 0,
      isys: 0,
      sirocco: 0,
      ozma: 0,
      bp: 0,
      panda: 0,
      oculus: 0,
      exile: 0,
    };
    storeInLocal('guideLimit', guideLimit);
  }
  if (!getLocal('guideHero')) {
    let guideHero = {
      field: [],
      isys: [],
      sirocco: [],
      ozma: [],
      bp: [],
      panda: [],
      oculus: [],
      exile: [],
    };
    storeInLocal('guideHero', guideHero);
  }
  if (!getLocal('guideLimit').ozma || !getLocal('guideHero').ozma) {
    storeInLocal('guideLimit', { ...getLocal('guideLimit'), ozma: 0 });
    storeInLocal('guideHero', { ...getLocal('guideHero'), ozma: [] });

    let recordEntries = Object.entries(getLocal('record'));
    recordEntries.forEach(v => {
      // fiend , isys , sirocco , ozma , Ex , OCU ,panda , bp , || cardTW
      if (v[1].length !== 9) {
        v[1] = [...v[1].slice(0, 3), 2, ...v[1].slice(3)];
      }
    });

    record = Object.fromEntries(recordEntries);
    storeInLocal('record', record);
  }
}

///////////////////////////////////////////////////////////////////////
//day reset check

function storeNowTime() {
  let UTC9Day = new Date().toLocaleString('en-us', {
    weekday: 'long',
    timeZone: 'Pacific/Gambier',
  });
  localStorage.setItem('daily', JSON.stringify(UTC9Day));
  localStorage.setItem('weekly', JSON.stringify('no'));
}

function guideReset(boss) {
  let guideLimit = getLocal('guideLimit');
  let guideHero = getLocal('guideHero');

  guideLimit[boss] = 0;
  guideHero[boss] = [];

  storeInLocal('guideLimit', guideLimit);
  storeInLocal('guideHero', guideHero);
}

function dayReset(ArrayQuestIndex) {
  let recordEntries = Object.entries(record);
  recordEntries.forEach(v => {
    // fiend , isys , sirocco , ozma , Ex , OCU ,panda , bp , || cardTW
    v[1][ArrayQuestIndex] = 'no';
  });

  record = Object.fromEntries(recordEntries);
  storeInLocal('record', record);
}

function checkDayReset() {
  let storageDay = JSON.parse(localStorage.getItem('daily'));
  let storageWeek = JSON.parse(localStorage.getItem('weekly'));

  if (!storageDay || !storageWeek) {
    storeNowTime();
    location.reload();
    return;
  }

  //? test
  // let now = 'Tuesday';

  let now = new Date().toLocaleString('en-us', {
    weekday: 'long',
    timeZone: 'Pacific/Gambier',
  });

  //DAILY
  if (storageDay !== now) {
    localStorage.setItem('daily', JSON.stringify(now));
    storeInLocal('fox', 'not');
    dayReset(8); // cardTW

    guideReset('oculus');
    guideReset('panda');

    location.reload();
  }

  // console.log('same');

  // WEEKLY
  //reset
  if (now === 'Tuesday' && storageWeek === 'no') {
    let record = getLocal('record');
    localStorage.setItem('weekly', JSON.stringify('yes'));

    let recordEntries = Object.entries(record);
    recordEntries.forEach(v => {
      // fiend , isys , sirocco , ozma , Ex , OCU ,panda , bp
      v[1] = [...initRaidArray];
    });

    record = Object.fromEntries(recordEntries);

    storeInLocal('record', record);
    storeInLocal('meeting', 3);
    storeInLocal('revelation', 6);
    guideReset('field');
    guideReset('isys');
    guideReset('sirocco');
    guideReset('ozma');
    guideReset('exile');
    guideReset('bp');

    location.reload();
  }

  if (now !== 'Tuesday' && storageWeek === 'yes') {
    localStorage.setItem('weekly', JSON.stringify('no'));
  }
}

///////////////////////////////////////////////////////////////////////
//狐狸按鈕監控

function foxCheck() {
  fox = getLocal('fox');
  if (!fox) {
    storeInLocal('fox', 'not');
  }
}

function foxClick() {
  fox = getLocal('fox');
  if (!fox) {
    storeInLocal('fox', 'not');
  }

  if (fox === 'not') {
    storeInLocal('fox', 'finished');
  }

  if (fox === 'finished') {
    storeInLocal('fox', 'not');
  }
  fox = getLocal('fox');
}

///////////////////////////////////////////////////////////////////////
//顯示/隱藏說明頁面

const btnTeachEl = document.querySelector('.btn--nav');
const teachEl = document.querySelector('.nav__teach');
const btnTeachCloseEl = document.querySelector('.nav__teach--close');

btnTeachEl.addEventListener('click', function (e) {
  teachEl.classList.toggle('hidden--img');
});

btnTeachCloseEl.addEventListener('click', function (e) {
  teachEl.classList.add('hidden--img');
});

///////////////////////////////////////////////////////////////////////
//RAID紀錄按鈕事件代理

function guideClick(boss, did) {
  let guideLimit = getLocal('guideLimit');
  let guideHero = getLocal('guideHero');

  if (did === '+') {
    if (guideLimit[boss] === 3 && !guideHero[boss].includes(currentHero)) {
      return;
    }

    if (guideLimit[boss] < 3 && !guideHero[boss].includes(currentHero)) {
      guideHero[boss].push(currentHero);
      guideLimit[boss] += 1;
      storeInLocal('guideLimit', guideLimit);
      storeInLocal('guideHero', guideHero);
      return;
    }
  }

  if (did === '-') {
    if (guideLimit[boss] > 0 && guideHero[boss].includes(currentHero)) {
      guideHero[boss].splice(
        guideHero[boss].findIndex(v => v === currentHero),
        1
      );
      guideLimit[boss] -= 1;
      storeInLocal('guideLimit', guideLimit);
      storeInLocal('guideHero', guideHero);
      return;
    }

    if (guideLimit[boss] === 3 && !guideHero[boss].includes(currentHero)) {
      return;
    }
  }
}

//boss
document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.img__boss-shape')) {
    let boss = e.target.closest('.img__boss-shape').dataset.boss;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);
    if (times === 0) return;
    document.querySelector(`.${boss}--enterTimes`).textContent = times - 1;
    recordEdit(currentHero);
  }
});

//reset

document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.btn--record')) {
    let boss = e.target.closest('li').id;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);

    if (boss === 'field' || boss === 'isys' || boss === 'sirocco' || boss === 'panda' || boss === 'ozma') {
      if (times >= 2) return;
      document.querySelector(`.${boss}--enterTimes`).textContent = times + 1;
      recordEdit(currentHero);
      return;
    }

    if (times >= 3) return;
    document.querySelector(`.${boss}--enterTimes`).textContent = times + 1;
    recordEdit(currentHero);
  }
});

//guide

document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.section-list__record--guide')) {
    let guideLimit = getLocal('guideLimit');
    let guideHero = getLocal('guideHero');
    let boss = e.target.closest('li').id;

    if (guideLimit[boss] === 3 && !guideHero[boss].includes(currentHero)) {
      return;
    }

    //ADD
    if (!guideHero[boss].includes(currentHero)) {
      e.target.classList.toggle('btn__top-bar--active');
      guideClick(boss, '+');
      showHeroList(true);
      return;
    }

    //DELETE
    if (guideHero[boss].includes(currentHero)) {
      e.target.classList.toggle('btn__top-bar--active');
      guideClick(boss, '-');
      showHeroList(true);
      return;
    }
  }
});

//day
//! 加新 day 按鈕時記得去新增 recordEdit function 的 array
document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.btn--day')) {
    let recordCopy = [...record[currentHero]];

    if (!recordCopy[8]) {
      record[currentHero][8] = 'yes';
      e.target.closest('.btn--day').classList.add('btn--day--active');
      storeInLocal('record', record);
      return;
    }

    if (recordCopy[8] === 'yes') {
      e.target.closest('.btn--day').classList.remove('btn--day--active');
      record[currentHero][8] = 'no';
      storeInLocal('record', record);
      return;
    }

    if (recordCopy[8] === 'no') {
      e.target.closest('.btn--day').classList.add('btn--day--active');
      record[currentHero][8] = 'yes';
      storeInLocal('record', record);
      return;
    }
  }
});
///////////////////////////////////////////////////////////////////////

//OTHERS紀錄按鈕事件代理

// meeting
document.querySelector('.others--meeting').addEventListener('click', function (e) {
  clickOnOthers(e, 'meeting');
});
document.querySelector('.others--meeting').addEventListener('click', function (e) {
  resetOnOthers(e, 'meeting');
});

// revelation
document.querySelector('.others--revelation').addEventListener('click', function (e) {
  clickOnOthers(e, 'revelation');
});
document.querySelector('.others--revelation').addEventListener('click', function (e) {
  resetOnOthers(e, 'revelation', 6);
});

function clickOnOthers(e, othersName) {
  if (e.target.closest('.img__boss-shape')) {
    let boss = e.target.closest('.img__boss-shape').dataset.boss;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);
    if (times === 1) {
      document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--red');
      document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--green');
    }
    if (times === 0) return;

    document.querySelector(`.${boss}--enterTimes`).textContent = times - 1;

    storeInLocal(othersName, times - 1);
  }
}

function resetOnOthers(e, othersName, num = 3) {
  if (e.target.closest('.btn--record')) {
    let boss = e.target.closest(`.others--${othersName}`).id;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);

    if (times === 0) {
      document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--red');
      document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--green');
    }

    if (times >= num) return;
    document.querySelector(`.${boss}--enterTimes`).textContent = times + 1;

    storeInLocal(othersName, times + 1);
  }
}

function renderOthers(boss, num = 3) {
  let times = getLocal(boss);

  if (!times && times !== 0) {
    times = num;
  }

  if (times === 0) {
    document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--red');
    document.querySelector(`.${boss}--enterTimes`).classList.toggle('status--green');
  }

  document.querySelector(`.${boss}--enterTimes`).textContent = times;
}

///////////////////////////////////////////////////////////////////////
//顯示英雄列表

// let heroList = [
//   { name: 'nanami', class: 'FMage',guild:[0,0,0,0,1,1,1] },
//   { name: 'korone', class: 'Knight' },
// ];

function showHeroList(guide = false) {
  let className = {
    MSlayer: 'MSlayer',
    FSlayer: 'FSlayer',
    MFighter: 'MFighter',
    FFighter: 'FFighter',
    MGunner: 'MGunner',
    FGunner: 'FGunner',
    MMage: 'MMage',
    FMage: 'FMage',
    MPriest: 'MPriest',
    FPriest: 'FPriest',
    Knight: 'Knight',
    DarkKnight: 'DarkKnight',
    Agent: 'Agent',
    Creator: 'Creator',
    Thief: 'Thief',
    Lancer: 'Lancer',
  };

  heroListEl.innerHTML = '';

  // recordArea.innerHTML = '';

  if (!heroList) return;
  heroList.forEach(obj => {
    function guideIcon(boss) {
      let guideHero = getLocal('guideHero');
      if (guideHero[boss].includes(obj.name)) {
        return true;
      }
    }
    let heroBar = `<div class="section-list__character section-list__character--${obj.name} ${guide && obj.name === currentHero ? 'section-list__character--active' : ''}" data-id="${obj.name}">
                  <button class="btn--delete">&times;</button>
                  <img src="./img/char/icons/${className[obj.class]}.png" alt="${obj.class}" class="section-list__character--icon" />
                  <p class="section-list__character--name">${obj.name}</p>
                  <p class="section-list__character--br">Guide Mode</p>
                <div class="section-list__character--guide">
                  <img src="./img/raid/icons/FW.jpg" alt="FW" class="${guideIcon('field') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/IS.jpg" alt="IS" class="${guideIcon('isys') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/SI.jpg" alt="SI" class="${guideIcon('sirocco') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/ozma.jpg" alt="ozma" class="${guideIcon('ozma') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/EX.jpg" alt="EX" class="${guideIcon('exile') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/OC.jpg" alt="OC" class="${guideIcon('oculus') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/PW.jpg" alt="PW" class="${guideIcon('panda') ? '' : 'hidden--none'}" />
                  <img src="./img/raid/icons/BP.jpg" alt="BP" class="${guideIcon('bp') ? '' : 'hidden--none'}" />
                </div>
                </div>
                `;
    heroListEl.insertAdjacentHTML('beforeend', heroBar);
  });
}

///////////////////////////////////////////////////////////////////////

// ! 點擊英雄列表代理

// let record = {
//   nanami: [3, 3, 3, 3, 3, 3, 3],
//   korone: [2, 1, 0, 3, 3, 1, 1],
// };

function deleteGuild(hero) {
  let guideHeroEntries = Object.entries(getLocal('guideHero'));
  let guideLimit = getLocal('guideLimit');

  guideHeroEntries.forEach(v => {
    if (v[1].includes(hero)) {
      v[1].splice(
        v[1].findIndex(name => name === hero),
        1
      );
      guideLimit[v[0]] -= 1;
    }
  });

  let guideHero = Object.fromEntries(guideHeroEntries);

  storeInLocal('guideHero', guideHero);
  storeInLocal('guideLimit', guideLimit);
}

document.querySelector('.section-list__characters').addEventListener('click', function (e) {
  //* delete
  if (e.target.localName === 'button') {
    currentHero = e.target.closest('.section-list__character').dataset.id;

    let targetIndex = heroList.findIndex(v => {
      return v.name === currentHero;
    });
    heroList.splice(targetIndex, 1);
    delete record[currentHero];

    deleteGuild(currentHero);
    storeInLocal('heroList', heroList);
    storeInLocal('record', record);
    recordArea.innerHTML = '';
    showHeroList();
  }

  //* show
  if (e.target.closest('.section-list__character') && e.target.localName !== 'button') {
    document.querySelectorAll('.section-list__character').forEach(el => {
      el.classList.remove('section-list__character--active');
    });

    e.target.closest('.section-list__character').classList.add('section-list__character--active');

    currentHero = e.target.closest('.section-list__character').dataset.id;

    renderRaid();
  }
});

function renderRaid() {
  // let record = getLocal('record');
  recordArea.innerHTML = '';

  let colorCheck = function (num) {
    if (num <= 3) return record[currentHero][num] === 0 ? 'status--red' : record[currentHero][num] === 1 || record[currentHero][num] === 2 || record[currentHero][num] === 3 ? 'status--green' : '';

    if ((num > 3) & (num !== 6)) return record[currentHero][num] === 0 || record[currentHero][num] === 1 ? 'status--red' : record[currentHero][num] === 2 || record[currentHero][num] === 3 ? 'status--green' : '';

    if (num === 6) return record[currentHero][num] === 0 ? 'status--red' : record[currentHero][num] === 1 || record[currentHero][num] === 2 ? 'status--green' : '';
  };

  let guideCheck = function (boss) {
    let guideHero = getLocal('guideHero');
    if (guideHero[boss].includes(currentHero)) {
      return 'btn__top-bar--active';
    }
  };

  //! ----------------------  HTML  ----------------------
  let recordText = `

<div class="section-list__record--raid">  
    <ul>
      <li id="field">
        <div class="img__boss-shape" data-boss="field">
          <img src="./img/raid/190423_thumbnail.jpg" alt="" class="img__boss img__boss--field" />
          <div class="img__boss--name">fiend</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('field')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="field--enterTimes ${colorCheck(0)}">${record[currentHero][0]}</span> / <span class="field--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="isys">
        <div class="img__boss-shape" data-boss="isys">
          <img src="./img/raid/Portrait-_Prey-Isys.png" alt="" class="img__boss img__boss--isys" />
          <div class="img__boss--name">isys</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('isys')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="isys--enterTimes ${colorCheck(1)}">${record[currentHero][1]}</span> / <span class="isys--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="sirocco">
        <div class="img__boss-shape" data-boss="sirocco">
          <img src="./img/raid/Portrait-_Sirocco.png" alt="" class="img__boss img__boss--sirocco" />
          <div class="img__boss--name">sirocco</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('sirocco')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="sirocco--enterTimes ${colorCheck(2)}">${record[currentHero][2]}</span> / <span class="sirocco--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="ozma">
        <div class="img__boss-shape" data-boss="ozma">
          <img src="./img/raid/Portrait-Ozma_of_Chaos.png" alt="" class="img__boss img__boss--ozma" />
          <div class="img__boss--name">ozma</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('ozma')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="ozma--enterTimes ${colorCheck(3)}">${record[currentHero][3]}</span> / <span class="ozma--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
    </ul>
  
</div>
<div class="section-list__record--quest">  
    <ul>
      <li id="exile">
        <div class="img__boss-shape" data-boss="exile">
          <img src="./img/raid/Devastar.png" alt="" class="img__boss img__boss--exile" />
          <div class="img__boss--name">exile</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('exile')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="exile--enterTimes ${colorCheck(4)}">${record[currentHero][4]}</span> / <span class="exile--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="oculus">
        <div class="img__boss-shape" data-boss="oculus">
          <img src="./img/raid/Prophet_Ezra.png" alt="" class="img__boss img__boss--oculus" />
          <div class="img__boss--name">oculus</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('oculus')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="oculus--enterTimes ${colorCheck(5)}">${record[currentHero][5]}</span> / <span class="oculus--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="panda">
        <div class="img__boss-shape" data-boss="panda">
          <img src="./img/raid/Sarpoza.png" alt="" class="img__boss img__boss--panda" />
          <div class="img__boss--name">pandawar</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('panda')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="panda--enterTimes ${colorCheck(6)}">${record[currentHero][6]}</span> / <span class="panda--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="bp">
        <div class="img__boss-shape" data-boss="bp">
          <img src="./img/raid/Horrendous_Astaros.png" alt="" class="img__boss img__boss--bp" />
          <div class="img__boss--name">bp</div>
        </div>
        <button class="section-list__record--guide btn btn__top-bar ${guideCheck('bp')}">G</button>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="bp--enterTimes ${colorCheck(7)}">${record[currentHero][7]}</span> / <span class="bp--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
    </ul>  
</div>
<div class="section-list__record--day">
  <ul>
    <li id="cardTW">
      <div class="btn--day ${record[currentHero][8] === 'yes' ? 'btn--day--active' : ''}">
        <img src="./img/raid/cardTW.png" alt="cardTW" />
      </div>
    </li>
  </ul>
</div>
</div>
`;
  recordArea.insertAdjacentHTML('beforeend', recordText);
}

///////////////////////////////////////////////////////////////////////
//創建英雄 + 儲存在本地數據

const btnSubmitEl = document.querySelector('.add__container--submit');
const addFormEl = document.querySelector('.add__container--form');

function storeInLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}

function heroStorage() {
  let heroObj = topBarView.heroAsideGetObj();

  if (!getLocal('heroList')) {
    heroList = [];
    heroList.push(heroObj);
    storeInLocal('heroList', heroList);
    recordArea.innerHTML = '';
    showHeroList();
    return;
  }

  heroList = getLocal('heroList');
  heroList.push(heroObj);
  storeInLocal('heroList', heroList);
  recordArea.innerHTML = '';
  showHeroList();
}

function recordStorage() {
  let heroName = topBarView.heroAsideGetObj().name;

  if (!getLocal('record')) {
    record = {};
    record[heroName] = [...initRaidArray];
    storeInLocal('record', record);
    return;
  }

  record = getLocal('record');
  record[heroName] = [...initRaidArray];
  storeInLocal('record', record);
}

function recordEdit(heroName) {
  if (!heroName) return;

  record = getLocal('record');

  //這邊有傳址問題，可能未來會有BUG
  record[heroName] = [Number($('.field--enterTimes').text()), Number($('.isys--enterTimes').text()), Number($('.sirocco--enterTimes').text()), Number($('.ozma--enterTimes').text()), Number($('.exile--enterTimes').text()), Number($('.oculus--enterTimes').text()), Number($('.panda--enterTimes').text()), Number($('.bp--enterTimes').text()), [...$('.btn--day')[0].classList].includes('btn--day--active') ? 'yes' : 'no'];

  storeInLocal('record', record);

  renderRaid();
}

//add
btnSubmitEl.addEventListener('click', function (e) {
  e.preventDefault();

  if (!topBarView.heroAsideGetObj().name || !topBarView.heroAsideGetObj().class) {
    return;
  }
  heroStorage();
  recordStorage();
  topBarView.heroAsideReset();
});

///////////////////////////////////////////////////////////////////////
