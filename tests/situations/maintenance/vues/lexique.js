import { shallowMount, createLocalVue } from '@vue/test-utils';
import Lexique, { CHOIX_FRANCAIS, CHOIX_PASFRANCAIS } from 'maintenance/vues/lexique';
import EvenementIdentificationMot from 'maintenance/modeles/evenement_identification_mot';
import EvenementApparitionMot from 'maintenance/modeles/evenement_apparition_mot';
import MockDepotRessources from '../aides/mock_depot_ressources_maintenance';

describe('La vue lexique de la Maintenance', function () {
  let wrapper;
  let localVue;

  beforeEach(function () {
    localVue = createLocalVue();
    localVue.prototype.$depotRessources = new MockDepotRessources();
    localVue.prototype.$journal = { enregistre () {} };
    wrapper = shallowMount(Lexique, {
      localVue,
      propsData: {
        lexique: [{ mot: 'ballon', type: '' }, { mot: 'douermatho', type: '' }, { mot: 'saumon', type: '' }]
      },
      methods: { prepareMotSuivant () {} }
    });
  });

  it('affiche la croix de fixation', function () {
    wrapper.vm.affichePointDeFixation();
    expect(wrapper.findAll('.croix').length).to.eql(1);
  });

  it('affiche le mot', function () {
    wrapper.vm.afficheMot();
    expect(wrapper.findAll('.croix').length).to.eql(0);
    expect(wrapper.find('.mot').text()).to.eql('ballon');
  });

  it('empêche de passer au mot suivant tant que la croix est affichée', function () {
    let appelAMotSuivant = 0;
    wrapper.setMethods({ prepareMotSuivant () { appelAMotSuivant++; } });
    wrapper.vm.affichePointDeFixation();
    wrapper.trigger('keydown.left');
    expect(wrapper.findAll('.croix').length).to.eql(1);
    expect(appelAMotSuivant).to.eql(0);
  });

  it("terminer est à true lorsque l'on a vu tout les mots", function () {
    let appelAMotSuivant = 0;
    wrapper.setMethods({ prepareMotSuivant () { appelAMotSuivant++; } });
    expect(wrapper.vm.termine).to.be(false);
    wrapper.vm.afficheMot();
    wrapper.vm.afficheMot();
    expect(wrapper.emitted('terminer')).to.be(undefined);
    wrapper.vm.afficheMot();
    expect(wrapper.vm.termine).to.be(true);
    expect(wrapper.emitted('terminer')).to.be(undefined);
    wrapper.vm.enregistreReponse();
    expect(wrapper.emitted('terminer').length).to.eql(1);
    expect(appelAMotSuivant).to.eql(0);
  });

  describe('sur ordinateur', function () {
    beforeEach(function () {
      wrapper.vm.estMobile = false;
    });

    it("N'affiche pas les boutons permettant de répondre à la souris", function () {
      expect(wrapper.find('button').exists()).to.be(false);
      expect(wrapper.find('.touche-horizontale').exists()).to.be(true);
    });

    it("rajoute la classe action-robot--animation sur la touche de gauche pour le choix 'français'", function () {
      expect(wrapper.find('.touche-horizontale:first-child').classes('actions-robot--animation')).to.be(false);
      wrapper.vm.choixFait = CHOIX_FRANCAIS;
      expect(wrapper.find('.touche-horizontale:first-child').classes('actions-robot--animation')).to.be(true);
    });

    it("rajoute la classe action-robot--animation sur la touche de droite pour le choix 'pas français'", function () {
      expect(wrapper.find('.touche-horizontale:last-child').classes('actions-robot--animation')).to.be(false);
      wrapper.vm.choixFait = wrapper.vm.CHOIX_PASFRANCAIS;
      expect(wrapper.find('.touche-horizontale:last-child').classes('actions-robot--animation')).to.be(true);
    });
  });

  describe('sur tablette', function () {
    beforeEach(function () {
      wrapper.vm.estMobile = true;
    });

    it('affiche les boutons permettant de répondre avec le doigt', function () {
      expect(wrapper.find('button').exists()).to.be(true);
      expect(wrapper.find('.touche-horizontale').exists()).to.be(false);
    });

    it("rajoute la classe action-robot--animation sur le bouton de gauche pour le choix 'français'", function () {
      expect(wrapper.find('.bouton-arrondi:first-child').classes('actions-robot--animation')).to.be(false);
      wrapper.vm.choixFait = CHOIX_FRANCAIS;
      expect(wrapper.find('.bouton-arrondi:first-child').classes('actions-robot--animation')).to.be(true);
    });

    it("rajoute la classe action-robot--animation sur le bouton de droite pour le choix 'pas francais' ", function () {
      expect(wrapper.find('.bouton-arrondi:last-child').classes('actions-robot--animation')).to.be(false);
      wrapper.vm.choixFait = wrapper.vm.CHOIX_PASFRANCAIS;
      expect(wrapper.find('.bouton-arrondi:last-child').classes('actions-robot--animation')).to.be(true);
    });

    it("enregistre l'événement identificationMot quand on touche le bouton de gauche", function (done) {
      wrapper.setProps({ lexique: [{ mot: 'premiermot', type: 'neutre' }, { mot: 'deuxiemot', type: 'neutre' }] });
      wrapper.vm.afficheMot();
      localVue.prototype.$journal = {
        enregistre (evenement) {
          expect(evenement).to.be.a(EvenementIdentificationMot);
          expect(evenement.donnees()).to.be.eql({ mot: 'premiermot', type: 'neutre', reponse: CHOIX_FRANCAIS });
          done();
        }
      };

      wrapper.find('.bouton-arrondi:first-child').trigger('click');
    });

    it("enregistre l'événement identificationMot quand on touche le bouton de droite", function (done) {
      wrapper.setProps({ lexique: [{ mot: 'premiermot', type: 'neutre' }, { mot: 'deuxiemot', type: 'neutre' }] });
      wrapper.vm.afficheMot();
      localVue.prototype.$journal = {
        enregistre (evenement) {
          expect(evenement).to.be.a(EvenementIdentificationMot);
          expect(evenement.donnees()).to.be.eql({ mot: 'premiermot', type: 'neutre', reponse: CHOIX_PASFRANCAIS });
          done();
        }
      };

      wrapper.find('.bouton-arrondi:last-child').trigger('click');
    });
  });

  it("enregistre l'événement identificationMot", function (done) {
    wrapper.setProps({ lexique: [{ mot: 'premiermot', type: 'neutre' }, { mot: 'deuxiemot', type: 'neutre' }] });
    wrapper.vm.afficheMot();
    localVue.prototype.$journal = {
      enregistre (evenement) {
        expect(evenement).to.be.a(EvenementIdentificationMot);
        expect(evenement.donnees()).to.be.eql({ mot: 'premiermot', type: 'neutre', reponse: CHOIX_FRANCAIS });
        done();
      }
    };
    wrapper.vm.enregistreReponse(CHOIX_FRANCAIS);
  });

  it("enregistre l'événement apparitionMot", function (done) {
    localVue.prototype.$journal = {
      enregistre (evenement) {
        expect(evenement).to.be.a(EvenementApparitionMot);
        expect(evenement.donnees()).to.be.eql({ mot: 'ballon', type: '' });
        done();
      }
    };
    wrapper.vm.afficheMot();
  });
});
