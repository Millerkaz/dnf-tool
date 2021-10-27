function update(data) {
  this._data = data;
  const newMarkup = this._generateMarkup();

  const newDOM = document.createRange().createContextualFragment(newMarkup);
  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const curElements = Array.from(this._parentElement.querySelectorAll('*'));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];
    // console.log(curEl, newEl.isEqualNode(curEl));

    // Updates changed TEXT
    if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
      // console.log('💥', newEl.firstChild.nodeValue.trim());
      curEl.textContent = newEl.textContent;
    }

    // Updates changed ATTRIBUES
    if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
  });
}
