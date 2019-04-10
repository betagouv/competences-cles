import SituationCommune from 'commun/modeles/situation';
import { nouvelInventaireReference } from './inventaireReference';
import { Contenant } from './contenant';

function inventaireProduits ({ contenants, contenus }) {
  var inventaire = new Map();

  contenants.forEach(function (c) {
    let clefProduit = c.idContenu;
    if (!inventaire.has(clefProduit)) {
      inventaire.set(clefProduit, 0);
    }
    inventaire.set(clefProduit, inventaire.get(clefProduit) + c.quantite);
  });

  var resultat = new Map();
  inventaire.forEach(function (quantite, clefProduit) {
    const { nom, image, forme, position } = contenus[clefProduit];
    resultat.set(clefProduit, { nom, image, quantite, forme, position });
  });

  return new Map([...resultat.entries()].sort((a, b) => {
    return a[1].position - b[1].position;
  }));
}

function creerContenants ({ contenants, contenus }) {
  return contenants.map((contenant) => {
    const contenu = contenus[contenant.idContenu];
    return new Contenant(contenant, contenu);
  });
}

export class Situation extends SituationCommune {
  constructor (unStock, sons) {
    super();
    this.produits = inventaireProduits(unStock);
    this.contenants = creerContenants(unStock);
    this.consigneAudio = new window.Audio(sons.consigne);
    this.reussite = new window.Audio(sons.reussite);
    this.echec = new window.Audio(sons.echec);
  }

  inventaireReference () {
    return nouvelInventaireReference(this.produits);
  }

  produitsEnStock () {
    return this.produits;
  }
}
