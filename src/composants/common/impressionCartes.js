export const imprimerZoneCartes = (zone, titre = "Impression des cartes") => {
  if (!zone) return;

  const contenu = zone.outerHTML;
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((element) => element.outerHTML)
    .join("\n");

  const fenetre = window.open("", "_blank", "width=1200,height=800");
  if (!fenetre) {
    window.print();
    return;
  }

  fenetre.document.open();
  fenetre.document.write(`<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${titre}</title>
  ${styles}
	  <style>
	    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
	    body { margin: 0; padding: 16px; background: #fff; font-family: Heebo, Arial, sans-serif; }
	    .zone-cartes { display: flex !important; flex-wrap: wrap !important; gap: 16px !important; justify-content: center !important; align-items: flex-start !important; visibility: visible !important; position: static !important; width: 100% !important; padding: 0 !important; }
	    .zone-cartes, .zone-cartes * { visibility: visible !important; }
	    .carte-vide { display: none !important; }
	    .fiche-carte-eleve { display: grid !important; grid-template-columns: 1fr 1fr !important; width: 740px !important; min-height: 470px !important; gap: 18px !important; color: #253041 !important; font-family: Heebo, Arial, sans-serif !important; break-inside: avoid !important; page-break-inside: avoid !important; margin: 0 auto 14px !important; }
	    .modele-carte-scolaire .carte-identite-pro { position: relative !important; min-height: 470px !important; padding: 0 34px 28px !important; border: 1px solid #e2e8f0 !important; border-radius: 0 !important; overflow: hidden !important; background: #fff !important; box-shadow: none !important; }
	    .carte-identite-vague { position: absolute !important; inset: 0 0 auto !important; height: 176px !important; border-bottom-left-radius: 42% 34% !important; border-bottom-right-radius: 42% 34% !important; background: radial-gradient(circle at 78% 70%, rgba(236, 72, 153, .42), transparent 23%), radial-gradient(circle at 22% 15%, rgba(255, 255, 255, .18), transparent 28%), linear-gradient(135deg, #c43a98 0%, #7b2cbf 55%, #54278f 100%) !important; }
	    .carte-identite-personnel .carte-identite-vague { background: radial-gradient(circle at 78% 70%, rgba(56, 189, 248, .44), transparent 23%), radial-gradient(circle at 22% 15%, rgba(255, 255, 255, .22), transparent 28%), linear-gradient(135deg, #2563eb 0%, #0f6fcf 52%, #0f172a 100%) !important; }
	    .carte-identite-entete { position: relative !important; z-index: 1 !important; padding-top: 38px !important; color: #fff !important; text-align: center !important; text-transform: uppercase !important; }
	    .carte-identite-entete h2 { margin: 0 !important; font-size: 23px !important; line-height: 1.08 !important; font-weight: 900 !important; letter-spacing: .02em !important; color: #fff !important; }
	    .carte-identite-entete p { margin: 6px 0 0 !important; font-size: 13px !important; letter-spacing: .12em !important; font-weight: 700 !important; color: #fff !important; }
	    .carte-identite-photo-rond { position: relative !important; z-index: 2 !important; width: 146px !important; height: 146px !important; margin: 28px auto 28px !important; border: 7px solid #7b2cbf !important; border-radius: 50% !important; overflow: hidden !important; background: #fff !important; box-shadow: 0 8px 0 rgba(123, 44, 191, .22), 0 18px 34px rgba(15, 23, 42, .18) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
	    .carte-identite-personnel .carte-identite-photo-rond { border-color: #2563eb !important; box-shadow: 0 8px 0 rgba(37, 99, 235, .22), 0 18px 34px rgba(15, 23, 42, .18) !important; }
	    .carte-identite-photo-rond img, .carte-identite-photo-rond .img-photo-eleve, .carte-identite-photo-rond .photo-defaut-eleve { width: 100% !important; height: 100% !important; object-fit: cover !important; }
	    .carte-identite-infos { position: relative !important; z-index: 1 !important; display: grid !important; gap: 9px !important; margin-top: 4px !important; font-size: 14px !important; }
	    .carte-identite-infos div { display: grid !important; grid-template-columns: 128px 1fr !important; gap: 8px !important; align-items: baseline !important; }
	    .carte-identite-infos span { font-weight: 800 !important; color: #334155 !important; }
	    .carte-identite-infos strong { font-weight: 900 !important; color: #1f2937 !important; overflow-wrap: anywhere !important; }
	    .carte-identite-verso { padding-top: 58px !important; }
	    .carte-identite-bulle { position: absolute !important; width: 62px !important; height: 62px !important; border-radius: 50% !important; background: rgba(236, 72, 153, .16) !important; }
	    .carte-identite-personnel .carte-identite-bulle { background: rgba(37, 99, 235, .15) !important; }
	    .bulle-haut { right: -22px !important; top: 12px !important; }
	    .bulle-bas { left: -24px !important; bottom: 34px !important; }
	    .carte-identite-conditions h3 { width: fit-content !important; margin: 0 auto 24px !important; padding: 8px 22px !important; border-radius: 4px !important; color: #fff !important; background: linear-gradient(135deg, #c43a98, #7b2cbf) !important; font-size: 17px !important; font-weight: 900 !important; box-shadow: inset 0 -3px 0 rgba(0, 0, 0, .13) !important; }
	    .carte-identite-personnel .carte-identite-conditions h3 { background: linear-gradient(135deg, #2563eb, #0f6fcf) !important; }
	    .carte-identite-conditions ul { margin: 0 !important; padding-left: 20px !important; font-size: 13px !important; line-height: 1.45 !important; font-weight: 600 !important; }
	    .carte-identite-conditions li { margin-bottom: 10px !important; }
	    .carte-identite-contact { margin: 28px auto 20px !important; width: fit-content !important; font-size: 14px !important; }
	    .carte-identite-contact p { margin: 4px 0 !important; display: grid !important; grid-template-columns: 76px 1fr !important; gap: 8px !important; }
	    .carte-identite-contact span { font-weight: 900 !important; }
	    .carte-identite-signature { text-align: center !important; margin-top: 18px !important; }
	    .carte-identite-signature span { display: inline-block !important; min-width: 140px !important; padding-bottom: 5px !important; border-bottom: 2px solid #222 !important; font-family: cursive !important; }
	    .carte-identite-signature strong { display: block !important; margin-top: 4px !important; font-size: 19px !important; }
	    .carte-identite-signature small { display: block !important; color: #64748b !important; }
	    .qr-identite-grand { position: absolute !important; left: 50% !important; bottom: 24px !important; transform: translateX(-50%) !important; display: flex !important; flex-direction: column !important; align-items: center !important; gap: 3px !important; font-size: 10px !important; font-weight: 900 !important; color: #475569 !important; }
	    .qr-identite-grand img { width: 92px !important; height: 92px !important; padding: 6px !important; border: 2px solid #cbd5e1 !important; background: #fff !important; }
	    .qr-identite-personnel img { width: 128px !important; height: 128px !important; border: 3px solid #2563eb !important; box-shadow: 0 10px 28px rgba(37, 99, 235, .22) !important; }
	    @page { size: A4 landscape; margin: 8mm; }
	    @media print { body { padding: 0; } .zone-cartes { position: static !important; } }
	    @media (max-width: 820px) { body { padding: 10px; } .fiche-carte-eleve { width: min(94vw, 390px) !important; grid-template-columns: 1fr !important; } .modele-carte-scolaire .carte-identite-pro { min-height: 500px !important; padding: 0 22px 26px !important; } .carte-identite-infos div { grid-template-columns: 96px 1fr !important; } }
	  </style>
	</head>
	<body>${contenu}</body>
</html>`);
  fenetre.document.close();

  const lancerImpression = () => {
    fenetre.focus();
    fenetre.print();
  };

  setTimeout(lancerImpression, 1200);
};
