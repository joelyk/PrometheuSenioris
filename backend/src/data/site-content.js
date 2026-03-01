export const siteContent = {
  brand: {
    name: "Prometheus",
    greekSignature: "Ignis Sophia",
    promise:
      "Aide simple pour vos fichiers, vos documents, vos CV, vos outils IA et vos visuels.",
    description:
      "Prometheus aide les particuliers, les etudiants, les independants et les petites equipes a mieux travailler sur ordinateur.",
    phoneNumberDisplay: "+33 7 58 93 35 65",
    phoneNumberLink: "+33758933565",
    callHours: "12h30-13h30 et 19h-20h"
  },
  hero: {
    headline: "Besoin d'aide sur un fichier, un document, un CV ou un visuel ?",
    subheadline:
      "Prometheus vous aide sur Excel, Word, PowerPoint, Canva, les CV, les dossiers et les outils IA. Vous pouvez demander une correction, une aide rapide ou une formation.",
    ctaPrimary: "Envoyer une demande",
    ctaSecondary: "Appeler",
    imagePath: "/images/pexels-kampus-7551617.jpg",
    imageAlt: "Accompagnement informatique et bureautique en session de travail",
    metrics: [
      {
        value: "24h",
        label: "pour une premiere reponse simple"
      },
      {
        value: "6 services",
        label: "Excel, Word, PowerPoint, CV, IA et Canva"
      },
      {
        value: "1 contact",
        label: "formulaire ou telephone"
      }
    ]
  },
  audiences: [
    {
      title: "Particuliers",
      detail: "Besoin d'aide pour un document, un CV, une presentation ou un fichier bloque.",
      benefit: "But: aller plus vite et avoir un resultat propre."
    },
    {
      title: "Etudiants",
      detail: "Besoin d'aide pour un memoire, un dossier, un tableau ou un support oral.",
      benefit: "But: rendre le travail plus clair et plus propre."
    },
    {
      title: "Independants et TPE",
      detail: "Besoin d'outils simples pour mieux produire, mieux presenter et mieux s'organiser.",
      benefit: "But: gagner du temps sans compliquer le travail."
    },
    {
      title: "Equipes et collaborateurs",
      detail: "Besoin d'aide sur les logiciels, les documents clients et les bons usages de l'IA.",
      benefit: "But: travailler plus vite et avec moins de blocages."
    }
  ],
  serviceCategories: [
    {
      id: "office",
      title: "Excel, Word et PowerPoint",
      summary:
        "Aide rapide sur vos fichiers, vos tableaux, vos documents et vos presentations.",
      items: [
        "Corriger un tableau Excel",
        "Mettre un document Word au propre",
        "Refaire une presentation PowerPoint",
        "Debloquer une tache precise"
      ],
      cta: "Demander une aide bureautique"
    },
    {
      id: "documents",
      title: "Documents, dossiers et memoires",
      summary:
        "Aide pour organiser, corriger et finaliser vos documents importants.",
      items: [
        "Relire un memoire ou un rapport",
        "Faire un sommaire et une pagination propres",
        "Reorganiser un dossier",
        "Sortir un PDF net"
      ],
      cta: "Faire corriger mon document"
    },
    {
      id: "cv",
      title: "CV, profil et candidature",
      summary:
        "Creation ou refonte de CV et aide pour mieux presenter votre parcours.",
      items: [
        "Creer un CV clair",
        "Refaire un CV deja existant",
        "Aider pour le message ou la lettre",
        "Donner une version PDF et modifiable"
      ],
      cta: "Refaire mon CV"
    },
    {
      id: "ai",
      title: "Outils IA",
      summary:
        "Comprendre les outils IA utiles pour ecrire, chercher, resumer et gagner du temps.",
      items: [
        "Prendre en main ChatGPT",
        "Choisir le bon outil IA",
        "Reecrire ou resumer un texte",
        "Verifier avant d'envoyer"
      ],
      cta: "Comprendre les outils IA"
    },
    {
      id: "canva",
      title: "Canva et visuels",
      summary:
        "Creation ou correction de visuels simples pour un CV, un support, un reseau ou une presentation.",
      items: [
        "Creer un visuel Canva simple",
        "Refaire un CV sur Canva",
        "Monter une affiche ou un post",
        "Rendre une slide plus lisible"
      ],
      cta: "Demander une aide Canva"
    },
    {
      id: "training",
      title: "Formation simple",
      summary:
        "Apprendre pas a pas un outil ou une methode sans mots compliques.",
      items: [
        "Apprendre Excel a votre rythme",
        "Mieux utiliser Word",
        "Faire des slides plus claires",
        "Comprendre Canva ou l'IA"
      ],
      cta: "Choisir une formation"
    }
  ],
  workflow: [
    {
      step: "01",
      title: "Vous expliquez le besoin",
      detail: "Vous envoyez le formulaire ou vous appelez. Vous dites simplement ce que vous voulez faire."
    },
    {
      step: "02",
      title: "Vous recevez une reponse",
      detail: "Prometheus vous dit quoi faire ensuite: devis, aide rapide, formation ou appel."
    },
    {
      step: "03",
      title: "Vous validez la suite",
      detail: "Vous choisissez le creneau, le devis ou la formule qui vous convient."
    },
    {
      step: "04",
      title: "Le travail commence",
      detail: "Vous recevez le resultat ou la formation avec des explications claires."
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
      imagePath: "/images/pexels-kampus-7983612.jpg",
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
      imagePath: "/images/pexels-kampus-7983616.jpg",
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
    },
    {
      id: "canva-pratique",
      title: "Canva Pratique",
      level: "Debutant",
      duration: "1 h 20 + exercices simples",
      price: "29 EUR",
      format: "Texte + video",
      summary:
        "Apprendre a faire un visuel simple, un CV propre ou une presentation legere sur Canva.",
      imagePath: "/images/pexels-kampus-7551617.jpg",
      outcomes: [
        "Creer un visuel propre",
        "Choisir un modele simple",
        "Exporter en bon format"
      ],
      lessons: [
        {
          id: "canva-text-1",
          title: "Prendre un modele simple",
          type: "Texte",
          duration: "8 min",
          summary: "Choisir un bon point de depart sans se perdre.",
          locked: false
        },
        {
          id: "canva-video-1",
          title: "Capsule video: refaire un visuel en quelques minutes",
          type: "Video",
          duration: "7 min",
          summary: "Exemple simple sur un visuel Canva.",
          locked: false
        },
        {
          id: "canva-premium-1",
          title: "Exercice guide et correction",
          type: "Premium",
          duration: "15 min",
          summary: "Faire un visuel propre de A a Z.",
          locked: true
        },
        {
          id: "canva-premium-2",
          title: "Adapter un visuel pour CV ou reseaux",
          type: "Premium",
          duration: "16 min",
          summary: "Utiliser le meme contenu sur plusieurs formats.",
          locked: true
        }
      ]
    }
  ],
  aiTools: [
    {
      name: "ChatGPT",
      role: "Ecrire, resumer, trouver des idees",
      usage: "Pour clarifier un texte, resumer un sujet, preparer un plan ou gagner du temps sur une premiere version."
    },
    {
      name: "Claude",
      role: "Lecture longue et reformulation",
      usage: "Utile pour relire un document dense et proposer une reformulation plus propre."
    },
    {
      name: "Gemini",
      role: "Recherche et outils Google",
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
      role: "Visuels, CV et presentions",
      usage: "Pour faire un CV, une affiche, un visuel reseau ou une slide simple plus vite."
    }
  ],
  pricing: [
    {
      id: "diagnostic",
      name: "Diagnostic express",
      price: "0 EUR",
      period: "une fois",
      description: "Pour comprendre le besoin et choisir la bonne formule.",
      features: [
        "Lecture rapide de votre besoin",
        "Reponse simple par email ou telephone",
        "Orientation vers le bon service"
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
        "Suite geree par formulaire ou appel"
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
      { value: "cv", label: "CV / recherche d'emploi" },
      { value: "ai", label: "IA / outils rapides" },
      { value: "canva", label: "Canva / visuel" },
      { value: "training", label: "Formation" },
      { value: "autre", label: "Autre besoin informatique" }
    ],
    slots: [
      { value: "asap", label: "Le plus vite possible" },
      { value: "this-week", label: "Cette semaine" },
      { value: "next-week", label: "Semaine prochaine" },
      { value: "flexible", label: "Flexible" }
    ],
    checklist: [
      "Dites ce que vous voulez faire",
      "Ajoutez le delai si c'est urgent",
      "Precisez si vous voulez une aide, une correction ou une formation",
      "Laissez un numero si vous voulez etre rappele"
    ]
  },
  security: {
    title: "Vos donnees sont traitees avec attention",
    intro:
      "Prometheus ne demande que les informations utiles pour comprendre votre besoin. Les documents sont utilises seulement pour l'aide demandee.",
    commitments: [
      "Collecte minimale des informations de contact et de besoin",
      "Aucune cle IA exposee dans le frontend",
      "Rate limiting et CORS sur l'API",
      "Verification humaine avant toute livraison importante",
      "Suppression ou archivage restreint des contenus sensibles selon le contexte"
    ],
    note:
      "Pour des contenus tres sensibles, la prochaine etape utile reste un espace securise avec authentification forte."
  },
  enterprise: {
    title: "Prometheus peut aussi aider une petite equipe",
    text:
      "Le service peut aussi aider une petite equipe sur les logiciels du quotidien, les supports internes et les bons usages de l'IA.",
    bullets: [
      "Parcours internes sur les logiciels du quotidien",
      "Aide a la redaction de supports et procedures",
      "Montage de mini bibliotheques de formation",
      "Aide simple pour bien utiliser l'IA"
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
  blogPosts: [
    {
      id: "excel-demande-claire",
      category: "Productivite",
      title: "Comment cadrer une demande Excel avant de demander de l'aide",
      excerpt:
        "Les 4 informations a fournir pour obtenir une reponse rapide sur un tableau, une formule ou un fichier a corriger.",
      readTime: "4 min",
      imagePath: "/images/pexels-kampus-7983612.jpg",
      intro:
        "Une demande Excel bien formulee evite les allers-retours inutiles. Le but n'est pas seulement de dire qu'un fichier bloque, mais d'expliquer ce que vous attendez a la fin.",
      sections: [
        {
          title: "1. Donner le resultat attendu",
          body:
            "Expliquez d'abord ce que vous voulez obtenir: un total, un pourcentage, un tableau propre, un graphique ou une correction complete du fichier."
        },
        {
          title: "2. Montrer ou se situe le blocage",
          body:
            "Precisez si le probleme vient d'une formule, d'un filtre, d'un format de cellule, d'un tri ou d'une organisation generale du tableau."
        },
        {
          title: "3. Indiquer le delai",
          body:
            "Un besoin pour aujourd'hui, pour une reunion demain ou pour une remise de dossier ne se traite pas de la meme maniere. Le delai aide a prioriser."
        }
      ],
      takeaway:
        "Plus la demande est precise, plus la reponse peut etre directe, rapide et utile."
    },
    {
      id: "ia-bon-outil",
      category: "IA",
      title: "ChatGPT, Claude ou Perplexity: quel outil choisir selon la tache",
      excerpt:
        "Une grille simple pour savoir quel assistant utiliser pour rediger, verifier ou synthetiser sans perdre de temps.",
      readTime: "5 min",
      imagePath: "/images/pexels-kampus-7983616.jpg",
      intro:
        "Tous les outils IA ne servent pas exactement a la meme chose. Le bon choix depend surtout du type de tache et du niveau de verification attendu.",
      sections: [
        {
          title: "1. Pour lancer une premiere version",
          body:
            "ChatGPT reste tres utile pour demarrer un texte, structurer un plan, reformuler ou proposer plusieurs pistes rapidement."
        },
        {
          title: "2. Pour lire un contenu long",
          body:
            "Claude est souvent plus confortable quand il faut relire un document dense, comparer des versions ou clarifier un contenu deja riche."
        },
        {
          title: "3. Pour verifier avec des sources",
          body:
            "Perplexity devient interessant lorsqu'il faut retrouver des sources ou verifier un point avant de reutiliser une information dans un livrable."
        }
      ],
      takeaway:
        "Le bon reflexe n'est pas d'utiliser un seul outil partout, mais de choisir celui qui correspond a l'action du moment."
    },
    {
      id: "document-structure",
      category: "Documents",
      title: "Les erreurs de structure qui ralentissent un memoire ou un rapport",
      excerpt:
        "Avant de corriger le style, il faut d'abord stabiliser les titres, le plan, la pagination et les parties attendues.",
      readTime: "6 min",
      imagePath: "/images/pexels-fauxels-3184291.jpg",
      intro:
        "La plupart des documents longs deviennent difficiles a corriger non pas a cause du texte lui-meme, mais parce que la structure est fragile ou incoherente.",
      sections: [
        {
          title: "1. Des titres non harmonises",
          body:
            "Quand chaque titre a un style different, le document devient instable. Il faut d'abord unifier la hierarchie avant toute mise en page fine."
        },
        {
          title: "2. Un plan qui change en cours de route",
          body:
            "Si les parties se repetent, se chevauchent ou changent d'intention, la lecture devient confuse. Le plan doit etre fixe avant la finition."
        },
        {
          title: "3. Une pagination et un sommaire non relies",
          body:
            "Un sommaire manuel ou des sauts de page mal places cassent rapidement la coherence. Les styles et sections doivent piloter la structure."
        }
      ],
      takeaway:
        "Un document propre commence par une architecture stable, pas par une decoration visuelle."
    },
    {
      id: "securite-documents-ia",
      category: "Securite",
      title: "Ce qu'il faut verifier avant d'envoyer un document ou un contenu a corriger",
      excerpt:
        "Un rappel simple des bonnes pratiques pour proteger les informations utiles, limiter les risques et garder la maitrise des donnees partagees.",
      readTime: "5 min",
      imagePath: "/images/pexels-kampus-7551617.jpg",
      intro:
        "Quand un document contient des informations personnelles, professionnelles ou confidentielles, il faut partager uniquement ce qui est necessaire a la mission.",
      sections: [
        {
          title: "1. Retirer ce qui n'est pas utile",
          body:
            "Supprimez ou masquez les informations non necessaires: identifiants, donnees bancaires, numeros sensibles ou commentaires internes qui ne servent pas a la correction."
        },
        {
          title: "2. Clarifier l'objectif exact",
          body:
            "Indiquez si vous voulez une correction, une mise en page, une reformulation ou un accompagnement. Cela evite de partager plus de contenu que necessaire."
        },
        {
          title: "3. Verifier avant reutilisation",
          body:
            "Quand une IA est utilisee pour aider a reformuler ou synthetiser, une verification humaine reste obligatoire avant tout envoi final ou diffusion."
        }
      ],
      takeaway:
        "La bonne pratique n'est pas de tout transmettre, mais de transmettre seulement ce qui permet de faire correctement le travail."
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
        "Le site sert d'abord a envoyer la demande. Ensuite, vous recevez un devis simple ou un creneau, puis la suite se fait par email ou par telephone."
    },
    {
      question: "Peut-on envoyer un document sensible ?",
      answer:
        "Oui, mais uniquement si cela est necessaire a la mission. Le site insiste sur la confidentialite et l'etape suivante recommandee en production est un espace securise avec authentification forte."
    },
    {
      question: "Les formations sont-elles disponibles immediatement ?",
      answer:
        "Une partie du contenu reste visible gratuitement. Les modules complets, les videos et les exercices corriges s'ouvrent apres validation de la formule choisie."
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



