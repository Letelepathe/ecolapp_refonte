import React from "react";
import { idEleve, urlPhoto } from "./outilsCarte";

const PhotoEleve = ({ eleve, photosKo, photoKo }) => {
  const url = urlPhoto(eleve);
  const id = idEleve(eleve);

  if (url && !photosKo[id]) {
    return (
      <img
        className="img-photo-eleve"
        src={url}
        alt={`Photo de ${eleve.name || "l'eleve"}`}
        crossOrigin="anonymous"
        onError={() => photoKo(id)}
      />
    );
  }

  return (
    <div className="photo-defaut-eleve" aria-label="Photo par défaut">
      <span className="tete-avatar" />
      <span className="corps-avatar" />
      <strong>PHOTO</strong>
    </div>
  );
};

export default PhotoEleve;
