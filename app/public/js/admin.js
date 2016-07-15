'use strict';
  var questions = [];

  function newOptionElement(qNum) {
    var options = questions[qNum].options;
    var opt = document.createElement('input');
    opt.type = 'text';
    opt.placeholder = 'Choice #' + options.length;
    opt.dataset.question = qNum;
    opt.dataset.option = options.length - 1;
    opt.addEventListener('blur', function () {
      options[this.dataset.option].value = this.value;
    });
    return opt;
  }
  
  function addOption(qNum) {
    var options = document.querySelectorAll('.new-q-options');
    for (var i = 0; i < options.length; i++) {
      if (options[i].dataset.question === qNum) {
        questions[qNum].options.push({});
        options[i].appendChild(newOptionElement(qNum));
      }
    }
  }

  function newQuestionElement(qNum) {
    var wrapper = document.createElement('div');
    wrapper.className = 'new-q';
    
    var title = document.createElement('input');
    title.type = 'text';
    title.placeholder = 'Question';
    title.addEventListener('blur', function() {
      questions[qNum].title = this.value;
    });
    wrapper.appendChild(title);

    var options = document.createElement('div');
    options.className = 'new-q-options';
    options.dataset.question = qNum;
    options.appendChild(newOptionElement(qNum));
    wrapper.appendChild(options);

    var createOption = document.createElement('button');
    createOption.className = 'create-option';
    createOption.innerHTML = 'Add Option';
    createOption.dataset.question = qNum;
    createOption.addEventListener('click', function() {
      addOption(this.dataset.question);
    });
    wrapper.appendChild(createOption);
    return wrapper;
  }

  function addQuestion() {
    questions.push({
      title: '',
      options: [{}]
    });
    document.querySelector('.new-questions')
            .appendChild(newQuestionElement(questions.length - 1));
  }
  
  function validateSurvey(data) {
    var error = document.getElementById('error');
    if (!data.title.trim()) {
      error.innerHTML = 'Give your survey a name.';
      return false;
    }
    for (var i = 0; i < data.questions.length; i++) {
      if (!data.questions[i].title) {
        error.innerHTML = 'Question ' + (i + 1) + ' is missing something.';
        return false;
      }
      for (var o = 0; o < data.questions[i].options.length; o++) {
        if (!data.questions[i].options[o].value) {
          error.innerHTML = 'Question ' + (i + 1) + ', Choice ' + (o + 1) + ' is blank.';
          return false;
        }
      }
    }
    return true;
  }

  function saveSurvey() { // jshint ignore:line
    var data = {
      title: document.getElementById('survey-title').value,
      questions: questions
    };
    if (validateSurvey(data)) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/survey', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function() {
        window.location.replace('/dashboard');
      };
      xhr.send('json=' + JSON.stringify(data));
    }
  }
 
  // Initialize
  addQuestion();

