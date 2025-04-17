import "./style.css"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-header">Confirm Deletion</h3>
                <p className="modal-body">
                    Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
                </p>
                <div className="modal-footer">
                    <button className="theme-btn btn-border" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="theme-btn btn-main" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;