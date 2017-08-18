window.MyForm = {
  form: document.querySelector('#myForm'),

  validate() {
    const fields = this.getData();
    const errorFields = [];
    for (let name in fields) {
      const isValidField = this._validateField(name, fields[name]);
      if (!isValidField) {
        errorFields.push(name);
      }
    }
    return {
      errorFields,
      isValid: errorFields.length === 0
    };
  },

  _validateField(name, value) {
    const trimmedValue = value.trim();
    switch(name) {
      case 'fio':
        return this._validateFio(trimmedValue);
      case 'email':
        return this._validateEmail(trimmedValue);
      case 'phone':
        return this._validatePhone(trimmedValue);
    }
  },

  _validateFio(string) {
    const fioRegex = /^[a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+$/;
    return fioRegex.test(string);
  },

  _validatePhone(string) {
    const phoneRegex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(string)) {
      return false;
    }

    var sum = string.split('').reduce((result, symbol) => {
      number = parseInt(symbol, 10);
      if (number) {
        return result + number;
      }
      return result;
    }, 0);
    return sum <= 30;
  },

  _validateEmail(string) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(ya.ru|yandex.(ru|ua|by|kz|com))$/;
    return emailRegex.test(string);
  },

  getData() {
    return {
      fio: this.form.elements.fio.value,
      email: this.form.elements.email.value,
      phone: this.form.elements.phone.value
    }
  },

  setData(data) {
    this.form.elements.fio.value = data.fio || '';
    this.form.elements.email.value = data.email || '';
    this.form.elements.phone.value = data.phone || '';
  },

  submit() {
    const self = this;
    const validation = this.validate();
    this._markErrors(validation.errorFields);
    if (!validation.isValid) {
      return;
    }
    this._sendRequest()
      .then(function(json) {
        self._handleResponse(json);
      })
      .catch(console.error);
  },

  _handleResponse(res) {
    switch (res.status) {
      case 'success':
        this._handleSuccess();
        break;
      case 'error':
        this._handleError();
        break;
      case 'progress':
        this._handleProgress();
        break;
      default:
        console.warn(`Unknown response status: "${res.status}"`);
    }
  },

  _handleSuccess() {
    console.log('Success');
  },

  _handleError() {
    console.log('Error');
  },

  _handleProgress() {
    console.log('Proggress');
  },

  _sendRequest() {
    const url = this.form.action;
    const promise = fetch(url)
      .then(function(res) {
        return res.json();
      });
      return promise;
  },

  _markErrors(errorFieldNames) {
    const inputsArr = Array.from(this.form.elements);
    inputsArr.forEach((input) => {
      input.classList.remove('error');
    });

    errorFieldNames.forEach((name) => {
      this.form.elements[name].classList.add('error');
    });
  }
}


/*****TESTS******/
MyForm.setData({
  fio:   'Yarmosh Алексей СергёЁвич',
  email: 'delete-863@yandex.by',
  phone: '+7(111)222-33-11'
});

document.forms.myForm.addEventListener('submit', function(e) {
  e.preventDefault();
  MyForm.submit();
});

MyForm.submit();
