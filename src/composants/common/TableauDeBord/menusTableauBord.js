import {
  FiBookOpen,
  FiCalendar,
  FiCheckSquare,
  FiCreditCard,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiList,
  FiMap,
  FiMessageSquare,
  FiPlusCircle,
  FiSettings,
  FiShield,
  FiTool,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

const lien = (to, label, icone = FiList) => ({ to, label, icone });

export const menusAdminGeneral = (peutGererAdmins = true) => {
  const menus = [
    {
      id: "vue",
      titre: "Vue générale",
      icone: FiGrid,
      to: "/admin-general/bureau_admin",
    },
  ];

  if (peutGererAdmins) {
    menus.push({
      id: "admins",
      titre: "Gestion Admin",
      icone: FiShield,
      liens: [
        lien("/admin-general/creer_admin_general", "Créer admin", FiUserPlus),
        lien("/admin-general/creer_super_admin_general", "Créer super admin", FiUserPlus),
        lien("/admin-general/suspendre_admin", "Suspendre admin", FiSettings),
      ],
    });
  }

  return [
    ...menus,
    {
      id: "provinces",
      titre: "Provinces",
      icone: FiMap,
      liens: [
        lien("/admin-general/ajouter_province", "Ajouter province", FiPlusCircle),
        lien("/admin-general/liste_province", "Liste provinces", FiList),
      ],
    },
    {
      id: "provEdu",
      titre: "Prov. éducat.",
      icone: FiLayers,
      liens: [
        lien("/admin-general/ajouter_province_educationnelle", "Ajouter province", FiPlusCircle),
        lien("/admin-general/liste_province_educationnelle", "Liste provinces", FiList),
      ],
    },
    {
      id: "ecoles",
      titre: "Écoles",
      icone: FiHome,
      liens: [
        lien("/admin-general/ajouter_ecole", "Ajouter école", FiPlusCircle),
        lien("/admin-general/liste_ecole", "Liste écoles", FiList),
        lien("/admin-general/creer_super_ecole", "Créer super admin école", FiUserPlus),
      ],
    },
  ];
};

export const menusEcole = (cycle) => [
  {
    id: "vue",
    titre: "Vue générale",
    icone: FiGrid,
    to: `/${cycle}/bureau_admin`,
  },
  {
    id: "admins",
    titre: "Gestion Admin",
    icone: FiShield,
    liens: [
      lien(`/${cycle}/creer_admin`, "Créer admin", FiUserPlus),
      lien(`/${cycle}/creer_super_admin`, "Créer super admin", FiUserPlus),
      lien(`/${cycle}/suspendre_admin`, "Suspendre admin", FiSettings),
    ],
  },
  {
    id: "cycle",
    titre: "Cycle scolaire",
    icone: FiCalendar,
    liens: [
      lien(`/${cycle}/ajouter_annee_scolaire`, "Ajouter une année", FiPlusCircle),
      lien(`/${cycle}/liste_annee_scolaire`, "Toutes les années", FiList),
      lien(`/${cycle}/ajouter_semestre`, "Ajouter un semestre", FiPlusCircle),
      lien(`/${cycle}/liste_semestre`, "Tous les semestres", FiList),
      lien(`/${cycle}/ajouter_periode`, "Ajouter une période", FiPlusCircle),
      lien(`/${cycle}/liste_periode`, "Toutes les périodes", FiList),
    ],
  },
  {
    id: "com",
    titre: "Communications",
    icone: FiMessageSquare,
    liens: [
      lien(`/${cycle}/liste_communique`, "Listes communiqués", FiList),
      lien(`/${cycle}/lancer_communique`, "Lancer communiqué", FiPlusCircle),
      lien(`/${cycle}/liste_contact`, "Messages", FiMessageSquare),
    ],
  },
  {
    id: "enseignants",
    titre: "Enseignants",
    icone: FiUsers,
    liens: [
      lien(`/${cycle}/creationcompte`, "Ajouter enseignant", FiUserPlus),
      lien(`/${cycle}/liste_enseignant`, "Tous les enseignants", FiList),
      lien(`/${cycle}/ajouter_titulaire`, "Ajouter titulaire", FiUserPlus),
      lien(`/${cycle}/liste_titulaire`, "Tous les titulaires", FiList),
    ],
  },
  {
    id: "eleves",
    titre: "Élèves",
    icone: FiUsers,
    liens: [
      lien(`/${cycle}/ajouter_eleve`, "Ajouter élève(s)", FiUserPlus),
      lien(`/${cycle}/liste_eleve`, "Tous les élèves", FiList),
      lien(`/${cycle}/cartes_eleves`, "Cartes élèves", FiCreditCard),
      lien(`/${cycle}/liste_eleve_inscrit_${cycle}`, "Élèves inscrits", FiBookOpen),
      lien(`/${cycle}/ajouter_motif_absence`, "Ajouter motif absence", FiPlusCircle),
      lien(`/${cycle}/liste_motif_absence`, "Motifs absence", FiList),
      lien(`/${cycle}/ajouter_type_travail`, "Ajouter type travail", FiPlusCircle),
      lien(`/${cycle}/liste_type_travail`, "Types travail", FiList),
    ],
  },
  {
    id: "cours",
    titre: "Cours & horaires",
    icone: FiBookOpen,
    liens: [
      lien(`/${cycle}/ajouter_cours`, "Ajouter un cours", FiPlusCircle),
      lien(`/${cycle}/liste_cours`, "Tous les cours", FiList),
      lien(`/${cycle}/liste_cours_enseigne`, "Cours & titulaires", FiList),
      ...(cycle === "secondaire" ? [lien(`/${cycle}/generer_horaire`, "Générer horaire", FiCalendar)] : []),
    ],
  },
  {
    id: "paiement",
    titre: "Paiement",
    icone: FiCreditCard,
    liens: [
      lien(`/${cycle}/ajouter_motif`, "Ajouter motif paiement", FiPlusCircle),
      lien(`/${cycle}/liste_motif`, "Listes motif", FiList),
      lien(`/${cycle}/ajouter_tranche`, "Ajouter tranche", FiPlusCircle),
      lien(`/${cycle}/liste_tranche`, "Listes tranche", FiList),
      lien(`/${cycle}/ajouter_mode_paiement`, "Ajouter un mode", FiPlusCircle),
      lien(`/${cycle}/liste_mode_paiement`, "Tous les modes", FiList),
      lien(`/${cycle}/ajouter_devise`, "Ajouter une devise", FiPlusCircle),
      lien(`/${cycle}/liste_devise`, "Listes devise", FiList),
      lien(`/${cycle}/ajouter_paiement`, "Ajouter un paiement", FiPlusCircle),
      lien(`/${cycle}/liste_paiement`, "Tous les paiements", FiList),
    ],
  },
  {
    id: "structure",
    titre: "Structure scolaire",
    icone: FiLayers,
    liens: [
      lien(`/${cycle}/ajouter_classe`, "Ajouter une classe", FiPlusCircle),
      lien(`/${cycle}/liste_classe`, "Toutes les classes", FiList),
      lien(`/${cycle}/ajouter_section`, "Ajouter une section", FiPlusCircle),
      lien(`/${cycle}/liste_section`, "Toutes les sections", FiList),
      lien(`/${cycle}/ajouter_option`, "Ajouter une option", FiPlusCircle),
      lien(`/${cycle}/liste_options`, "Toutes les options", FiList),
    ],
  },
  {
    id: "users",
    titre: "Utilisateurs",
    icone: FiTool,
    liens: [
      lien(`/${cycle}/ajouter_fonction`, "Ajouter une fonction", FiPlusCircle),
      lien(`/${cycle}/liste_fonction`, "Toutes les fonctions", FiList),
      lien(`/${cycle}/creationcompte`, "Créer utilisateur", FiUserPlus),
      lien(`/${cycle}/membres_inscrits`, "Liste utilisateurs", FiUsers),
    ],
  },
  {
    id: "rapports",
    titre: "Rapports",
    icone: FiFileText,
    liens: [
      lien(`/${cycle}/liste_paiement`, "Finances", FiCreditCard),
      lien(`/${cycle}/liste_eleve`, "Effectifs", FiUsers),
      lien(`/${cycle}/liste_horaire`, "Horaires", FiCheckSquare),
    ],
  },
];
