import 'core-js/stable';
import 'regenerator-runtime/runtime';

const btnAddEl = document.querySelector('.header__top-bar--add');
const addSideBarEl = document.querySelector('.add');
const addOutsideEl = document.querySelector('.add__outside');

btnAddEl.addEventListener('click', function () {
  addSideBarEl.classList.toggle('hidden');
});

addOutsideEl.addEventListener('click', function () {
  addSideBarEl.classList.toggle('hidden');
});
