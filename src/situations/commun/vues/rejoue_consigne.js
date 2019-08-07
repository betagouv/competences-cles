import joueConsigne from 'commun/composants/joueur_consigne';
import { traduction } from 'commun/infra/internationalisation';
import VueBouton from './bouton';
import EvenementRejoueConsigne from '../modeles/evenement_rejoue_consigne';
import { DEMARRE } from 'commun/modeles/situation';

import play from 'commun/assets/play.svg';
import lectureEnCours from 'commun/assets/lecture-en-cours.svg';
import 'commun/styles/bouton.scss';

export default class VueRejoueConsigne {
  constructor (depotResources, journal) {
    this.depotResources = depotResources;
    this.journal = journal;
    this.vueBoutonLire = new VueBouton('bouton-lire-consigne', play, () => this.litConsigne(this.$));
    this.vueBoutonLire.ajouteUneEtiquette(traduction('situation.repeter_consigne'));
    this.vueBoutonLectureEnCours = new VueBouton('bouton-lecture-en-cours', lectureEnCours);
  }

  affiche (pointInsertion, $, situation) {
    this.etat = situation._etat;
    if (this.etat === DEMARRE) {
      return;
    }
    this.$ = $;
    this.$boutonRejoueConsigne = $('<div></div>');
    this.pointInsertion = pointInsertion;
    $(pointInsertion).append(this.$boutonRejoueConsigne);
    this.vueBoutonLire.affiche(this.$boutonRejoueConsigne, $);
  }

  litConsigne ($) {
    this.journal.enregistre(new EvenementRejoueConsigne());
    this.vueBoutonLire.cache();

    this.vueBoutonLectureEnCours.affiche(this.$boutonRejoueConsigne, $);
    joueConsigne(this.depotResources, this.etat !== DEMARRE, () => this.lectureTerminee());
  }

  lectureTerminee () {
    this.vueBoutonLectureEnCours.cache();
    this.vueBoutonLire.affiche(this.$boutonRejoueConsigne, this.$);
  }
}
