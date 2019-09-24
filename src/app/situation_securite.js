import 'commun/infra/report_erreurs';

import { afficheSituation } from 'commun/vues/affiche_situation';

import DepotRessourcesSecurite from 'securite/infra/depot_ressources_securite';
import Situation from 'commun/modeles/situation';
import VueSituation from 'securite/vues/situation';

const situation = new Situation();

const depotRessources = new DepotRessourcesSecurite();
afficheSituation('securite', situation, VueSituation, depotRessources);
