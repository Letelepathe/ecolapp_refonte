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
      titre: "Comptes & accès",
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

const periodeCycle = (cycle) =>
  cycle === "secondaire"
    ? lien(`/${cycle}/liste_semestre`, "Tous les semestres", FiList)
    : lien(`/${cycle}/liste_trimestre`, "Tous les trimestres", FiList);

export const menusEcole = (cycle) => [
  {
    id: "vue",
    titre: "Vue générale",
    icone: FiGrid,
    to: `/${cycle}/bureau_admin`,
  },
  {
    id: "admins",
    titre: "Comptes & accès",
    icone: FiShield,
    liens: [
      lien(`/${cycle}/creer_admin`, "Créer admin", FiUserPlus),
      lien(`/${cycle}/creer_super_admin`, "Créer super admin", FiUserPlus),
      lien(`/${cycle}/suspendre_admin`, "Suspendre admin", FiSettings),
    ],
  },

  {
    id: "presences-cartes",
    titre: "Présences & cartes",
    icone: FiCheckSquare,
    liens: [
      lien(`/presence-qr`, "Présences du jour & scan QR", FiCheckSquare),
      lien(`/${cycle}/cartes_eleves`, "Cartes élèves QR", FiCreditCard),
      lien(`/${cycle}/cartes_personnel`, "Cartes personnel QR", FiCreditCard),
    ],
  },
  {
    id: "cycle",
    titre: "Cycle scolaire",
    icone: FiCalendar,
    liens: [
      lien(`/${cycle}/liste_annee_scolaire`, "Toutes les années", FiList),
      periodeCycle(cycle),
      lien(`/${cycle}/liste_periode`, "Toutes les périodes", FiList),
    ],
  },
  {
    id: "com",
    titre: "Communications",
    icone: FiMessageSquare,
    liens: [
      lien(`/${cycle}/liste_communique`, "Listes communiqués", FiList),
      lien(`/${cycle}/liste_contact`, "Messages", FiMessageSquare),
    ],
  },
  {
    id: "enseignants",
    titre: "Enseignants",
    icone: FiUsers,
    liens: [
      lien(`/${cycle}/liste_enseignant`, "Tous les enseignants", FiList),
      lien(`/${cycle}/liste_titulaire`, "Tous les titulaires", FiList),
    ],
  },
  {
    id: "eleves",
    titre: "Élèves",
    icone: FiUsers,
    liens: [
      lien(`/${cycle}/liste_eleve`, "Tous les élèves", FiList),
      lien(`/${cycle}/cartes_eleves`, "Cartes élèves QR", FiCreditCard),
      lien(`/presence-qr`, "Présences du jour & scan QR", FiCheckSquare),
      lien(`/${cycle}/liste_eleve_inscrit_${cycle}`, "Élèves inscrits", FiBookOpen),
      lien(`/${cycle}/liste_motif_absence`, "Motifs absence", FiList),
      lien(`/${cycle}/liste_type_travail`, "Types travail", FiList),
    ],
  },
  {
    id: "cours",
    titre: "Cours & horaires",
    icone: FiBookOpen,
    liens: [
      lien(`/${cycle}/liste_cours`, "Tous les cours", FiList),
      lien(`/${cycle}/liste_cours_enseigne`, "Cours & titulaires", FiList),
      ...(cycle === "secondaire" ? [lien(`/${cycle}/generer_horaire`, "Générer horaire", FiCalendar)] : []),
    ],
  },
  {
    id: "paiement",
    titre: "Finances & paiements",
    icone: FiCreditCard,
    liens: [
      lien(`/${cycle}/liste_motif`, "Listes motif", FiList),
      lien(`/${cycle}/liste_tranche`, "Listes tranche", FiList),
      lien(`/${cycle}/liste_mode_paiement`, "Tous les modes", FiList),
      lien(`/${cycle}/liste_devise`, "Listes devise", FiList),
      lien(`/${cycle}/liste_paiement`, "Tous les paiements", FiList),
    ],
  },
  
  {
    id: "structure",
    titre: "Structure scolaire",
    icone: FiLayers,
    liens: [
      lien(`/${cycle}/liste_classe`, "Toutes les classes", FiList),
      lien(`/${cycle}/liste_section`, "Toutes les sections", FiList),
      lien(`/${cycle}/liste_option`, "Toutes les options", FiList),
    ],
  },
  {
    id: "users",
    titre: "Personnel & rôles",
    icone: FiTool,
    liens: [
      lien(`/${cycle}/liste_fonction`, "Toutes les fonctions", FiList),
      lien(`/${cycle}/membres_inscrits`, "Liste utilisateurs", FiUsers),
      lien(`/${cycle}/cartes_personnel`, "Cartes personnel QR", FiCreditCard),
    ],
  },
  {
    id: "rapports",
    titre: "Suivi & rapports",
    icone: FiFileText,
    liens: [
      lien(`/${cycle}/liste_paiement`, "Finances", FiCreditCard),
      lien(`/${cycle}/liste_eleve`, "Effectifs", FiUsers),
      lien(`/${cycle}/liste_horaire`, "Horaires", FiCheckSquare),
    ],
  },
];
