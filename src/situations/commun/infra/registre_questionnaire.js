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
          })
          resolve(questions);
        },
        error: (xhr) => {
          reject(xhr);
        }
      });
    });
  }
}
