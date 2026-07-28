import { useEffect, useMemo, useState } from "react";
import {
  creerContexteReglements,
  listerConfigurationsTranches,
} from "../../../../services/reglementsTranches/reglementsTranchesService";

const useTranchesParMotif = (tranches, motifId) => {
  const contexte = useMemo(() => creerContexteReglements(), []);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    listerConfigurationsTranches(contexte)
      .then(setConfigurations)
      .catch(() => setConfigurations([]));
  }, [contexte]);

  const tranchesConfigurees = configurations.filter(
    (configuration) =>
      String(configuration.motifId) === String(motifId) &&
      configuration.statut !== "brouillon"
  );

  if (!motifId) return [];

  if (configurations.length === 0) {
    // Compatibilité temporaire avec les anciennes écoles non encore configurées.
    return tranches;
  }

  return tranches.filter((tranche) =>
    tranchesConfigurees.some(
      (configuration) =>
        String(configuration.trancheId) === String(tranche.id)
    )
  );
};

export default useTranchesParMotif;
