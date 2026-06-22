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

const ROLES_ADMIN = ["administrateur", "administratrice", "super administrateur", "super administratrice"];
const ROLES_ENSEIGNANT = [...ROLES_ADMIN, "enseignant", "enseignante"];

const lien = (to, label, icone = FiFileText) => ({ to, label, icone });

const normaliserTexte = (valeur = "") =>
  valeur
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const obtenirRole = (utilisateur) => {
  const roleFonction = utilisateur?.fonction?.name || "";
  return normaliserTexte(roleFonction || utilisateur?.role || "");
};

const creerMenusUtilisateur = ({ cycle, infoClasseUser, infoEleve, estAdmin, estEnseignant, estEleve }) => {
  const menus = [
    {
      id: "profil",
      titre: "Mon espace",
      icone: FiGrid,
      to: `/${cycle}/profil_user`,
    },
     {
      id: "admin",
      titre: "Administration",
      icone: FiUser,
      to: `/${cycle}/bureau_admin`,
    },
  ];

  if (estAdmin) {
    menus.push(...menusEcole(cycle));
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
        const roleUtilisateur = obtenirRole(donneesUtilisateur);

        setUtilisateur(donneesUtilisateur);

        if (roleUtilisateur === "eleve") {
          try {
            const reponseEleve = await axios.get(`https://api.ecolapp.cd/api/user/eleve/${idUtilisateur}`);
            setInfoEleve(reponseEleve.data.eleve_info);
          } catch {
            setInfoEleve(null);
          }
        }

        if (ROLES_ENSEIGNANT.includes(roleUtilisateur)) {
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

  const roleUtilisateur = obtenirRole(utilisateur);
  const menus = useMemo(
    () =>
      creerMenusUtilisateur({
        cycle,
        infoClasseUser,
        infoEleve,
        estAdmin: ROLES_ADMIN.includes(roleUtilisateur),
        estEnseignant: ROLES_ENSEIGNANT.includes(roleUtilisateur),
        estEleve: roleUtilisateur === "eleve",
      }),
    [cycle, infoClasseUser, infoEleve, roleUtilisateur]
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
