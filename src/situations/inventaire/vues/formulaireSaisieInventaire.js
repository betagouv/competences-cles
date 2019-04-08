import { traduction } from 'commun/infra/internationalisation';
import EvenementFin from 'commun/modeles/evenement_fin';
import boutonSaisie from 'inventaire/assets/saisie-reponse.svg';
import EvenementOuvertureSaisieInventaire from 'inventaire/modeles/evenement_ouverture_saisie_inventaire';
import EvenementSaisieInventaire from 'inventaire/modeles/evenement_saisie_inventaire';

import 'commun/styles/commun.scss';
import 'commun/styles/overlay.scss';
import 'inventaire/styles/commun.scss';
import 'inventaire/styles/formulaireSaisieInventaire.scss';

const ID_FORMULAIRE_SAISIE = 'formulaire-saisie-inventaire';

function basculeVisibilite ($element) {
  $element.toggleClass('invisible');
}

export function afficheCorrection ([idProduit, reponseCorrecte], $) {
  let $marque = reponseCorrecte
    ? $('<span class="reponse reponse-correcte">✓</span>')
    : $('<span class="reponse reponse-incorrecte">✗</span>');
  let selecteurEmplacementMarque = `#${ID_FORMULAIRE_SAISIE} input#${idProduit}`;

  $(`${selecteurEmplacementMarque} + .reponse`).remove();
  $marque.insertAfter($(selecteurEmplacementMarque));
}

export function initialiseFormulaireSaisieInventaire (situation, pointInsertion, $, journal) {
  let produits = situation.produitsEnStock();
  let inventaireReference = situation.inventaireReference();
  let reussite = false;

  function creeItem (idProduit, produit) {
    return $(`
      <li>
        <label>${produit.nom}</label>
        <span class='saisie'>
          <input id="${idProduit}" type="text" placeholder= "${traduction('inventaire.placeholder')}">
        </span>
        <div class="image-produit">
          <img src='${produit.image}' class="${produit.forme}">
        </div>
      </li>
    `);
  }

  function creeListe () {
    let $liste = $('<ul></ul>');
    let items = Array.from(produits, ([id, p]) => { return creeItem(id, p); });
    $liste.append(items);
    return $liste;
  }

  function extraisReponses () {
    var reponses = new Map();

    $(`#${ID_FORMULAIRE_SAISIE} input`).each(function () {
      let $input = $(this);
      reponses.set($input.attr('id'), { quantite: $input.val() });
    });

    return reponses;
  }

  function creeBoutonValidation () {
    const $bouton = $(`<button type="button" class="valide-saisie">${traduction('inventaire.valider_saisie')}</button>`);
    $bouton.click(function () {
      const reponses = extraisReponses();
      const saisieValide = inventaireReference.valide(reponses);

      Array.from(saisieValide).forEach(correction => afficheCorrection(correction, $));

      reussite = Array.from(saisieValide.values()).every(v => v);
      journal.enregistre(new EvenementSaisieInventaire({ reussite, resultatValidation: saisieValide, reponses }));
      if (reussite) {
        afficheVueSucces();
        situation.notifie(new EvenementFin());
      }
    });

    return $bouton;
  }

  function afficheVueSucces () {
    $('.valide-saisie').remove();
    $('.formulaire-saisie-inventaire').addClass('succes-saisie-inventaire');
    $('input').prop('disabled', true);
  }

  function creeZoneValidation () {
    let $zoneValidation = $('<div class="validation-inventaire"></div>');
    let $bouton = creeBoutonValidation();
    $zoneValidation.append($bouton);
    return $zoneValidation;
  }

  function creeFormulaire () {
    let $formulaireSaisie = $(`
      <form id="${ID_FORMULAIRE_SAISIE}" autocomplete="off" class="formulaire-saisie-inventaire invisible"></form>
    `);
    let $liste = creeListe();
    let $zoneValidation = creeZoneValidation();
    $formulaireSaisie.append($liste, $zoneValidation);
    return $formulaireSaisie;
  }

  function creeBoutonSaisie ($formulaireSaisie) {
    let $boutonSaisie = $(`<img class="affiche-saisie" src="${boutonSaisie}">`);
    let $overlay = $('<div class="overlay invisible"></div>');
    let $elementsCombines = $boutonSaisie.add($overlay);
    $overlay.append($formulaireSaisie);

    function basculeVisibiliteFormulaire () {
      if (reussite) return;
      if ($overlay.hasClass('invisible')) {
        journal.enregistre(new EvenementOuvertureSaisieInventaire());
      }
      basculeVisibilite($overlay);
      basculeVisibilite($formulaireSaisie);
    }

    $elementsCombines.click(basculeVisibiliteFormulaire);
    $formulaireSaisie.click((e) => { e.stopPropagation(); });

    return $elementsCombines;
  }

  let $formulaireSaisie = creeFormulaire();
  let $boutonSaisie = creeBoutonSaisie($formulaireSaisie);
  $(pointInsertion).append($boutonSaisie);
}
