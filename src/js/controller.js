'use strict';

import * as model from './model.js';
import $ from 'jquery';
// import * as helper from './helper.js';
import topBarView from './views/topBarView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

let heroList;
let record;
let fox;
let needSavedHero;

function init() {
  foxCheck();
  topBarView.creatFox(fox);
  topBarView.addHandler(foxClick);
  heroList = getLocal('heroList');
  record = getLocal('record');
}

init();

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
//record list btn event

//boss
document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.img__boss-shape')) {
    let boss = e.target.closest('.img__boss-shape').dataset.boss;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);
    if (times === 0) return;
    document.querySelector(`.${boss}--enterTimes`).textContent = times - 1;
  }
});

//reset

document.querySelector('.section-list__recordArea').addEventListener('click', function (e) {
  if (e.target.closest('.btn--record')) {
    let boss = e.target.closest('li').id;
    let times = Number(document.querySelector(`.${boss}--enterTimes`).textContent);
    if (times === 3) return;
    document.querySelector(`.${boss}--enterTimes`).textContent = times + 1;
  }
});

///////////////////////////////////////////////////////////////////////
const recordArea = document.querySelector('.section-list__recordArea');
const heroListEl = document.querySelector('.section-list__characters');

let className = {
  MSlayer: 'MSlayer.142fa79a',
  FSlayer: 'FSlayer.3bf4269a',
  MFighter: 'MFighter.e6fdc51c',
  FFighter: 'FFighter.a3956b1e',
  MGunner: 'MGunner.967065a7',
  FGunner: 'FGunner.427b9785',
  MMage: 'MMage.5dab0dc0',
  FMage: 'FMage.235f8caf',
  MPriest: 'MPriest.4c2fb7f0',
  FPriest: 'FPriest.850bb943',
  Knight: 'Knight.dec8b785',
  DarkKnight: 'DarkKnight.f1e505aa',
  Agent: 'Agent.38ffebd3',
  Creator: 'Creator.365d2490',
  Thief: 'Thief.fc8899da',
  Lancer: 'Lancer.4ebf43d7',
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
                  <img src="./${className[obj.class]}.png" alt="${obj.class}" class="section-list__character--icon" />
                  <p class="section-list__character--name">${obj.name}</p>
                </div>
                `;
    heroListEl.insertAdjacentHTML('beforeend', heroBar);
  });
}
showHeroList();

///////////////////////////////////////////////////////////////////////

// ! click hero bar

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
    storeInLocal('heroList', heroList);
    showHeroList();
  }

  //* show
  if (e.target.closest('.section-list__character') && e.target.localName !== 'button') {
    document.querySelectorAll('.section-list__character').forEach(el => {
      el.classList.remove('section-list__character--active');
    });

    e.target.closest('.section-list__character').classList.add('section-list__character--active');
    let id = e.target.closest('.section-list__character').dataset.id;
    console.log(needSavedHero, id);
    recordEdit(needSavedHero);

    needSavedHero = id;

    recordArea.innerHTML = '';

    let recordText = `
<div class="row">
<div class="col-1-of-2">
  <div class="section-list__record--raid">
    <ul>
      <li id="field">
        <div class="img__boss-shape" data-boss="field">
          <img src="./190423_thumbnail.1336a4c2.jpg" alt="" class="img__boss img__boss--field" />
          <div class="img__boss--name">field</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="field--enterTimes">${record[id][0]}</span> / <span class="field--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="isys">
        <div class="img__boss-shape" data-boss="isys">
          <img src="./Portrait-_Prey-Isys.99fe8539.png" alt="" class="img__boss img__boss--isys" />
          <div class="img__boss--name">isys</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="isys--enterTimes">${record[id][1]}</span> / <span class="isys--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="sirocco">
        <div class="img__boss-shape" data-boss="sirocco">
          <img src="./Portrait-_Sirocco.9100e0f6.png" alt="" class="img__boss img__boss--sirocco" />
          <div class="img__boss--name">sirocco</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="sirocco--enterTimes">${record[id][2]}</span> / <span class="sirocco--totleTimes">3</span></p>
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
          <img src="./Devastar.d91a0d62.png" alt="" class="img__boss img__boss--exile" />
          <div class="img__boss--name">exile</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="exile--enterTimes">${record[id][3]}</span> / <span class="exile--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="oculus">
        <div class="img__boss-shape" data-boss="oculus">
          <img src="./Prophet_Ezra.8b078be2.png" alt="" class="img__boss img__boss--oculus" />
          <div class="img__boss--name">oculus</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="oculus--enterTimes">${record[id][4]}</span> / <span class="oculus--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="panda">
        <div class="img__boss-shape" data-boss="panda">
          <img src="./Sarpoza.3aacf77e.png" alt="" class="img__boss img__boss--panda" />
          <div class="img__boss--name">pandawar</div>
        </div>
        <div class="section-list__record--description typo__record-description">
          <p class="typo__record-description--content"><span class="panda--enterTimes">${record[id][5]}</span> / <span class="panda--totleTimes">3</span></p>
          <button class="btn btn--record">reset</button>
        </div>
      </li>
      <li id="bp">
        <div class="img__boss-shape" data-boss="bp">
          <img src="./Horrendous_Astaros.72a4cfce.png" alt="" class="img__boss img__boss--bp" />
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
    record[heroName] = [3, 3, 3, 3, 3, 3, 3];
    storeInLocal('record', record);
    return;
  }

  record = getLocal('record');
  record[heroName] = [3, 3, 3, 3, 3, 3, 3];
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
