import React, { useState } from 'react';
import './CancellationModal.css'; // Import the custom CSS

const CancellationModal = ({ 
  isOpen, 
  onClose, 
  order, 
  onCancel 
}) => {
  const [unavailableItems, setUnavailableItems] = useState([]);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleItemToggle = (itemId) => {
    setUnavailableItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitCancellation = () => {
    onCancel({
      orderId: order.id,
      unavailableItems,
      cancellationReason
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Cancel Order #{order.id}</h2>
          {/* <button 
            onClick={onClose} 
            className="modal-close-btn"
          >
            Close
          </button> */}
        </div>

        <div className="modal-body">
          <div className="unavailable-items-section">
            <h3>Select Unavailable Items:</h3>
            <div className="unavailable-items-list">
              {order.items.map((item) => (
                <div 
                  key={item.id} 
                  className="item-checkbox-row"
                >
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={unavailableItems.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                  />
                  <label htmlFor={`item-${item.id}`}>
                    {item.item_name} ({item.quantity}x)
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="cancellation-reason-section">
            <label htmlFor="cancellation-reason">
              Cancellation Reason
            </label>
            <textarea
              id="cancellation-reason"
              className="cancellation-reason-textarea"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Enter detailed reason for cancellation"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="modal-cancel-btn"
          >
            Dismiss
          </button>
          <button
            onClick={handleSubmitCancellation}
            className="modal-confirm-btn"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;