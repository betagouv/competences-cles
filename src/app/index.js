import 'core-js/stable';
import queryString from 'query-string';
import Vue from 'vue';
import 'commun/styles/conteneur.scss';
import 'commun/styles/commun.scss';

import { creeStore } from 'accueil/modeles/store';
import Index from 'accueil/vues/index';
import { initialise as initialiseInternationalisation, traduction } from 'commun/infra/internationalisation';
import RegistreUtilisateur from 'commun/infra/registre_utilisateur';
import RegistreCampagne from 'commun/infra/registre_campagne';
import RegistreQuestionnaire from 'commun/infra/registre_questionnaire';
import DepotRessourcesAccueil from 'accueil/infra/depot_ressources_accueil';
import { erreurVue } from 'commun/infra/report_erreurs';

Vue.config.errorHandler = erreurVue;

function afficheAccueil (pointInsertion) {
  const registreUtilisateur = new RegistreUtilisateur();
  const registreCampagne = new RegistreCampagne();
  const registreQuestionnaire = new RegistreQuestionnaire();

  const depotRessources = new DepotRessourcesAccueil();

  Vue.prototype.$depotRessources = depotRessources;
  Vue.prototype.$traduction = traduction;
  const parametresUrl = queryString.parse(location.search);
  registreUtilisateur.enregistreModeHorsLigne(parametresUrl.horsligne === 'true');

  const store = creeStore(registreUtilisateur, registreCampagne, registreQuestionnaire);

  new Vue({
    store,
    render: createEle => createEle(Index)
  }).$mount(pointInsertion);
}

initialiseInternationalisation().then(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.title = traduction('accueil.titre');
    const div = document.createElement('div');
    div.setAttribute('class', 'conteneur');
    document.body.prepend(div);
    afficheAccueil(div);
  });
});
