import jsdom from 'jsdom-global';

import { VueCadre } from 'commun/vues/cadre';

function uneVue (callbackAffichage = () => {}) {
  return { affiche: callbackAffichage };
}

describe('Une vue du cadre', function () {
  let $;
  let situation;

  beforeEach(function () {
    jsdom('<div id="point-insertion"></div>');
    $ = jQuery(window);
    situation = {
      consigneAudio: 'chemin_vers_la_consigne_audio'
    };
  });

  it("Crée l'élément cadre", function () {
    const vueCadre = new VueCadre(uneVue(), situation);
    expect($('#point-insertion #cadre').length).to.equal(0);

    vueCadre.affiche('#point-insertion', $);
    expect($('#point-insertion #cadre.conteneur').length).to.equal(1);
  });

  it("Affiche une scene comme point d'insertion de la vue situation", function () {
    const vueCadre = new VueCadre(uneVue(), situation);
    expect($('#cadre .scene').length).to.equal(0);

    vueCadre.affiche('#point-insertion', $);
    expect($('#cadre .scene').length).to.equal(1);
  });

  it('affiche une situation donnée', function (done) {
    const vueSituation = uneVue(function (pointInsertion, jQuery) {
      expect(pointInsertion).to.equal('.scene');
      expect(jQuery).to.equal($);
      done();
    });
    const vueCadre = new VueCadre(vueSituation, situation);
    vueCadre.affiche('#point-insertion', $);
  });

  it("affiche la barre d'action", function () {
    const vueCadre = new VueCadre(uneVue(), situation);
    vueCadre.affiche('#point-insertion', $);

    expect($('#cadre .actions').length).to.equal(1);
  });

  it('affiche la consigne audio', function () {
    const vueCadre = new VueCadre(uneVue(), situation);
    vueCadre.affiche('#point-insertion', $);

    expect($('#cadre #consigne').length).to.equal(1);
  });

  it("affiche l'overlay de démarrage", function () {
    const vueCadre = new VueCadre(uneVue(), situation);
    vueCadre.affiche('#point-insertion', $);

    expect($('#cadre #overlay-go').length).to.equal(1);
  });
});
