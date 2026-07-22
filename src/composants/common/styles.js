const styles = {
  pageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0', // Fond gris clair pour faire ressortir le bulletin
    padding: '20px 0',
    boxSizing: 'border-box',
  },

  // Conteneur principal du bulletin (Format A4 vertical centré)
  container: {
    fontFamily: 'Arial, sans-serif',
    width: '210mm',
    minHeight: '297mm',
    padding: '10mm',
    backgroundColor: '#fff',
    color: '#000',
    boxSizing: 'border-box',
    border: '2px solid #000',
    fontSize: '11px',
    lineHeight: '1.2',
    margin: '0 auto', // Centre le bloc si le wrapper flex n'est pas utilisé
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)', // Ombre légère pour l'effet papier
  },

  // --- ENTÊTE (Header) ---
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  logo: {
    width: '80px',
    height: 'auto',
    objectFit: 'contain',
  },
  headerTextContainer: {
    textAlign: 'center',
    flex: 1,
    padding: '0 10px',
  },
  titleCountry: {
    fontSize: '14px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    margin: '0 0 4px 0',
  },
  titleMinistry: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    margin: '0',
  },

  // --- GRILLES D'IDENTIFICATION & INFOS ---
  idGrid: {
    display: 'flex',
    border: '1px solid #000',
    marginBottom: '5px',
    height: '22px',
  },
  idLabel: {
    borderRight: '1px solid #000',
    padding: '3px 5px',
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    display: 'flex',
    alignItems: 'center',
  },
  idCell: {
    flex: 1,
    borderRight: '1px solid #000',
    '&:lastChild': { borderRight: 'none' },
  },

  infoSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0 15px',
    marginBottom: '5px',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    margin: '2px 0',
  },
  infoLabel: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: '5px',
    whiteSpace: 'nowrap',
  },
  infoDotted: {
    flex: 1,
    borderBottom: '1px dotted #000',
    height: '14px',
  },

  bulletinTitleBox: {
    border: '2px solid #000',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '4px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    backgroundColor: '#f9f9f9',
    fontSize: '10px',
  },

  // --- TABLEAU DE NOTES COMPLEXE ---
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid #000',
    marginBottom: '10px',
  },
  
  // En-têtes
  th: {
    border: '1px solid #000',
    padding: '2px 4px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '9px',
    textTransform: 'uppercase',
  },
  thSub: {
    border: '1px solid #000',
    padding: '1px 2px',
    textAlign: 'center',
    fontSize: '8px',
  },

  // Catégories (Domaines / Sous-domaines)
  rowDomain: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: '10px',
  },
  rowSubDomain: {
    backgroundColor: '#fff',
    fontWeight: 'bold',
    fontSize: '9px',
    paddingLeft: '5px',
  },

  // Cellules standards
  td: {
    border: '1px solid #000',
    padding: '3px 5px',
    height: '16px',
  },
  tdCenter: {
    border: '1px solid #000',
    padding: '3px 2px',
    textAlign: 'center',
    width: '35px',
  },
  tdSubTotal: {
    border: '1px solid #000',
    padding: '3px 5px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#f9f9f9',
  },

  // Cellules condamnées / noires (totaux impossibles)
  tdBlackout: {
    border: '1px solid #000',
    backgroundColor: '#000',
    width: '35px',
  },

  // --- BAS DU TABLEAU (Totaux, Pourcentages, Conduite...) ---
  rowBoldLabel: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    border: '1px solid #000',
    padding: '3px 5px',
  },
  decisionBox: {
    border: '1px solid #000',
    padding: '5px',
    fontSize: '10px',
  },

  // --- PIED DE PAGE & SIGNATURES ---
  footerSection: {
    marginTop: '15px',
    borderTop: '1px solid #000',
    paddingTop: '8px',
    fontSize: '10px',
    lineHeight: '1.4',
  },
  footerRow: {
    margin: '4px 0',
  },
  signaturesContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    textAlign: 'center',
  },
  signatureBlock: {
    width: '30%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signatureSpace: {
    height: '45px',
  },
  noteImportante: {
    marginTop: '15px',
    fontSize: '9px',
    fontStyle: 'italic',
    borderTop: '1px dashed #666',
    paddingTop: '4px',
  }
};

export default styles;