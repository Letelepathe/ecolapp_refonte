import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

function Index() {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const files = [
    { src: "https://rudless.com/img/logorudless.jpeg", type: "image" },
    { src: "https://via.placeholder.com/600", type: "image" },
    { src: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", type: "pdf" }
  ];

  const handleClick = (index, type, src) => {
    if (type === "pdf") {
      window.open(src, "_blank"); // Ouvrir PDF dans un nouvel onglet
    } else {
      setCurrentIndex(index);
      setOpen(true);
    }
  };

  return (
    <div>
      {/* Affichage des fichiers */}
      <div style={{ display: "flex", gap: "10px" }}>
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => handleClick(index, file.type, file.src)}
            style={{ border: "none", background: "none", cursor: "pointer" }}
          >
            {file.type === "image" ? (
              <img
                src={file.src}
                alt={`${index + 1}`}
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "blue", textDecoration: "underline" }}>📄 Voir PDF</span>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox pour les images */}
      <Lightbox open={open} close={() => setOpen(false)} slides={files.filter(f => f.type === "image")} index={currentIndex} />
    </div>
  );
}

export default Index;
  