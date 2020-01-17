import 'commun/infra/report_erreurs';

import { afficheSituation } from 'commun/vues/affiche_situation';

import DepotRessourcesMaintenance from 'maintenance/infra/depot_ressources_maintenance';
import Situation from 'maintenance/modeles/situation';
import VueSituation from 'maintenance/vues/situation';

const situation = new Situation();

const depotRessources = new DepotRessourcesMaintenance();
afficheSituation('maintenance', situation, VueSituation, depotRessources);