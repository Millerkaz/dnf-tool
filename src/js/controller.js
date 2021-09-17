'use strict';

// if (module.hot) {
//   module.hot.accept();
// }

import $ from 'jquery';

import * as model from './model.js';

import topBarView from './views/topBarView.js';

import '../sass/main.scss';

// import '../img/char/icons';

let heroList;
let record;
let fox;
let currentHero;

function init() {
  foxCheck();
  setInterval(checkDayReset, 1000);
  topBarView.creatFox(fox);
  topBarView.addHandler(foxClick);
  heroList = getLocal('heroList');
  record = getLocal('record');
}

init();

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

function checkDayReset() {
  let storageDay = JSON.parse(localStorage.getItem('daily'));
  let storageWeek = JSON.parse(localStorage.getItem('weekly'));

  if (!storageDay || !storageWeek) {
    storeNowTime();
    location.reload();
    return;
  }

  let now = new Date().toLocaleString('en-us', {
    weekday: 'long',
    timeZone: 'Pacific/Gambier',
  });

  //DAILY
  if (storageDay !== now) {
    localStorage.setItem('daily', JSON.stringify(now));
    storeInLocal('fox', 'not');
    console.log('change');
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
      v[1] = [2, 2, 2, 3, 3, 3, 3];
    });

    record = Object.fromEntries(recordEntries);
    storeInLocal('record', record);
    console.log('change');
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

    if (boss === 'field' || boss === 'isys' || boss === 'sirocco') {
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

///////////////////////////////////////////////////////////////////////
//顯示英雄列表

const recordArea = document.querySelector('.section-list__recordArea');
const heroListEl = document.querySelector('.section-list__characters');

// let className = {
//   MSlayer: 'MSlayer.66f715d8',
//   FSlayer: 'FSlayer.15f07349',
//   MFighter: 'MFighter.e2122b56',
//   FFighter: 'FFighter.d3c5f637',
//   MGunner: 'MGunner.3c3c0d6b',
//   FGunner: 'FGunner.d8d66bda',
//   MMage: 'MMage.7b68d577',
//   FMage: 'FMage.7d1b7393',
//   MPriest: 'MPriest.8c102bf5',
//   FPriest: 'FPriest.a419702c',
//   Knight: 'Knight.1a241e2f',
//   DarkKnight: 'DarkKnight.c2c570be',
//   Agent: 'Agent.bb68b266',
//   Creator: 'Creator.09d3650d',
//   Thief: 'Thief.fe2dc2cd',
//   Lancer: 'Lancer.99d84edc',
// };

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

// let heroList = [
//   { name: 'nanami', class: 'FMage' },
//   { name: 'korone', class: 'Knight' },
// ];

function showHeroList() {
  heroListEl.innerHTML = '';
  recordArea.innerHTML = '';

  if (!heroList) return;
  heroList.forEach((obj, i) => {
    let heroBar = `<div class="section-list__character section-list__character--${obj.name}" data-id="${obj.name}">
                  <button>Delete</button>
                  <img src="./img/char/icons/${className[obj.class]}.png" alt="${obj.class}" class="section-list__character--icon" />
                  <p class="section-list__character--name">${obj.name}</p>
                </div>
                `;
    heroListEl.insertAdjacentHTML('beforeend', heroBar);
  });
}
showHeroList();

///////////////////////////////////////////////////////////////////////

// ! 點擊英雄列表代理

// let record = {
//   nanami: [3, 3, 3, 3, 3, 3, 3],
//   korone: [2, 1, 0, 3, 3, 1, 1],
// };

document.querySelector('.section-list__characters').addEventListener('click', function (e) {
  //* delete
  if (e.target.localName === 'button') {
    let id = e.target.closest('.section-list__character').dataset.id;
    let targetIndex = heroList.findIndex(v => {
      return v.name === id;
    });
    heroList.splice(targetIndex, 1);
    delete record[id];
    storeInLocal('heroList', heroList);
    storeInLocal('record', record);
    showHeroList();
  }

  //* show
  if (e.target.closest('.section-list__character') && e.target.localName !== 'button') {
    document.querySelectorAll('.section-list__character').forEach(el => {
      el.classList.remove('section-list__character--active');
    });

    e.target.closest('.section-list__character').classList.add('section-list__character--active');
    let id = e.target.closest('.section-list__character').dataset.id;

    currentHero = id;

    recordArea.innerHTML = '';

    let recordText = `
<div class="row">
<div class="col-1-of-2">
  <div class="section-list__record--raid">
    <ul>
      <li id="field">
        <div class="img__boss-shape" data-boss="field">
          <img src="./img/raid/190423_thumbnail.jpg" alt="" class="img__boss img__boss--field" />
          <div class="img__boss--name">fiend</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="field--enterTimes">${record[id][0]}</span> / <span class="field--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="isys">
        <div class="img__boss-shape" data-boss="isys">
          <img src="./img/raid/Portrait-_Prey-Isys.png" alt="" class="img__boss img__boss--isys" />
          <div class="img__boss--name">isys</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="isys--enterTimes">${record[id][1]}</span> / <span class="isys--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="sirocco">
        <div class="img__boss-shape" data-boss="sirocco">
          <img src="./img/raid/Portrait-_Sirocco.png" alt="" class="img__boss img__boss--sirocco" />
          <div class="img__boss--name">sirocco</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="sirocco--enterTimes">${record[id][2]}</span> / <span class="sirocco--totleTimes">2</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
    </ul>
  </div>
</div>
<div class="col-1-of-2">
  <div class="section-list__record--quest">
    <ul>
      <li id="exile">
        <div class="img__boss-shape" data-boss="exile">
          <img src="./img/raid/Devastar.png" alt="" class="img__boss img__boss--exile" />
          <div class="img__boss--name">exile</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="exile--enterTimes">${record[id][3]}</span> / <span class="exile--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="oculus">
        <div class="img__boss-shape" data-boss="oculus">
          <img src="./img/raid/Prophet_Ezra.png" alt="" class="img__boss img__boss--oculus" />
          <div class="img__boss--name">oculus</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="oculus--enterTimes">${record[id][4]}</span> / <span class="oculus--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="panda">
        <div class="img__boss-shape" data-boss="panda">
          <img src="./img/raid/Sarpoza.png" alt="" class="img__boss img__boss--panda" />
          <div class="img__boss--name">pandawar</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="panda--enterTimes">${record[id][5]}</span> / <span class="panda--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="bp">
        <div class="img__boss-shape" data-boss="bp">
          <img src="./img/raid/Horrendous_Astaros.png" alt="" class="img__boss img__boss--bp" />
          <div class="img__boss--name">bp</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="bp--enterTimes">${record[id][6]}</span> / <span class="bp--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
    </ul>
  </div>
</div>
</div>
`;
    recordArea.insertAdjacentHTML('beforeend', recordText);
  }
});

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
    showHeroList();
    return;
  }

  heroList = getLocal('heroList');
  heroList.push(heroObj);
  storeInLocal('heroList', heroList);
  showHeroList();
}

function recordStorage() {
  let heroName = topBarView.heroAsideGetObj().name;

  if (!getLocal('record')) {
    record = {};
    record[heroName] = [2, 2, 2, 3, 3, 3, 3];
    storeInLocal('record', record);
    return;
  }

  record = getLocal('record');
  record[heroName] = [2, 2, 2, 3, 3, 3, 3];
  storeInLocal('record', record);
}

function recordEdit(id) {
  let heroName = id;

  if (!heroName) return;

  record = getLocal('record');

  record[heroName] = [Number($('.field--enterTimes').text()), Number($('.isys--enterTimes').text()), Number($('.sirocco--enterTimes').text()), Number($('.exile--enterTimes').text()), Number($('.oculus--enterTimes').text()), Number($('.panda--enterTimes').text()), Number($('.bp--enterTimes').text())];
  storeInLocal('record', record);
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

//TODO:
/*
1. ID是否相同 CHECK
2.RAID剩餘次數顏色醒目
3.MVC
4.auto reset
*/

/*
ver.1.0.0
1. 新增/刪除HERO功能
2.統計RAID進場功能+儲存本地數據
3.狐狸按鈕功能
*/

/*
ver.1.1.0
1. 變更RAID最大進場次數
*/

/*
ver.1.2.0
1. 新增使用說明
*/
