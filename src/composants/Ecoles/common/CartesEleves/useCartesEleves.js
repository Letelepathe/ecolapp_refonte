import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { URL_API, idEleve, nomCls, nomOpt, txtRecherche } from "./outilsCarte";

export const useCartesEleves = (cycle, zoneRef) => {
  const ecoleId = localStorage.getItem("ecole_id");
  const direction = localStorage.getItem("direction");

  const [ecole, setEcole] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [options, setOptions] = useState([]);
  const [clsSel, setClsSel] = useState("");
  const [optSel, setOptSel] = useState("");
  const [rech, setRech] = useState("");
  const [idsSel, setIdsSel] = useState([]);
  const [charg, setCharg] = useState(true);
  const [exportPdf, setExportPdf] = useState(false);
  const [err, setErr] = useState("");
  const [photosKo, setPhotosKo] = useState({});
  const [apercuOuvert, setApercuOuvert] = useState(false);

  useEffect(() => {
    const charger = async () => {
      setCharg(true);
      setErr("");

      try {
        const [resEcole, resClasses, resOptions] = await Promise.all([
          axios.get(`${URL_API}/ecole/ecole_id/${ecoleId}`),
          axios.get(`${URL_API}/classe/ecole/${ecoleId}/direction/${direction}`),
          axios.get(`${URL_API}/option/ecole/${ecoleId}/direction/${direction}`),
        ]);

        setEcole(resEcole.data.ecole);
        setClasses(resClasses.data.classesAll || []);
        setOptions(resOptions.data.optionAll || []);

        let page = 1;
        let dernierePage = 1;
        const liste = [];

        do {
          const resEleves = await axios.get(`${URL_API}/eleve/ecole/${ecoleId}/direction/${direction}?page=${page}`);
          const pagination = resEleves.data.eleve || {};
          const lignes = Array.isArray(pagination.data) ? pagination.data : [];

          liste.push(...lignes);
          dernierePage = Number(pagination.last_page || 1);
          page += 1;
        } while (page <= dernierePage);

        setEleves(liste);
      } catch (erreurReq) {
        setErr("Erreur lors de la récupération des informations nécessaires aux cartes.");
      } finally {
        setCharg(false);
      }
    };

    charger();
  }, [ecoleId, direction]);

  const elevesFiltr = useMemo(() => {
    const mot = rech.trim().toLowerCase();

    return eleves.filter((eleve) => {
      const okRech = !mot || txtRecherche(eleve).includes(mot);
      const okCls = !clsSel || Number(eleve.classe?.id || eleve.classes_id) === Number(clsSel);
      const okOpt = !optSel || Number(eleve.option?.id || eleve.options_id) === Number(optSel);

      return okRech && okCls && okOpt;
    });
  }, [eleves, rech, clsSel, optSel]);

  const elevesSel = useMemo(
    () => eleves.filter((eleve) => idsSel.includes(idEleve(eleve))),
    [eleves, idsSel]
  );

  const toutFiltreSel =
    elevesFiltr.length > 0 && elevesFiltr.every((eleve) => idsSel.includes(idEleve(eleve)));

  const bascEleve = (eleve) => {
    const id = idEleve(eleve);
    setIdsSel((ids) =>
      ids.includes(id)
        ? ids.filter((idSel) => idSel !== id)
        : [...ids, id]
    );
  };

  const selUn = (eleve) => {
    setIdsSel([idEleve(eleve)]);
    setApercuOuvert(true);
  };

  const bascResultat = () => {
    const idsFiltr = elevesFiltr.map(idEleve);

    if (toutFiltreSel) {
      setIdsSel((ids) => ids.filter((id) => !idsFiltr.includes(id)));
      return;
    }

    setIdsSel((ids) => Array.from(new Set([...ids, ...idsFiltr])));
  };

  const viderSel = () => {
    setIdsSel([]);
    setApercuOuvert(false);
  };

  const ouvrirApercu = () => {
    if (elevesSel.length > 0) setApercuOuvert(true);
  };

  const fermerApercu = () => setApercuOuvert(false);

  const photoKo = (id) => {
    setPhotosKo((photos) => ({ ...photos, [id]: true }));
  };

  const impCartes = () => {
    window.print();
  };

  const telechPdf = async () => {
    const cartes = Array.from(zoneRef.current?.querySelectorAll(".fiche-carte-eleve") || []);

    if (!cartes.length) return;

    setExportPdf(true);
    try {
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pageLarg = pdf.internal.pageSize.getWidth();
      const pageHaut = pdf.internal.pageSize.getHeight();
      const marge = 10;
      const maxLarg = pageLarg - marge * 2;
      const maxHaut = pageHaut - marge * 2;

      for (let rang = 0; rang < cartes.length; rang += 1) {
        const toile = await html2canvas(cartes[rang], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });
        const img = toile.toDataURL("image/png");
        const ratio = Math.min(maxLarg / toile.width, maxHaut / toile.height);
        const larg = toile.width * ratio;
        const haut = toile.height * ratio;
        const gauche = (pageLarg - larg) / 2;
        const hautPos = (pageHaut - haut) / 2;

        if (rang > 0) pdf.addPage();
        pdf.addImage(img, "PNG", gauche, hautPos, larg, haut);
      }

      pdf.save(`cartes-eleves-${cycle}.pdf`);
    } catch (erreurPdf) {
      setErr("La génération PDF a échoué. Vous pouvez utiliser le bouton Imprimer.");
    } finally {
      setExportPdf(false);
    }
  };

  return {
    ecole,
    classes,
    options,
    clsSel,
    optSel,
    rech,
    idsSel,
    charg,
    exportPdf,
    apercuOuvert,
    err,
    photosKo,
    elevesFiltr,
    elevesSel,
    toutFiltreSel,
    setClsSel,
    setOptSel,
    setRech,
    bascEleve,
    selUn,
    bascResultat,
    viderSel,
    ouvrirApercu,
    fermerApercu,
    photoKo,
    impCartes,
    telechPdf,
  };
};
