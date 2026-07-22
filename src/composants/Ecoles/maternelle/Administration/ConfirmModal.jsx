import React from 'react';

const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="modal fade show u-style-048b9a2b" tabIndex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="confirmModalLabel">Confirmer la suppression</h5>
            <button type="button" className="close btn " data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {message}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn " onClick={onClose}>Annuler</button>
            <button type="button" className="btn " onClick={onConfirm}>Confirmer</button>
          </div>
        </div>
      </div>
    </div>);

};

export default ConfirmModal;
