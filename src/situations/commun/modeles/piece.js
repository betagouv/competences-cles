import EventEmitter from 'events';

export const CHANGEMENT_POSITION = 'changementPosition';
export const CHANGEMENT_SELECTION = 'changementSelection';

export const DISPARITION_PIECE = 'disparitionPiece';

export const PIECE_BIEN_PLACEE = 'pieceBienPlacée';
export const PIECE_MAL_PLACEE = 'pieceMalPlacée';
export const PIECE_DEPOSE_HORS_BACS = 'pieceDeposeHorsBacs';

export default class Piece extends EventEmitter {
  constructor ({ x, y, type, largeur, hauteur, categorie }) {
    super();
    this.x = x;
    this.y = y;
    this.type = type;
    this._dimensions = { largeur, hauteur };
    this._categorie = categorie;
    this.selectionnee = false;
  }

  position () {
    return { x: this.x, y: this.y };
  }

  dimensions () {
    return this._dimensions;
  }

  categorie () {
    return this._categorie;
  }

  changePosition ({ x, y }) {
    this.x = Math.min(100 - this._dimensions.largeur, Math.max(0, x));
    this.y = Math.min(100 - this._dimensions.hauteur, Math.max(0, y));

    this.emit(CHANGEMENT_POSITION, { x: this.x, y: this.y });
  }

  estSelectionnee () {
    return this.selectionnee;
  }

  selectionne ({ x, y }) {
    this.decalageSelection = { dx: x - this.x, dy: y - this.y };
    this.changeSelection(true);
  }

  deselectionne () {
    this.changeSelection(false);
  }

  changeSelection (selectionne) {
    if (this.selectionnee !== selectionne) {
      this.selectionnee = selectionne;
      this.emit(CHANGEMENT_SELECTION, selectionne);
    }
  }

  deplaceSiSelectionnee ({ x, y }) {
    if (this.estSelectionnee()) {
      this.changePosition({ x: x - this.decalageSelection.dx, y: y - this.decalageSelection.dy });
    }
  }
}
