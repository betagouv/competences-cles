import { DEMARRE } from 'commun/modeles/situation';
import VueActionOverlay from 'commun/vues/action_overlay';

import go from 'commun/assets/go.svg';
import { traduction } from 'commun/infra/internationalisation';

export default class VueGo extends VueActionOverlay {
  constructor (situation) {
    super(go, traduction('situation.go'), 'bouton-go', 'bouton-centre-visible', 'hors-actions');
    this.situation = situation;
  }

  click () {
    this.situation.modifieEtat(DEMARRE);
  }
}
