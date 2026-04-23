import styles from "./Modal.module.css";

function Modal({ isOpen, onClose, children, handleRequest, showFooter }) {
  return isOpen ? (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.modalContent}>{children}</div>
        {showFooter ? (
          <div className={styles.modalFooter}>
            <button className={styles.btnSecondary} onClick={onClose}>
              Cancel
            </button>
            <button
              className={styles.btnPrimary}
              onClick={handleRequest}
              disabled={!handleRequest}
            >
              Ok
            </button>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
}

export default Modal;
