/* =========================================================
   Branchement du formulaire sur le Google Form
   « M12 - 26/27 - Choix de postes »
   Les enfants ne voient jamais le Google Form : le site envoie
   les réponses en arrière-plan, elles arrivent dans l'onglet
   Réponses du Form (et dans la Google Sheet si elle est liée).
   Si tu modifies les questions du Form, les numéros entry.xxx
   peuvent changer : redemande-les à Claude.
   ========================================================= */

window.CONFIG = {
  formAction: "https://docs.google.com/forms/d/e/1FAIpQLScZ_XNon6RB2E6-PiJBvX87jD4g8rNitYsItJQZljN7UsPuUg/formResponse",
  champs: {
    prenom: "entry.739252345",
    nom: "entry.1000585772",
    choix1: "entry.321605478",
    choix2: "entry.144448490",
    choix3: "entry.1984140708",
    message: "entry.1130469255",
    test: "entry.918237936" /* résumé du test « Aide-moi à choisir » */
  }
};
