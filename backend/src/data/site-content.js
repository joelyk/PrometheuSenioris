export const siteContent = {
  brand: {
    name: "Prometheus",
    greekSignature: "Ignis Sophia",
    promise:
      "Accompagnement informatique, documents et IA pour aller plus vite, plus proprement, plus sereinement.",
    description:
      "Prometheus accompagne particuliers, etudiants, independants et petites equipes sur les taches numeriques concretes.",
    whatsappBaseUrl: "https://api.whatsapp.com/send",
    quoteMessage: "Bonjour Prometheus, je souhaite demander un devis.",
    bookingMessage: "Bonjour Prometheus, je souhaite reserver un creneau.",
    paymentMessage: "Bonjour Prometheus, je souhaite finaliser mon paiement."
  },
  hero: {
    headline: "Vos besoins informatiques et vos documents traites avec methode.",
    subheadline:
      "Prometheus resout vos taches bureautiques, vous aide a produire des documents solides, a comprendre l'IA et a suivre des formations personnalisees sur Excel, Word, PowerPoint et les usages numeriques utiles.",
    ctaPrimary: "Demander un devis",
    ctaSecondary: "Reserver un creneau",
    imagePath: "/images/pexels-fauxels-3184291.jpg",
    imageAlt: "Accompagnement informatique et bureautique en session de travail",
    metrics: [
      {
        value: "24h",
        label: "pour cadrer une demande et proposer une suite claire"
      },
      {
        value: "4 axes",
        label: "bureautique, documents, IA et formation personnalisee"
      },
      {
        value: "1 interlocuteur",
        label: "du devis initial a la livraison et au suivi"
      }
    ]
  },
  audiences: [
    {
      title: "Particuliers",
      detail: "Besoin d'aide pour un document, un CV, une presentation ou une tache numerique urgente.",
      benefit: "Objectif: gagner du temps et obtenir un resultat propre sans bricolage."
    },
    {
      title: "Etudiants",
      detail: "Besoin de structurer un memoire, un dossier, un tableau ou une soutenance.",
      benefit: "Objectif: clarifier le fond, la forme et la qualite de presentation."
    },
    {
      title: "Independants et TPE",
      detail: "Besoin d'outils simples pour mieux produire, mieux presenter et mieux organiser.",
      benefit: "Objectif: augmenter la productivite sans alourdir les process."
    },
    {
      title: "Equipes et collaborateurs",
      detail: "Besoin d'accompagnement sur les logiciels, les documents clients et les usages IA utiles.",
      benefit: "Objectif: fluidifier l'execution et renforcer l'autonomie des equipes."
    }
  ],
  serviceCategories: [
    {
      id: "office",
      title: "Bureautique et taches rapides",
      summary:
        "Correction de fichiers, mise en page, tableaux, presentations et interventions ciblees sur Excel, Word ou PowerPoint.",
      items: [
        "Nettoyage et mise au propre de tableaux Excel",
        "Correction ou finalisation de documents Word",
        "Slides PowerPoint lisibles et presentables",
        "Aide ponctuelle sur une tache bloquee"
      ],
      cta: "Demander un devis bureautique"
    },
    {
      id: "documents",
      title: "Redaction et documents professionnels",
      summary:
        "Aide a la structuration de memoires, dossiers, supports de cours, notes de synthese, lettres et livrables professionnels.",
      items: [
        "Mise en forme et relecture de memoires",
        "Structuration de dossiers ou rapports",
        "Creation de templates documentaires",
        "Export PDF, sommaire, pagination, harmonisation"
      ],
      cta: "Faire cadrer mon document"
    },
    {
      id: "cv",
      title: "CV, profil et candidature",
      summary:
        "Creation ou refonte de CV, optimisation LinkedIn et accompagnement sur la presentation des experiences.",
      items: [
        "Creation de CV clair et moderne",
        "Refonte d'un CV existant",
        "Aide a la lettre ou au message d'accompagnement",
        "Version PDF et version editable"
      ],
      cta: "Refaire mon CV"
    },
    {
      id: "ai",
      title: "IA utile et productivite",
      summary:
        "Comprendre ChatGPT, Claude, Gemini, Mistral ou Perplexity pour rediger, rechercher, synthetiser et gagner du temps correctement.",
      items: [
        "Prise en main de ChatGPT et des prompts utiles",
        "Comparaison d'outils IA selon le besoin",
        "Relecture, reformulation et synthese de contenus",
        "Bonnes pratiques de confidentialite et verification"
      ],
      cta: "Comprendre les outils IA"
    }
  ],
  workflow: [
    {
      step: "01",
      title: "Vous expliquez le besoin",
      detail: "Par formulaire ou WhatsApp: objectif, delai, support, niveau et blocage principal."
    },
    {
      step: "02",
      title: "Prometheus cadre la demande",
      detail: "Vous recevez une recommandation: devis, mini mission, formation ou session reservee."
    },
    {
      step: "03",
      title: "Validation et paiement",
      detail: "Le paiement et les derniers ajustements se finalisent sur WhatsApp pour aller vite."
    },
    {
      step: "04",
      title: "Execution et suivi",
      detail: "Livraison, correction, ou formation pas a pas avec retour clair et actionnable."
    }
  ],
  trainingModules: [
    {
      id: "excel-essentiel",
      title: "Excel Essentiel",
      level: "Debutant a intermediaire",
      duration: "2 h de contenu + atelier personnalise",
      price: "39 EUR",
      format: "Texte + capsules video",
      summary:
        "Comprendre les bases solides: tableaux propres, formules utiles, filtres, pourcentages et graphiques simples.",
      imagePath: "/images/pexels-fauxels-3184291.jpg",
      outcomes: [
        "Creer un tableau exploitable rapidement",
        "Utiliser SOMME, MOYENNE et pourcentage",
        "Presenter un mini reporting lisible"
      ],
      lessons: [
        {
          id: "excel-text-1",
          title: "Demarrer un tableau propre",
          type: "Texte",
          duration: "12 min",
          summary: "Structure de colonnes, titres, formats et hygiene de fichier.",
          locked: false
        },
        {
          id: "excel-video-1",
          title: "Capsule video: calculer un total et un pourcentage",
          type: "Video",
          duration: "8 min",
          summary: "Demonstration commentee sur une feuille simple.",
          locked: false
        },
        {
          id: "excel-premium-1",
          title: "Exercice guide + correction complete",
          type: "Premium",
          duration: "18 min",
          summary: "Application sur un mini tableau de suivi avec correction pas a pas.",
          locked: true
        },
        {
          id: "excel-premium-2",
          title: "Graphiques et mise en forme finale",
          type: "Premium",
          duration: "14 min",
          summary: "Transformer le tableau en support presentable.",
          locked: true
        }
      ]
    },
    {
      id: "word-impact",
      title: "Word Impact",
      level: "Debutant a avance",
      duration: "1 h 40 de contenu + retours documentaires",
      price: "35 EUR",
      format: "Texte + video + modele",
      summary:
        "Structurer un document propre: styles, sommaire, pagination, images, sections et export PDF fiable.",
      imagePath: "/images/pexels-fauxels-3184291.jpg",
      outcomes: [
        "Monter un document long sans chaos",
        "Uniformiser titres et sous-titres",
        "Produire un PDF propre pour livraison"
      ],
      lessons: [
        {
          id: "word-text-1",
          title: "Les styles qui evitent les documents casses",
          type: "Texte",
          duration: "10 min",
          summary: "La base pour garder une mise en page stable du debut a la fin.",
          locked: false
        },
        {
          id: "word-video-1",
          title: "Capsule video: sommaire automatique et pagination",
          type: "Video",
          duration: "7 min",
          summary: "Demonstration de la structure d'un memoire ou rapport.",
          locked: false
        },
        {
          id: "word-premium-1",
          title: "Template de rapport et page de garde",
          type: "Premium",
          duration: "16 min",
          summary: "Modele reutilisable pour dossiers, rapports et memoires.",
          locked: true
        },
        {
          id: "word-premium-2",
          title: "Correction assistee d'un document reel",
          type: "Premium",
          duration: "20 min",
          summary: "Methode de relecture, harmonisation et livraison.",
          locked: true
        }
      ]
    },
    {
      id: "powerpoint-clair",
      title: "PowerPoint Clair",
      level: "Debutant a intermediaire",
      duration: "1 h 30 + atelier de repetition",
      price: "35 EUR",
      format: "Texte + storyboard video",
      summary:
        "Construire une presentation lisible, concise et convaincante sans surcharger les slides.",
      imagePath: "/images/pexels-fauxels-3184291.jpg",
      outcomes: [
        "Structurer une histoire slide par slide",
        "Choisir une hierarchie visuelle propre",
        "Preparer une soutenance ou une reunion"
      ],
      lessons: [
        {
          id: "ppt-text-1",
          title: "Storyboard simple avant de dessiner les slides",
          type: "Texte",
          duration: "9 min",
          summary: "Comment poser le message avant le design.",
          locked: false
        },
        {
          id: "ppt-video-1",
          title: "Capsule video: transformer un brouillon en slide propre",
          type: "Video",
          duration: "6 min",
          summary: "Avant/apres sur un cas concret.",
          locked: false
        },
        {
          id: "ppt-premium-1",
          title: "Pack de slides premium + logique orale",
          type: "Premium",
          duration: "15 min",
          summary: "Plan complet pour une presentation plus professionnelle.",
          locked: true
        },
        {
          id: "ppt-premium-2",
          title: "Relecture de votre presentation",
          type: "Premium",
          duration: "20 min",
          summary: "Feedback structure, design et oralite.",
          locked: true
        }
      ]
    }
  ],
  aiTools: [
    {
      name: "ChatGPT",
      role: "Redaction, synthese, ideation",
      usage: "Pour clarifier un texte, resumer un sujet, preparer un plan ou gagner du temps sur une premiere version."
    },
    {
      name: "Claude",
      role: "Lecture longue et reformulation",
      usage: "Utile pour relire un document dense et proposer une reformulation plus propre."
    },
    {
      name: "Gemini",
      role: "Recherche guidee et productivite Google",
      usage: "Interesse surtout les utilisateurs de Google Workspace et de recherches rapides."
    },
    {
      name: "Mistral Le Chat",
      role: "Assistant francophone",
      usage: "Pertinent pour garder une approche simple sur des demandes en francais."
    },
    {
      name: "Perplexity",
      role: "Recherche avec sources",
      usage: "Pratique quand il faut verifier rapidement une information avant livraison."
    },
    {
      name: "Canva",
      role: "Design rapide et CV",
      usage: "Pour produire un CV, une affiche, une slide ou un visuel presentable plus vite."
    }
  ],
  pricing: [
    {
      id: "diagnostic",
      name: "Diagnostic express",
      price: "0 EUR",
      period: "une fois",
      description: "Pour cadrer le besoin, verifier la faisabilite et choisir la bonne formule.",
      features: [
        "Lecture rapide de votre besoin",
        "Orientation vers le bon service",
        "Proposition de suite sur WhatsApp"
      ],
      cta: "Recevoir un premier avis",
      highlight: false
    },
    {
      id: "mission-ciblee",
      name: "Mission ciblee",
      price: "49 EUR",
      period: "par besoin",
      description: "Pour une tache precise, un document urgent ou une aide bureautique ponctuelle.",
      features: [
        "Une mission bien definie",
        "Retours et correction inclus",
        "Paiement finalise sur WhatsApp"
      ],
      cta: "Demander un devis",
      highlight: true
    },
    {
      id: "formation-personnalisee",
      name: "Formation personnalisee",
      price: "129 EUR",
      period: "par session",
      description: "Pour apprendre en profondeur avec contenu, session reservee et suivi.",
      features: [
        "Programme adapte a votre niveau",
        "Support texte + video + exercices",
        "Suivi apres la session"
      ],
      cta: "Reserver un creneau",
      highlight: false
    }
  ],
  reservation: {
    requestTypes: [
      { value: "devis", label: "Demande de devis" },
      { value: "creneau", label: "Reservation de creneau" },
      { value: "formation", label: "Debloquer une formation" }
    ],
    services: [
      { value: "office", label: "Excel / Word / PowerPoint" },
      { value: "documents", label: "Memoire / dossier / rapport" },
      { value: "cv", label: "CV / candidature" },
      { value: "ai", label: "IA et productivite" },
      { value: "autre", label: "Autre besoin informatique" }
    ],
    slots: [
      { value: "asap", label: "Le plus vite possible" },
      { value: "this-week", label: "Cette semaine" },
      { value: "next-week", label: "Semaine prochaine" },
      { value: "flexible", label: "Flexible" }
    ],
    checklist: [
      "Expliquez la tache ou le resultat attendu",
      "Ajoutez le delai si la demande est urgente",
      "Indiquez si vous souhaitez une execution, une correction ou une formation",
      "Prometheus revient vers vous avec la suite la plus simple"
    ]
  },
  security: {
    title: "Confidentialite, clarification et execution propre",
    intro:
      "Les demandes sont traitees avec sobriete: seules les informations utiles a la mission sont collectees, les documents sont utilises pour l'accompagnement demande, et les bonnes pratiques de verification sont appliquees sur les contenus IA.",
    commitments: [
      "Collecte minimale des informations de contact et de besoin",
      "Aucune cle IA exposee dans le frontend",
      "Rate limiting et CORS sur l'API",
      "Verification humaine avant toute livraison importante",
      "Suppression ou archivage restreint des contenus sensibles selon le contexte"
    ],
    note:
      "Pour une mise en production sensible, l'etape suivante logique est d'ajouter une vraie authentification et un stockage chiffre cote serveur."
  },
  enterprise: {
    title: "Prometheus peut aussi accompagner les petites equipes",
    text:
      "La logique du site peut evoluer vers une offre plus structuree pour les entreprises: onboarding logiciel, documentation interne, capsules de formation et assistance a la prise en main d'outils metier.",
    bullets: [
      "Parcours internes sur les logiciels du quotidien",
      "Aide a la redaction de supports et procedures",
      "Montage de mini bibliotheques de formation",
      "Accompagnement a l'adoption raisonnee de l'IA"
    ]
  },
  testimonials: [
    {
      name: "Amina",
      profile: "Etudiante en master",
      quote:
        "Mon memoire est enfin propre et coherent. J'ai surtout gagne du temps sur Word et la structure finale."
    },
    {
      name: "Brice",
      profile: "Consultant independant",
      quote:
        "J'avais besoin d'un support PowerPoint rapide et d'un tableau Excel lisible. La mission etait cadre en quelques messages."
    },
    {
      name: "Claire",
      profile: "Responsable administrative",
      quote:
        "L'aide sur ChatGPT et la reformulation de documents m'a permis d'aller plus vite tout en gardant le controle."
    }
  ],
  faq: [
    {
      question: "Prometheus fait-il a ma place ou m'apprend a faire ?",
      answer:
        "Les deux existent. Selon le besoin, Prometheus peut executer une tache, corriger un support, ou construire une formation personnalisee pour vous rendre autonome."
    },
    {
      question: "Comment se passe le paiement ?",
      answer:
        "Le cadrage initial se fait sur le site puis la finalisation du paiement et des details pratiques se fait sur WhatsApp pour aller vite."
    },
    {
      question: "Peut-on envoyer un document sensible ?",
      answer:
        "Oui, mais uniquement si cela est necessaire a la mission. Le site insiste sur la confidentialite et l'etape suivante recommandee en production est un espace securise avec authentification forte."
    },
    {
      question: "Les formations sont-elles disponibles immediatement ?",
      answer:
        "Une partie du contenu reste visible gratuitement. Les modules complets, videos et exercices corriges se debloquent via une demande de devis ou un paiement finalise sur WhatsApp."
    }
  ]
};

export function buildSiteContent(overrides = {}) {
  const content = JSON.parse(JSON.stringify(siteContent));

  if (typeof overrides.heroImagePath === "string" && overrides.heroImagePath.trim()) {
    content.hero.imagePath = overrides.heroImagePath.trim();
  }

  const moduleImages = overrides.moduleImages;
  if (moduleImages && typeof moduleImages === "object") {
    content.trainingModules = content.trainingModules.map((module) => ({
      ...module,
      imagePath:
        typeof moduleImages[module.id] === "string" && moduleImages[module.id].trim()
          ? moduleImages[module.id].trim()
          : module.imagePath
    }));
  }

  return content;
}

