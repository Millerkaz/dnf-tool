import View from './View.js';
import $ from 'jquery';

class topBarView extends View {
  _btnAddEl = document.querySelector('.section-top-bar__add');
  _addSideBarEl = document.querySelector('.add');
  _addOutsideEl = document.querySelector('.add__outside');
  _btnFoxEl;
  _foxContainer = this.getEl('.section-top-bar__fox');

  //form
  _btnSubmitEl = document.querySelector('.add__container--submit');
  _heroNameEl = document.querySelector('.add__container--name');

  constructor() {
    super();
  }

  addHandler(foxHandler) {
    let me = this;
    me._btnAddEl.addEventListener('click', this.heroAsideToggle.bind(me));

    me._addOutsideEl.addEventListener('click', function () {
      me._addSideBarEl.classList.toggle('hidden');
    });

    me._foxContainer.addEventListener('click', function (e) {
      if (e.target.closest('.btn__top-bar--fox')) {
        foxHandler();
        me._btnFoxEl.classList.toggle('btn__top-bar--active');
      }
    });
  }

  creatFox(status) {
    let html = `
              <div class="btn__top-bar btn__top-bar--fox section-top-bar__fox--text ${status === 'finished' ? 'btn__top-bar--active' : ''}">
                <img src="./img/fox/Terranium.png" alt="" class="section-top-bar__fox--terr" />
                <img src="./img/fox/Jonathan.png" alt="" class="section-top-bar__fox--pic" />
              </div>
    `;

    this._foxContainer.insertAdjacentHTML('afterbegin', html);
    this._btnFoxEl = this.getEl('.btn__top-bar--fox');
  }

  foxStatus(status) {
    console.log(this);
    this._btnFoxEl.classList.remove('btn__top-bar--active');
    if (status === 'finished') {
      this._btnFoxEl.classList.add('btn__top-bar--active');
    }
  }

  heroAsideGetObj() {
    let heroName = this._heroNameEl.value;
    let className = $('input[name=location]:checked').val();

    return { name: heroName, class: className };
  }

  heroAsideToggle() {
    this._addSideBarEl.classList.toggle('hidden');
  }

  heroAsideReset() {
    this._heroNameEl.value = '';
    this._addSideBarEl.classList.add('hidden');
  }
}

export default new topBarView();
