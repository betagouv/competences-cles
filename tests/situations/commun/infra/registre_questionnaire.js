import RegistreQuestionnaire from 'commun/infra/registre_questionnaire';

describe('le registre questionnaire', function () {
  function unRegistre (data = {}, urlServeur, enLigne = true) {
    return new RegistreQuestionnaire({
      ajax (options) {
        if (enLigne) {
          options.success(data);
        } else {
          options.error({ status: 0 });
        }
      }
    }, urlServeur);
  }

  beforeEach(function () {
    window.localStorage.clear();
  });

  describe('recupereQuestionnaire', function () {
    describe.only('quand on est en ligne', function () {
      it('retourne le questionnaire', function () {
        const registre = unRegistre([{ id: 1, libelle: 'Avez-vous déjà vu ?' }]);

        return registre.recupereQuestionnaire('monIdDeQuestionnaire').then((questions) => {
          const question = { id: 1, libelle: 'Avez-vous déjà vu ?' }
          expect(questions).to.eql([question]);
        });
      });

      it('sauvegarde le questionnaire', function () {
        const registre = unRegistre([{ id: 1, libelle: 'Avez-vous déjà vu ?' }]);

        return registre.recupereQuestionnaire('monIdDeQuestionnaire').then((questions) => {
          expect(window.localStorage.question_1).to.eql('{"id":1,"libelle":"Avez-vous déjà vu ?"}');
        });
      });
    });
  });
});
