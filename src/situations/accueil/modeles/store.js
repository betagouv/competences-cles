import Vue from 'vue';
import Vuex from 'vuex';
import { CHANGEMENT_CONNEXION } from 'commun/infra/registre_utilisateur';
import ErreurCampagne from 'commun/infra/erreur_campagne';
import { traduction } from 'commun/infra/internationalisation';

export const DECONNECTE = 'déconnecté';
export const CONTACT = 'contact';
export const DEMARRE = 'démarré';

Vue.use(Vuex);

export function creeStore (registreUtilisateur, registreCampagne, registreQuestionnaire, fetch = window.fetch) {
  const store = new Vuex.Store({
    state: {
      estConnecte: registreUtilisateur.estConnecte(),
      erreurFormulaireIdentification: '',
      nom: registreUtilisateur.nom(),
      nomCampagne: '',
      situations: [],
      competencesFortes: [],
      situationsFaites: registreUtilisateur.situationsFaites(),
      etat: registreUtilisateur.estConnecte() ? DEMARRE : DECONNECTE
    },
    mutations: {
      connecte (state, nom) {
        state.estConnecte = true;
        state.nom = nom;
        state.situationsFaites = [];
        state.etat = CONTACT;
      },

      deconnecte (state) {
        state.estConnecte = false;
        state.nom = '';
        state.situationsFaites = [];
        state.situations = [];
        state.competences = [];
        state.etat = DECONNECTE;
      },

      metsAJourSituations (state, situations) {
        state.situations = situations;
      },

      metsAJourCompetencesFortes (state, competencesFortes) {
        state.competencesFortes = competencesFortes.slice(0, 2);
      },

      demarre (state) {
        state.etat = DEMARRE;
      }
    },
    actions: {
      inscris ({ commit }, { nom, campagne }) {
        this.state.erreurFormulaireIdentification = '';
        return new Promise((resolve, reject) => {
          registreUtilisateur.inscris(nom, campagne)
            .then(resolve)
            .catch((xhr) => {
              if (xhr.status === 422) {
                this.state.erreurFormulaireIdentification = xhr.responseJSON;
                resolve();
              } else if (xhr.status === 0) {
                this.state.erreurFormulaireIdentification = { generale: traduction('accueil.erreurs.reseau') };
                resolve();
              } else {
                reject(xhr);
              }
            });
        });
      },
      recupereCampagne ({ commit }, { codeCampagne }) {
        this.state.erreurFormulaireIdentification = '';
        return new Promise((resolve, reject) => {
          registreCampagne.recupereCampagne(codeCampagne)
            .then((campagne) => {
              registreCampagne.assigneCampagneCourante(codeCampagne);
              console.log('recupereQuestionnaires');
              campagne.situations.forEach((situation) => {
                console.log(situation);
                const idQuestionnaire = situation.questionnaire_id;
                if (idQuestionnaire) {
                  registreQuestionnaire.recupereQuestionnaire(idQuestionnaire);
                }
                const idQuestionnaireEntrainement = situation.questionnaire_entrainement_id;
                if (idQuestionnaireEntrainement) {
                  registreQuestionnaire.recupereQuestionnaire(idQuestionnaireEntrainement);
                }
              });
              resolve(campagne);
            })
            .catch((erreur) => {
              if (erreur instanceof ErreurCampagne) {
                this.state.erreurFormulaireIdentification = { code: erreur.message };
                resolve();
              } else if (erreur.status === 0) {
                this.state.erreurFormulaireIdentification = { generale: traduction('accueil.erreurs.reseau') };
                resolve();
              } else {
                reject(erreur);
              }
            });
        });
      },
      enregistreContact ({ commit }, { email, telephone }) {
        return registreUtilisateur.enregistreContact(email, telephone)
          .then(() => {
            commit('demarre');
          });
      },
      deconnecte () {
        return registreUtilisateur.deconnecte();
      },
      synchroniseEvaluation ({ commit }) {
        return fetch(registreUtilisateur.urlEvaluation())
          .then((reponse) => {
            if (reponse.status === 404) {
              commit('deconnecte');
              throw reponse;
            }
            return reponse;
          })
          .finally((reponse) => {
            const campagne = registreCampagne.recupereCampagneCourante();
            this.state.nomCampagne = campagne.libelle;

            const situations = campagne.situations.map(function (situation, index) {
              return {
                nom: situation.libelle,
                chemin: `${situation.nom_technique}.html`,
                identifiant: situation.nom_technique,
                niveauMinimum: index + 1
              };
            });
            commit('metsAJourSituations', situations);
          });
      },
      termineEvaluation ({ commit }) {
        return fetch(registreUtilisateur.urlEvaluation('fin'), { method: 'POST' })
          .then((reponse) => {
            if (reponse.status === 404) {
              throw reponse;
            }
            return reponse;
          })
          .then(reponse => reponse.json())
          .then((json) => {
            commit('metsAJourCompetencesFortes', json.competences_fortes);
          });
      }
    }
  });

  registreUtilisateur.on(CHANGEMENT_CONNEXION, () => {
    if (registreUtilisateur.estConnecte()) {
      store.commit('connecte', registreUtilisateur.nom());
    } else {
      store.commit('deconnecte');
    }
  });

  return store;
}
