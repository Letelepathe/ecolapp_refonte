import React, { useRef } from "react";
import BarreActions from "./BarreActions";
import FiltresCartes from "./FiltresCartes";
import ModalApercuCartes from "./ModalApercuCartes";
import TableEleves from "./TableEleves";
import { useCartesEleves } from "./useCartesEleves";

const CartesEleves = ({ cycle, BarreGauche, NavHaut }) => {
  const zoneRef = useRef(null);
  const etat = useCartesEleves(cycle, zoneRef);

  return (
    <div className="container-fluid position-relative  d-flex p-0 page-cartes-eleves">
      <BarreGauche />
      <div className="content">
        <NavHaut />

        <main className="container-fluid pt-4 px-4">
          <section className="cmd-cartes  rounded p-4 ">
            <BarreActions
              cycle={cycle}
              nbFiltre={etat.elevesFiltr.length}
              nbSel={etat.elevesSel.length}
              toutFiltreSel={etat.toutFiltreSel}
              bascResultat={etat.bascResultat}
              viderSel={etat.viderSel}
              exportPdf={etat.exportPdf}
              ouvrirApercu={etat.ouvrirApercu}
            />

            <FiltresCartes
              classes={etat.classes}
              options={etat.options}
              rech={etat.rech}
              clsSel={etat.clsSel}
              optSel={etat.optSel}
              setRech={etat.setRech}
              setClsSel={etat.setClsSel}
              setOptSel={etat.setOptSel}
            />

            <div className="etat-cartes mt-3">
              {etat.charg && <div className="alert alert-info mb-0">Chargement des élèves...</div>}
              {etat.err && <div className="alert alert-danger mb-0">{etat.err}</div>}
              {!etat.charg && !etat.err && (
                <div className="alert alert-light border mb-0">
                  {etat.elevesFiltr.length} élève(s) trouvé(s), {etat.elevesSel.length} carte(s) sélectionnée(s).
                </div>
              )}
            </div>

            {!etat.charg && !etat.err && (
              <TableEleves
                eleves={etat.elevesFiltr}
                idsSel={etat.idsSel}
                bascEleve={etat.bascEleve}
                selUn={etat.selUn}
              />
            )}
          </section>

          <ModalApercuCartes
            zoneRef={zoneRef}
            ouvert={etat.apercuOuvert}
            fermer={etat.fermerApercu}
            eleves={etat.elevesSel}
            ecole={etat.ecole}
            photosKo={etat.photosKo}
            photoKo={etat.photoKo}
            impCartes={etat.impCartes}
            telechPdf={etat.telechPdf}
            exportPdf={etat.exportPdf}
          />
        </main>
      </div>
    </div>
  );
};

export default CartesEleves;
