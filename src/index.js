const requestURL = 'https://raw.githubusercontent.com/NoneBeer/virtual-keyboard/develop/src/keys.json';
let keys = [];
const keysObjects = [];
let activeLanguage;
if (localStorage.getItem('activeLanguage')) {
  activeLanguage = localStorage.getItem('activeLanguage');
} else {
  activeLanguage = 'eng';
}
let shiftIsActive = false;
let capsIsActive = false;
let altIsActive = false;
let mouseActivetedKey = null;
const { body } = document;
const textarea = document.createElement('textarea');

const keyboardBody = document.createElement('div');

class Key {
  constructor(keyValue) {
    this.$key = document.createElement('div');
    this.$key.className = 'key';
    this.$key.classList.add(keyValue.keyCode);
    this.value = keyValue;
    if (activeLanguage === 'eng') {
      this.keyText = keyValue.keyEN;
    } else {
      this.keyText = keyValue.keyRU;
    }
  }

  fillKey() {
    this.$key.innerHTML = '';
    this.$content = document.createElement('span');
    this.$content.className = 'keyContent';
    this.$content.textContent = this.keyText;
    this.$key.append(this.$content);
  }

  changeLanguage() {
    if (activeLanguage === 'rus') {
      this.keyText = this.value.keyRU;
    }
    if (activeLanguage === 'eng') {
      this.keyText = this.value.keyEN;
    }
    this.fillKey();
  }

  shiftOn() {
    if (activeLanguage === 'rus') {
      if (capsIsActive) {
        this.keyText = this.value.shiftCapsRU;
      }
      if (!capsIsActive) {
        this.keyText = this.value.upKeyRU;
      }
    }
    if (activeLanguage === 'eng') {
      if (capsIsActive) {
        this.keyText = this.value.shiftCapsEN;
      }
      if (!capsIsActive) {
        this.keyText = this.value.upKeyEN;
      }
    }
    this.fillKey();
  }

  shiftOff() {
    if (activeLanguage === 'rus') {
      if (capsIsActive) {
        this.keyText = this.value.capsRU;
      }
      if (!capsIsActive) {
        this.keyText = this.value.keyRU;
      }
    }
    if (activeLanguage === 'eng') {
      if (capsIsActive) {
        this.keyText = this.value.capsEN;
      }
      if (!capsIsActive) {
        this.keyText = this.value.keyEN;
      }
    }
    this.fillKey();
  }

  capsOn() {
    if (activeLanguage === 'rus') {
      this.keyText = this.value.capsRU;
    }
    if (activeLanguage === 'eng') {
      this.keyText = this.value.capsEN;
    }
    this.fillKey();
  }

  activateKey() {
    this.$key.classList.add('active');
  }

  deactivateKey() {
    this.$key.classList.remove('active');
  }
}

function fillRow(startKeyIndex, endKeyIndex, row) {
  for (let keyIndex = startKeyIndex; keyIndex < endKeyIndex; keyIndex += 1) {
    const keyValue = keys[keyIndex];
    const key = new Key(keyValue);
    key.fillKey();
    keysObjects.push(key);
    row.append(key.$key);
  }
  return row;
}

function fillRowsWithKeys(rowIndex, row) {
  switch (rowIndex) {
    case 0: {
      fillRow(0, 14, row);
      break;
    }
    case 1: {
      fillRow(14, 29, row);
      break;
    }
    case 2: {
      fillRow(29, 42, row);
      break;
    }
    case 3: {
      fillRow(42, 55, row);
      break;
    }
    case 4: {
      fillRow(55, 64, row);
      break;
    }
    default: {
      break;
    }
  }
}

function fillKeyboardWithRows() {
  for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
    const row = document.createElement('div');
    row.className = 'row';
    fillRowsWithKeys(rowIndex, row);
    keyboardBody.append(row);
  }
}

function fillHTML() {
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  body.append(wrapper);

  const title = document.createElement('div');
  title.className = 'title';
  const titleText = document.createElement('h1');
  titleText.className = 'title-text';
  titleText.textContent = 'Virtual keyboard';
  title.append(titleText);
  wrapper.append(title);

  textarea.className = 'textarea';
  textarea.id = 'textarea';

  wrapper.append(textarea);

  keyboardBody.className = 'keyboard';
  keyboardBody.id = 'keyboard';
  wrapper.append(keyboardBody);

  const description = document.createElement('p');
  description.className = 'description--text';
  description.textContent = 'The keyboard was created in the Windows operating system';
  const language = document.createElement('p');
  language.className = 'description--text';
  language.textContent = 'To switch the language combination: alt + ctrl';
  wrapper.append(description);
  wrapper.append(language);
  textarea.focus();
  fillKeyboardWithRows();
}

(async function getData() {
  const res = await fetch(requestURL);
  const data = await res.json();
  keys = data;
  fillHTML();
}());

textarea.addEventListener('blur', () => {
  textarea.focus();
});

function writeTextToTextarea(event) {
  const closest = event.target.closest('.key');
  if (event.type === 'keydown' || event.type === 'mousedown') {
    keysObjects.forEach((key) => {
      if (
        key.$key.classList.contains(event.code)
        || (closest && closest.classList.contains(key.value.keyCode))
      ) {
        if (closest) {
          mouseActivetedKey = key;
        } else {
          mouseActivetedKey = null;
        }
        if (key.value.type !== 'functional') {
          textarea.setRangeText(
            key.keyText,
            textarea.selectionStart,
            textarea.selectionEnd,
            'end',
          );
        } else {
          if (key.value.keyCode === 'Tab') {
            textarea.setRangeText(
              '\t',
              textarea.selectionStart,
              textarea.selectionEnd,
              'end',
            );
          }
          if (key.value.keyCode === 'Enter') {
            textarea.setRangeText(
              '\n',
              textarea.selectionStart,
              textarea.selectionEnd,
              'end',
            );
          }
          if (key.value.keyCode === 'Delete') {
            if (textarea.selectionStart !== textarea.selectionEnd) {
              textarea.setRangeText('');
              return;
            }
            const text = textarea.value;
            const position = textarea.selectionStart;
            const beforeText = text.slice(0, position);
            const afterText = text.slice(position + 1);
            textarea.value = beforeText + afterText;
            textarea.selectionEnd = position;
          }
          if (key.value.keyCode === 'Backspace') {
            if (textarea.selectionStart !== textarea.selectionEnd) {
              textarea.setRangeText('');
            } else if (textarea.selectionStart !== 0) {
              const text = textarea.value;
              const position = textarea.selectionStart;
              const beforeText = text.slice(0, position - 1);
              const afterText = text.slice(position);
              textarea.value = beforeText + afterText;
              textarea.selectionEnd = position - 1;
            }
          }
          if (
            key.value.keyCode === 'ShiftRight'
            || key.value.keyCode === 'ShiftLeft'
          ) {
            shiftIsActive = true;
            keysObjects.forEach((someKey) => {
              someKey.shiftOn();
            });
          }
          if (key.value.keyCode === 'ArrowLeft') {
            if (shiftIsActive) {
              textarea.selectionStart -= 1;
            } else {
              textarea.selectionStart -= 1;
              textarea.selectionEnd = textarea.selectionStart;
            }
          }
          if (key.value.keyCode === 'ArrowRight') {
            if (shiftIsActive) {
              textarea.selectionEnd += 1;
            } else {
              textarea.selectionEnd += 1;
              textarea.selectionStart = textarea.selectionEnd;
            }
          }
          if (
            key.value.keyCode === 'ArrowUp'
            || key.value.keyCode === 'ArrowDown'
          ) {
            key.activateKey();
            return;
          }
          if (
            key.value.keyCode === 'AltRight'
            || key.value.keyCode === 'AltLeft'
          ) {
            altIsActive = true;
          }
          if (
            key.value.keyCode === 'ControlLeft'
            || key.value.keyCode === 'ControlRight'
          ) {
            if (altIsActive) {
              if (activeLanguage === 'rus') {
                activeLanguage = 'eng';
              } else {
                activeLanguage = 'rus';
              }
              localStorage.setItem('activeLanguage', activeLanguage);
              keysObjects.forEach((someKey) => {
                someKey.changeLanguage();
              });
            }
          }
          if (key.value.keyCode === 'CapsLock') {
            if (!capsIsActive) {
              capsIsActive = true;
            } else {
              capsIsActive = false;
            }
          }
        }
        key.activateKey();
        event.preventDefault();
      }
    });
  }
  if (event.type === 'keyup' || event.type === 'mouseup') {
    keysObjects.forEach((key) => {
      if (key.$key.classList.contains(event.code)) {
        if (
          key.value.keyCode === 'ShiftRight'
          || key.value.keyCode === 'ShiftLeft'
        ) {
          shiftIsActive = false;
          keysObjects.forEach((someKey) => {
            someKey.shiftOff();
          });
        }
        if (
          key.value.keyCode === 'AltRight'
          || key.value.keyCode === 'AltLeft'
        ) {
          altIsActive = false;
        }
        if (key.value.keyCode === 'CapsLock') {
          if (capsIsActive) {
            keysObjects.forEach((someKey) => {
              someKey.capsOn();
            });
            return;
          }
          keysObjects.forEach((someKey) => {
            someKey.changeLanguage();
          });
        }
        key.deactivateKey();
      }
    });
    if (mouseActivetedKey) {
      if (mouseActivetedKey.value.keyCode === 'CapsLock') {
        if (capsIsActive) {
          keysObjects.forEach((key) => {
            key.capsOn();
          });
          return;
        }
        keysObjects.forEach((key) => {
          key.changeLanguage();
        });
      }
      if (
        mouseActivetedKey.value.keyCode === 'ShiftRight'
        || mouseActivetedKey.value.keyCode === 'ShiftLeft'
      ) {
        shiftIsActive = false;
        keysObjects.forEach((key) => {
          key.shiftOff();
        });
      }
      mouseActivetedKey.deactivateKey();
    }
  }
}

['keydown', 'keyup', 'mousedown', 'mouseup'].forEach((eventFromArray) => {
  body.addEventListener(eventFromArray, (event) => {
    writeTextToTextarea(event);
  });
});
