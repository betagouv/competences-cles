import EventEmitter from 'events';

import 'controle/styles/piece.scss';

export const DUREE_VIE_PIECE_INFINIE = undefined;
export const DISPARITION_PIECE = 'disparition';

export function animationInitiale ($element) {
  $element.animate({ left: '-10%' }, 10000, 'linear');
}

export function animationFinale ($element, done) {
  $element.fadeOut(500, () => { done($element); });
}

export class VuePiece extends EventEmitter {
  constructor (piece,
    dureeVie = DUREE_VIE_PIECE_INFINIE,
    callbackApresApparition = animationInitiale,
    callbackAvantSuppression = animationFinale) {
    super();

    this.piece = piece;
    this.dureeVie = dureeVie;
    this.callbackApresApparition = callbackApresApparition;
    this.callbackAvantSuppression = callbackAvantSuppression;
  }

  affiche (pointInsertion, $) {
    function creeElementPiece (piece, dimensionsElementParent) {
      let $piece = $(`<img class="piece" src="${piece.image}">`);
      metsAJourPosition($piece, piece.position(), dimensionsElementParent);
      return $piece;
    }

    function metsAJourPosition ($piece, { x, y }, { largeurParent, hauteurParent }) {
      $piece.css('left', x * largeurParent / 100);
      $piece.css('top', y * hauteurParent / 100);
    }

    const $elementParent = $(pointInsertion);
    const dimensionsElementParent = {
      largeurParent: $elementParent.width(),
      hauteurParent: $elementParent.height()
    };
    const $piece = creeElementPiece(this.piece, dimensionsElementParent);

    $piece.mousedown(e => {
      $piece.stop(true);
      $piece.css('opacity', 1);
      this.piece.changePosition({
        x: 100 * parseInt($piece.css('left')) / $elementParent.width(),
        y: 100 * parseInt($piece.css('top')) / $elementParent.height()
      });
      this.piece.selectionne({
        x: 100 * e.clientX / $elementParent.width(),
        y: 100 * e.clientY / $elementParent.height()
      });
    });

    $piece.on('dragstart', function (event) { event.preventDefault(); });
    $piece.mouseup(e => { this.piece.deselectionne(); });

    $elementParent.mousemove(e => {
      this.piece.deplaceSiSelectionnee({
        x: 100 * e.clientX / $elementParent.width(),
        y: 100 * e.clientY / $elementParent.height()
      });
    });

    this.piece.quandChangementPosition(function (nouvellePosition) {
      metsAJourPosition($piece, nouvellePosition, dimensionsElementParent);
    });
    $elementParent.append($piece);
    $piece.show(() => { this.callbackApresApparition($piece); });

    if (this.dureeVie !== DUREE_VIE_PIECE_INFINIE) {
      setTimeout(() => {
        this.callbackAvantSuppression($piece, () => {
          $piece.remove();
          this.emit(DISPARITION_PIECE, { position: this.piece.position() });
        });
      }, this.dureeVie);
    }
  }
}
