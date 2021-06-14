import BaseRegistre from 'commun/infra/base_registre';

export default class RegistreQuestionnaire extends BaseRegistre {
  recupereQuestionnaire (idQuestionnaire) {
    return new Promise((resolve, reject) => {
      this.$.ajax({
        type: 'GET',
        url: `${this.urlServeur}/api/questionnaires/${idQuestionnaire}`,
        contentType: 'application/json; charset=utf-8',
        success: (questions) => {
          questions.forEach((question) => {
            const questionStr = JSON.stringify(question);
            window.localStorage.setItem(`question_${question.id}`, questionStr);
            this.recupereEtStockeIllustration(question);
          });
          resolve(questions);
        },
        error: (xhr) => {
          reject(xhr);
        }
      });
    });
  }

  recupereEtStockeIllustration (question) {
    if (question.illustration) {
      this.recupereIllustrationEnBase64(question.illustration, function (base64) {
        this.stockeIllustration(question.id, base64);
      });
    }
  }

  stockeIllustration (idQuestion, base64) {
    window.localStorage[`question_illustration_${idQuestion}`] = base64;
  }

  recupereIllustrationEnBase64 (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
}
