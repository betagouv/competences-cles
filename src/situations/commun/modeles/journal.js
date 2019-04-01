export class Journal {
  constructor (maintenant, session, situation, depot) {
    this.maintenant = maintenant;
    this.depot = depot;
    this.sessionId = session;
    this.situation = situation;
  }

  enregistre (evenement) {
    return this.depot.enregistre(
      {
        date: this.maintenant(),
        sessionId: this.sessionId,
        situation: this.situation,
        nom: evenement.nom(),
        donnees: evenement.donnees()
      }
    );
  }
}
