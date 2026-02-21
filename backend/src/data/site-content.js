export const siteContent = {
  brand: {
    name: "Prometheus Senioris",
    greekSignature: "Ignis Sophia",
    promise: "Le feu de la connaissance numerique, au service des seniors."
  },
  hero: {
    headline: "Apprendre l'informatique simplement, avec elegance et confiance",
    subheadline:
      "Prometheus aide les seniors a maitriser Excel, Word, PowerPoint et les outils IA utiles au quotidien.",
    ctaPrimary: "Voir les offres",
    ctaSecondary: "Reserver un appel",
    imagePath: "/images/pexels-fauxels-3184291.jpg",
    imageAlt: "Accompagnement numerique bienveillant pour seniors",
    metrics: [
      {
        value: "7 jours",
        label: "programme intensif par outil"
      },
      {
        value: "8 outils IA",
        label: "selectionnes pour un usage concret"
      },
      {
        value: "15 min",
        label: "exercices quotidiens adaptes"
      }
    ]
  },
  audiences: [
    {
      title: "Seniors a la maison",
      detail: "Vous souhaitez mieux utiliser ordinateur, email et documents.",
      benefit: "Objectif: autonomie numerique dans la vie quotidienne."
    },
    {
      title: "Retraites actifs",
      detail: "Vous animez une association, un club ou un projet personnel.",
      benefit: "Objectif: gagner du temps avec Excel, Word et presentations."
    },
    {
      title: "Collaborateurs experimentes",
      detail: "Vous etes en entreprise et devez adopter de nouveaux logiciels.",
      benefit: "Objectif: rester performant avec les outils bureautiques et IA."
    }
  ],
  coreTrainings: [
    {
      id: "excel-base",
      title: "Excel Base",
      level: "Debutant",
      duration: "1 semaine",
      price: "59 EUR",
      points: [
        "Creer un tableau clair",
        "Formules essentielles (somme, moyenne, pourcentage)",
        "Trier, filtrer, imprimer proprement"
      ]
    },
    {
      id: "word-base",
      title: "Word Base",
      level: "Debutant",
      duration: "1 semaine",
      price: "49 EUR",
      points: [
        "Mise en page lisible",
        "Modeles de lettres et documents administratifs",
        "Insertion d'images et export PDF"
      ]
    },
    {
      id: "powerpoint-base",
      title: "PowerPoint Base",
      level: "Debutant",
      duration: "1 semaine",
      price: "49 EUR",
      points: [
        "Structurer une presentation simple",
        "Choisir les bons visuels",
        "Presenter avec confiance"
      ]
    }
  ],
  pillars: [
    {
      title: "Pedagogie senior-first",
      description:
        "Navigation claire, rythme progressif, vocabulaire simple et repetition intelligente."
    },
    {
      title: "Pratique orientee resultats",
      description:
        "Chaque session construit une tache reelle: mail, document, tableau, presentation, recherche IA."
    },
    {
      title: "Accompagnement humain",
      description:
        "Coaching individuel, retour sur les blocages et mini-plan de progression personnalise."
    }
  ],
  weeklyPath: [
    {
      day: "Jour 1",
      focus: "Prise en main sereine",
      detail: "Souris, clavier, navigation web, securite de base."
    },
    {
      day: "Jour 2",
      focus: "Excel utile",
      detail: "Tableaux simples, formules essentielles, tri et filtres."
    },
    {
      day: "Jour 3",
      focus: "Word efficace",
      detail: "Mise en page claire, modeles, courrier pro et perso."
    },
    {
      day: "Jour 4",
      focus: "PowerPoint clair",
      detail: "Slides lisibles, structure de presentation, visuels percutants."
    },
    {
      day: "Jour 5",
      focus: "IA pratique",
      detail: "Prompting simple et verification des reponses."
    },
    {
      day: "Jour 6",
      focus: "Atelier personnalise",
      detail: "Cas concret du participant: entreprise, association ou quotidien."
    },
    {
      day: "Jour 7",
      focus: "Bilan + plan 30 jours",
      detail: "Autonomie, checklist et prochaines etapes."
    }
  ],
  aiTools: [
    {
      name: "ChatGPT",
      role: "Assistant polyvalent",
      usage: "Rediger, reformuler, comprendre des notions techniques."
    },
    {
      name: "Claude",
      role: "Ecriture et synthese",
      usage: "Creer des documents clairs et resumer de longs contenus."
    },
    {
      name: "Gemini",
      role: "Productivite Google",
      usage: "Aider sur Gmail, Docs et recherches guidees."
    },
    {
      name: "Mistral Le Chat",
      role: "Assistant francophone",
      usage: "Idees, Q&A et creation de contenus en francais."
    },
    {
      name: "Perplexity",
      role: "Recherche assistee",
      usage: "Trouver des informations avec sources citees."
    },
    {
      name: "Grok",
      role: "Veille et conversation",
      usage: "Explorer des sujets d'actualite et comparer des points de vue."
    },
    {
      name: "Canva IA",
      role: "Creation visuelle",
      usage: "Concevoir affiches, presentions et supports visuels rapidement."
    },
    {
      name: "Microsoft Copilot",
      role: "Bureautique Microsoft",
      usage: "Gagner du temps sur Word, Excel, Outlook et PowerPoint."
    }
  ],
  pricing: [
    {
      id: "hestia",
      name: "Hestia Decouverte",
      price: "0 EUR",
      period: "/toujours",
      description: "Ideal pour commencer sans risque.",
      highlight: false,
      features: [
        "Evaluation numerique de depart (20 min)",
        "2 modules video: Excel et securite web",
        "Fiches pratiques telechargeables",
        "Acces a la newsletter seniors"
      ],
      cta: "Commencer gratuitement"
    },
    {
      id: "athena",
      name: "Athena Semaine Active",
      price: "89 EUR",
      period: "/semaine",
      description: "Le coeur de l'offre, progression rapide et accompagnee.",
      highlight: true,
      features: [
        "Programme 7 jours sur Excel, Word, PowerPoint et IA",
        "1 classe live quotidienne (60 min)",
        "Support WhatsApp ou email",
        "Bilan final + plan d'autonomie 30 jours"
      ],
      cta: "Reserver ma semaine"
    },
    {
      id: "olympus",
      name: "Olympus Continuum",
      price: "249 EUR",
      period: "/mois",
      description: "Pour aller plus loin avec un coach dedie.",
      highlight: false,
      features: [
        "2 coachings individuels par semaine",
        "Parcours IA avance: ChatGPT, Claude, Gemini, Perplexity",
        "Bibliotheque d'exercices metier",
        "Preparation a l'environnement entreprise"
      ],
      cta: "Passer en premium"
    }
  ],
  enterprise: {
    title: "Vision SaaS entreprise",
    text: "Prometheus evolue vers une plateforme SaaS de formation continue pour les equipes en entreprise.",
    bullets: [
      "Onboarding logiciel en micro-modules metier",
      "Tableaux de bord RH avec suivi de progression",
      "Bibliotheque de parcours par role (support, vente, admin)",
      "Mode inter-entreprise pour mutualiser les bonnes pratiques"
    ]
  },
  testimonials: [
    {
      name: "Marie T.",
      profile: "Retraitee active",
      quote:
        "En une semaine, j'ai appris a faire mes tableaux Excel sans stress et a utiliser ChatGPT pour mes courriers."
    },
    {
      name: "Jacques D.",
      profile: "Consultant senior",
      quote:
        "Le format pas a pas est excellent. J'ai enfin compris comment structurer mes slides PowerPoint proprement."
    },
    {
      name: "Nadia B.",
      profile: "RH en PME",
      quote:
        "Prometheus est ideal pour accompagner les collaborateurs experimentes dans les nouveaux outils numeriques."
    }
  ],
  faq: [
    {
      question: "Le programme est-il adapte aux debutants complets ?",
      answer:
        "Oui. Nous partons des bases avec un rythme progressif et un accompagnement humain."
    },
    {
      question: "Combien de temps faut-il par jour ?",
      answer:
        "En general 45 a 60 minutes de session, puis 10 a 15 minutes de pratique quotidienne."
    },
    {
      question: "Puis-je choisir seulement Excel ou Word ?",
      answer:
        "Oui. Les formations de base peuvent etre suivies separement selon vos besoins."
    },
    {
      question: "Est-ce utile pour un usage en entreprise ?",
      answer:
        "Oui. Le parcours couvre les usages bureautiques et l'adoption d'outils IA en contexte professionnel."
    },
    {
      question: "Le formulaire fonctionne sur GitHub Pages ?",
      answer:
        "En mode demo statique non. Le formulaire complet fonctionne avec la version backend deployee."
    }
  ]
};
