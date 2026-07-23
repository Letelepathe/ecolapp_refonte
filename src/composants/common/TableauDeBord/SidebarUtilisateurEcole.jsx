import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCheckSquare,
  FiFileText,
  FiGrid,
  FiHome,
  FiLogOut,
  FiPlusCircle,
  FiUser,
} from "react-icons/fi";
import BarreLaterale from "./BarreLaterale";
import { menusEcole } from "./menusTableauBord";

const lien = (to, label, icone = FiFileText) => ({ to, label, icone });

const normaliserTexte = (valeur = "") =>
  valeur
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const obtenirRoles = (utilisateur) => [
  utilisateur?.fonction?.name,
  utilisateur?.role?.name,
  utilisateur?.role,
  utilisateur?.type,
].filter(Boolean).map(normaliserTexte);

const correspondAUnRole = (roles, termes) =>
  roles.some((role) => termes.some((terme) => role === terme || role.includes(terme)));

const creerMenusUtilisateur = ({ cycle, infoClasseUser, infoEleve, estAdmin, estEnseignant, estEleve, estFinance, estSecretariat }) => {
  const peutGererPresenceEtCartes = estAdmin || estSecretariat || estEnseignant || estFinance;
  const menus = [
    {
      id: "profil",
      titre: "Mon espace",
      icone: FiGrid,
      to: `/${cycle}/profil_user`,
    },

  ];

  if (peutGererPresenceEtCartes) {
    menus.push({
      id: "presence-cartes",
      titre: "Présences & cartes",
      icone: FiCheckSquare,
      liens: [
        lien(`/presence-qr`, "Présences du jour & scan QR", FiCheckSquare),
        lien(`/${cycle}/cartes_eleves`, "Cartes élèves QR", FiFileText),
        lien(`/${cycle}/cartes_personnel`, "Cartes personnel QR", FiFileText),
      ],
    });
  }

  if (estAdmin) {
    menus.push({
      id: "administration",
      titre: "Administration",
      icone: FiHome,
      to: `/${cycle}/bureau_admin`,
    });
    menus.push(...menusEcole(cycle));
  } else if (estFinance) {
    menus.push({ id: "finances", titre: "Mes finances", icone: FiBriefcase, liens: [lien(`/${cycle}/liste_paiement`, "Paiements", FiFileText), lien(`/${cycle}/liste_motif`, "Motifs de paiement", FiFileText), lien(`/${cycle}/liste_tranche`, "Tranches", FiFileText)] });
  } else if (estSecretariat) {
    menus.push({ id: "secretariat", titre: "Secrétariat", icone: FiUser, liens: [lien(`/${cycle}/liste_eleve`, "Dossiers élèves", FiUser), lien(`/${cycle}/eleve_inscrit`, "Inscriptions", FiFileText)] });
  }

  if (infoClasseUser?.length) {
    menus.push({
      id: "titulaire",
      titre: "Titularisation",
      icone: FiAward,
      liens: infoClasseUser.map((classe) =>
        lien(
          `/${cycle}/ma_classe/${classe?.classe?.id}/${classe?.option?.id}`,
          `${classe?.classe?.name || "Classe"} ${classe?.option?.name || ""}`,
          FiBookOpen
        )
      ),
    });
  }
  

  if (estEnseignant) {
    menus.push(
      {
        id: "cours",
        titre: "Cours",
        icone: FiBookOpen,
        liens: [
          lien(`/${cycle}/ajouter_cours_by_enseignant`, "Ajouter cours", FiPlusCircle),
          lien(`/${cycle}/liste_cours_by_enseignant`, "Mes cours fichiers", FiFileText),
          lien(`/${cycle}/liste_cours_titulaire_by_enseignant`, "Cours titulaires", FiBookOpen),
        ],
      },
      {
        id: "cotes",
        titre: "Cotes élèves",
        icone: FiCheckSquare,
        liens: [
          lien(`/${cycle}/select_classe_by_enseignant`, "Déposer cote", FiPlusCircle),
          lien(`/${cycle}/select_classe_consulte_cote_by_enseignant`, "Mes cotes", FiFileText),
        ],
      }
    );
  }

  menus.push({
    id: "travail",
    titre: "Travaux",
    icone: FiBriefcase,
    liens: [
      ...(estEnseignant ? [lien(`/${cycle}/ajouter_travail_by_enseignant`, "Ajouter travail", FiPlusCircle)] : []),
      ...(estEnseignant ? [lien(`/${cycle}/liste_travail_by_enseignant`, "Mes travaux", FiFileText)] : []),
      ...(estEleve ? [lien(`/${cycle}/liste_travail_by_eleve`, "Mes travaux", FiFileText)] : []),
    ],
  });

  if (estEleve) {
    menus.push({
      id: "eleve",
      titre: "Mes activités",
      icone: FiUser,
      liens: [
        ...(infoEleve ? [lien(`/${cycle}/ma_classe/${infoEleve?.classes_id}/${infoEleve?.options_id}`, "Ma classe", FiBookOpen)] : []),
        ...(infoEleve ? [lien(`/${cycle}/panel_eleve/${infoEleve?.id}/${infoEleve?.ecole_id}/${infoEleve?.direction}`, "Parcours scolaire", FiAward)] : []),
      ],
    });
  }

  menus.push(
    {
      id: "quiz",
      titre: "Jeux quiz",
      icone: FiCheckSquare,
      to: "/jeux/quiz",
    },
    {
      id: "deconnexion",
      titre: "Déconnexion",
      icone: FiLogOut,
      to: `/${cycle}/deconnexion`,
    }
  );

  return menus.filter((menu) => menu.to || menu.liens?.length);
};

const SidebarUtilisateurEcole = ({ cycle, titreCycle }) => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [infoEleve, setInfoEleve] = useState(null);
  const [infoClasseUser, setInfoClasseUser] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  const idUtilisateur = localStorage.getItem("userId");

  useEffect(() => {
    const chargerDonnees = async () => {
      if (!idUtilisateur) {
        setErreur("Aucun utilisateur connecté.");
        setChargement(false);
        return;
      }

      setChargement(true);

      try {
        const reponseUtilisateur = await axios.get(`https://api.ecolapp.cd/api/user/${idUtilisateur}`);
        const donneesUtilisateur = reponseUtilisateur.data.user;
        const rolesUtilisateur = obtenirRoles(donneesUtilisateur);

        setUtilisateur(donneesUtilisateur);

        if (correspondAUnRole(rolesUtilisateur, ["eleve"])) {
          try {
            const reponseEleve = await axios.get(`https://api.ecolapp.cd/api/user/eleve/${idUtilisateur}`);
            setInfoEleve(reponseEleve.data.eleve_info);
          } catch {
            setInfoEleve(null);
          }
        }

        if (correspondAUnRole(rolesUtilisateur, ["enseignant", "enseignante", "administrateur", "administratrice", "admin"])) {
          try {
            const reponseClasse = await axios.get(`https://api.ecolapp.cd/api/titulaire/classe/${idUtilisateur}`);
            setInfoClasseUser(reponseClasse.data?.classe || []);
          } catch {
            setInfoClasseUser([]);
          }
        }
      } catch {
        setErreur("Impossible de charger le menu utilisateur.");
      } finally {
        setChargement(false);
      }
    };

    chargerDonnees();
  }, [idUtilisateur]);

  const rolesUtilisateur = obtenirRoles(utilisateur);
  const estAdmin = correspondAUnRole(rolesUtilisateur, ["administrateur", "administratrice", "admin", "superadmin", "super admin", "super_admin"]);
  const estEnseignant = estAdmin || correspondAUnRole(rolesUtilisateur, ["enseignant", "enseignante", "professeur", "professeure"]);
  const estEleve = correspondAUnRole(rolesUtilisateur, ["eleve"]);
  const estFinance = correspondAUnRole(rolesUtilisateur, ["comptable", "caissier", "caissiere", "financier", "financiere"]);
  const estSecretariat = correspondAUnRole(rolesUtilisateur, ["secretaire", "secretariat"]);
  const menus = useMemo(
    () =>
      creerMenusUtilisateur({
        cycle,
        infoClasseUser,
        infoEleve,
        estAdmin,
        estEnseignant,
        estEleve,
        estFinance,
        estSecretariat,
      }),
    [cycle, infoClasseUser, infoEleve, estAdmin, estEnseignant, estEleve, estFinance, estSecretariat]
  );

  if (chargement) {
    return <div className="sidebar refonte-sidebar dashboard-full-loader">Chargement...</div>;
  }

  if (erreur || !utilisateur) {
    return <div className="sidebar refonte-sidebar dashboard-full-loader text-danger">{erreur}</div>;
  }

  return (
    <BarreLaterale
      accueil={`/${cycle}/profil_user`}
      titre="Ecolapp"
      sousTitre={titreCycle}
      menus={menus}
      user={utilisateur}
    />
  );
};
export default SidebarUtilisateurEcole;
