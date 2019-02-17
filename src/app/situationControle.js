import 'commun/styles/commun.scss';

import { Piece } from 'controle/modeles/piece.js';
import { VuePiece } from 'controle/vues/piece.js';

function afficheSituation (pointInsertion, $) {
  let piece = new Piece({ x: 87, y: 70 });
  let vuePiece = new VuePiece(piece);

  vuePiece.affiche(pointInsertion, $);
}

jQuery(function () {
  jQuery('head').append('<title>Situation Contrôle</title>');
  jQuery('body').append('<div id="situation-controle" class="situation"></div>');

  afficheSituation('#situation-controle', jQuery);
});
