import jsdom from 'jsdom-global';
import { DISPARITION_PIECE } from 'controle/modeles/situation';
import { Piece } from 'controle/modeles/piece';
import { VuePiece } from 'controle/vues/piece';

function creeVueMinimale (piece) {
  return new VuePiece(piece, () => {}, () => {});
}

describe('Une pièce', function () {
  let $;

  beforeEach(function () {
    jsdom('<div id="controle" style="width: 100px; height: 100px"></div>');
    $ = jQuery(window);
  });

  it("s'affiche", function () {
    const piece = new Piece({ x: 90, y: 40 });
    const vuePiece = creeVueMinimale(piece);
    expect($('.piece').length).to.equal(0);

    vuePiece.affiche('#controle', $);
    expect($('.piece').length).to.equal(1);
  });

  it("affiche l'image de la piece", function () {
    const piece = new Piece({ x: 90, y: 40, conforme: false, image: 'image-url' });
    const vuePiece = creeVueMinimale(piece);
    vuePiece.affiche('#controle', $);
    expect($('.piece').attr('src')).to.eql('image-url');
  });

  it("se positionne correctement vis-à-vis de l'élément parent", function () {
    const piece = new Piece({ x: 90, y: 40 });
    const vuePiece = creeVueMinimale(piece);

    $('#controle').width(200).height(50);
    vuePiece.affiche('#controle', $);

    expect($('.piece').css('left')).to.eql('180px');
    expect($('.piece').css('top')).to.eql('20px');
  });

  it('peut être sélectionnée', function () {
    const piece = new Piece({ x: 90, y: 40 });
    const vuePiece = creeVueMinimale(piece);
    vuePiece.affiche('#controle', $);

    expect(piece.estSelectionnee()).to.be(false);
    $('.piece').trigger($.Event('mousedown', { clientX: 95, clientY: 55 }));
    expect(piece.estSelectionnee()).to.be(true);
  });

  it('peut être désélectionnée', function () {
    const piece = new Piece({ x: 90, y: 40 });
    piece.selectionne({ x: 95, y: 55 });

    const vuePiece = creeVueMinimale(piece);
    vuePiece.affiche('#controle', $);

    expect(piece.estSelectionnee()).to.be(true);
    $('.piece').trigger($.Event('mouseup'));
    expect(piece.estSelectionnee()).to.be(false);
  });

  it('peut être bougée', function () {
    const piece = new Piece({ x: 90, y: 40 });
    const vuePiece = creeVueMinimale(piece);

    $('#controle').width(100).height(100);
    vuePiece.affiche('#controle', $);

    expect($('.piece').css('left')).to.eql('90px');
    expect($('.piece').css('top')).to.eql('40px');

    piece.changePosition({ x: 25, y: 5 });

    expect($('.piece').css('left')).to.eql('25px');
    expect($('.piece').css('top')).to.eql('5px');
  });

  it("suit une séquence d'animation pour apparaître", function (done) {
    const piece = new Piece({ x: 90, y: 40 });
    const vuePiece = new VuePiece(piece, function ($element) {
      expect($element.hasClass('.piece'));
      done();
    });

    vuePiece.affiche('#controle', $);
  });

  it("interrompt la séquence d'animation quand sélection de la pièce", function (done) {
    const piece = new Piece({ x: 90, y: 40 });
    const sequenceAnimation = function ($element) {
      $element.animate({ left: '80px' }, 0).delay(5).animate({ left: '10px' }, 0);
    };
    const vuePiece = new VuePiece(piece, sequenceAnimation);

    vuePiece.affiche('#controle', $);

    const $piece = $('.piece');
    const evenementSelectionner = $.Event('mousedown', { clientX: 95, clientY: 55 });
    $piece.trigger(evenementSelectionner);

    setTimeout(() => {
      expect($piece.css('left')).to.equal('80px');
      expect(piece.position()).to.eql({ x: 80, y: 40 });
      done();
    }, 10);
  });

  it("au moment de l'événement DISPARITION_PIECE, disparait", function (done) {
    const piece = new Piece({ x: 90, y: 40 });

    const callbackAvantSuppression = (_, callbackSuppression) => {
      callbackSuppression();
      expect($('.piece').length).to.equal(0);
      done();
    };

    const vuePiece = new VuePiece(piece, () => {}, callbackAvantSuppression);
    vuePiece.affiche('#controle', $);
    expect($('.piece').length).to.equal(1);
    piece.emit(DISPARITION_PIECE);
  });
});
