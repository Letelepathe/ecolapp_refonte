const TYPES_ACCEPTES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSIONS_HEIC = /\.(heic|heif)$/i;

const chargerImage = (fichier) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Cette image ne peut pas être lue par ce navigateur."));
    };
    image.src = url;
  });

const convertirCanvas = (canvas, type, qualite) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("La compression de la photo a échoué.")),
      type,
      qualite
    );
  });

export const preparerImageUpload = async (
  fichier,
  { tailleMax = 2 * 1024 * 1024, dimensionMax = 1600 } = {}
) => {
  if (!fichier) return null;
  if (EXTENSIONS_HEIC.test(fichier.name) || /image\/(heic|heif)/i.test(fichier.type)) {
    throw new Error("Le format HEIC/HEIF n’est pas compatible. Choisissez « Le plus compatible » dans les options de partage du téléphone, ou utilisez une photo JPG, PNG ou WEBP.");
  }
  if (!TYPES_ACCEPTES.has(fichier.type)) {
    throw new Error("Format non accepté. Choisissez une photo JPG, PNG ou WEBP.");
  }
  if (fichier.size <= tailleMax) return fichier;

  const image = await chargerImage(fichier);
  const ratio = Math.min(1, dimensionMax / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const contexte = canvas.getContext("2d");
  if (!contexte) throw new Error("La compression n’est pas disponible sur ce téléphone.");
  contexte.drawImage(image, 0, 0, canvas.width, canvas.height);

  const typeSortie = fichier.type === "image/webp" ? "image/webp" : "image/jpeg";
  let blob;
  for (const qualite of [0.86, 0.76, 0.66, 0.56]) {
    blob = await convertirCanvas(canvas, typeSortie, qualite);
    if (blob.size <= tailleMax) break;
  }
  if (!blob || blob.size > tailleMax) {
    throw new Error("La photo reste trop volumineuse après compression. Choisissez une image plus petite.");
  }

  const extension = typeSortie === "image/webp" ? "webp" : "jpg";
  const nom = `${fichier.name.replace(/\.[^.]+$/, "") || "photo"}.${extension}`;
  return new File([blob], nom, { type: typeSortie, lastModified: Date.now() });
};
