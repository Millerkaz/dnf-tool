export default class View {
  getEl(el) {
    return document.querySelector(el);
  }

  getEls(el) {
    return document.querySelectorAll(el);
  }
}
