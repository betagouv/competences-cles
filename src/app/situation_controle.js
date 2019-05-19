import 'commun/styles/situation.scss';

import { afficheSituation } from 'commun/vues/affiche_situation';
import DepotRessourcesControle from 'controle/infra/depot_ressources_controle';
import Situation from 'controle/modeles/situation';
import VueSituation from 'controle/vues/situation';

import { scenario } from 'controle/data/pieces';

const situation = new Situation({
  scenario,
  cadence: 5000,
  positionApparitionPieces: { x: 100, y: 64.5 },
  dureeViePiece: 12000
});

const depotRessources = new DepotRessourcesControle();
afficheSituation('controle', situation, VueSituation, depotRessources);