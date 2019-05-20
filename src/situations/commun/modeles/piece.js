import EventEmitter from 'events';

export const CHANGEMENT_POSITION = 'changementPosition';
export const CHANGEMENT_SELECTION = 'changementSelection';

export default class Piece extends EventEmitter {
  constructor ({ x, y, type }) {
    super();
    this.x = x;
    this.y = y;
    this.type = type;
    this.selectionnee = false;
  }

  position () {
    return { x: this.x, y: this.y };
  }

  changePosition ({ x, y }) {
    this.x = x;
    this.y = y;

    this.emit(CHANGEMENT_POSITION, { x, y });
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
    this.selectionnee = selectionne;
    this.emit(CHANGEMENT_SELECTION, selectionne);
  }

  deplaceSiSelectionnee ({ x, y }) {
    if (this.estSelectionnee()) {
      this.changePosition({ x: x - this.decalageSelection.dx, y: y - this.decalageSelection.dy });
    }
  }
}
