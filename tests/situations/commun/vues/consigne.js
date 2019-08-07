import $ from 'jquery';

import VueConsigne from 'commun/vues/consigne';
import Situation, { CONSIGNE_ECOUTEE } from 'commun/modeles/situation';

describe('vue consigne', function () {
  beforeEach(function () {
    $('body').append('<div id="pointInsertion"></div>');
  });

  it("change l'état a CONSIGNE_ECOUTEE une fois terminé", () => {
    const situation = new Situation();
    const mockJoueConsigne = (unused, alsoUnused, cbFin) => {
      cbFin();
    };
    const vue = new VueConsigne(situation, null, mockJoueConsigne);
    vue.affiche('#pointInsertion', $);

    expect(situation.etat()).to.eql(CONSIGNE_ECOUTEE);
  });
});
