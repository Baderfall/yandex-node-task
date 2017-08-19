window.MyForm = {
  form: document.querySelector('#myForm'),
  resultContainer: document.querySelector('#resultContainer'),

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
      const number = parseInt(symbol, 10);
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
    };
  },

  setData(data) {
    this.form.elements.fio.value = data.fio || '';
    this.form.elements.email.value = data.email || '';
    this.form.elements.phone.value = data.phone || '';
  },

  submit() {
    const self = this;
    this._clearForm();
    const validation = this.validate();
    if (!validation.isValid) {
      this._markErrors(validation.errorFields);
      return;
    }
    this.form.submit.disabled = true;
    this._sendRequest()
      .then(function(json) {
        self._handleResponse(json);
      })
      .then(function() {
        self.form.elements.submit.disabled = false;
      })
      .catch(console.error);
  },

  _handleResponse(res) {
    switch (res.status) {
      case 'success':
        this._handleSuccess();
        break;
      case 'error':
        this._handleError(res.reason);
        break;
      case 'progress':
        this._handleProgress(res.timeout);
        break;
      default:
        console.warn(`Unknown response status: "${res.status}"`);
    }
  },

  _handleSuccess() {
    this.resultContainer.classList.add('success');
    this.resultContainer.textContent = 'Success';
  },

  _handleError(reason) {
    this.resultContainer.classList.add('error');
    this.resultContainer.textContent = reason;
  },

  _handleProgress(timeout) {
    this.resultContainer.classList.add('progress');
    setTimeout(() => {
      this.submit();
    }, timeout);
  },

  _sendRequest() {
    const url = this.form.action;
    const promise = fetch(url)
      .then(function(res) {
        return res.json();
      });
      return promise;
  },

  _clearForm() {
    const inputsArr = Array.from(this.form.elements);
    inputsArr.forEach((input) => {
      input.classList.remove('error');
    });
    this.resultContainer.classList.remove('success', 'progress', 'error');
    this.resultContainer.textContent = '';
  },

  _markErrors(errorFieldNames) {
    errorFieldNames.forEach((name) => {
      this.form.elements[name].classList.add('error');
    });
  }
};


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
