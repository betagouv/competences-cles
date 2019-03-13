import { DepotJournal } from 'inventaire/infra/depot_journal.js';
import jsdom from 'jsdom-global';

describe('le depot du journal', function () {
  let journal;
  let requetes = [];

  beforeEach(function () {
    jsdom('', { url: 'http://localhost' });
    requetes = [];
    journal = new DepotJournal({ ajax (params) { requetes.push(params); } });
  });

  it('enregistre les lignes du journal dans le localStorage', function () {
    journal.enregistre({ cle: 'valeur', description: { cle: 'valeur' } });
    journal.enregistre({ autreCle: 'valeur2', description: { cle: 'valeur2' } });

    const lignes = JSON.parse(window.localStorage.getItem('journal'));
    expect(lignes.length).to.equal(2);
    expect(lignes).to.eql([
      { cle: 'valeur',
        description: {
          cle: 'valeur'
        }
      },
      { autreCle: 'valeur2',
        description: {
          cle: 'valeur2'
        }
      }
    ]);
  });

  it('fait un POST des lignes du journal vers le serveur', function () {
    journal.enregistre({ autreCle: 'valeur2', description: { cle: 'valeur2' } });

    expect(requetes.length).to.equal(1);
    expect(requetes[0]['type']).to.equal('POST');
  });

  it('vérifie la conformité des données récupèrées', function () {
    const donnees = journal.recupereDonnees({ autreCle: 'valeur2', sessionId: 'ma session id', donnees: { cle: 'valeur2' } });

    expect(donnees['donnees']).to.equal('{"cle":"valeur2"}');
    expect(donnees['session_id']).to.equal('ma session id');
    expect(donnees['situation']).to.equal('inventaire');
  });

  it("vérifie s'il n'existe pas un journal au démarrage et le charge", function () {
    journal.enregistre({ nom: 'NomEvenement', description: { cle: 'valeur' } });

    journal = new DepotJournal({ ajax (params) { requetes.push(params); } });
    journal.enregistre({ nom: 'NomEvenement', description: { cle: 'valeur' } });

    const lignes = JSON.parse(window.localStorage.getItem('journal'));
    expect(lignes.length).to.equal(2);
  });

  it('retourne les lignes du journal', function () {
    journal.enregistre({ cle: 'valeur', description: { cle: 'valeur' } });
    journal.enregistre({ cle: 'valeur2', description: { cle: 'valeur2' } });

    expect(journal.evenements()).to.eql([
      { 'cle': 'valeur',
        'description': {
          'cle': 'valeur'
        }
      },
      { 'cle': 'valeur2',
        'description': {
          'cle': 'valeur2'
        }
      }
    ]
    );
  });
});
