import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Button from '../../components/common/Button';
import MaterialForm from '../../components/admin/MaterialForm';
import Notification from '../../components/common/Notification';
import { useData } from '../../context/DataContext';
import './MaterialEdit.css';

const MaterialEdit = ({ isCreating = false }) => {
  const { materialId } = useParams();
  const { getMaterial, addMaterial, updateMaterial, deleteMaterial } = useData();
  const [material, setMaterial] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isCreating && materialId) {
      const foundMaterial = getMaterial(materialId);
      if (foundMaterial) {
        setMaterial(foundMaterial);
      } else {
        navigate('/admin/materials');
      }
    }
  }, [materialId, getMaterial, isCreating, navigate]);
  
  const handleSubmit = (materialData) => {
    if (isCreating) {
      addMaterial(materialData);
      setNotification({
        message: 'Material created successfully!',
        type: 'success'
      });
      setTimeout(() => {
        navigate('/admin/materials');
      }, 1500);
    } else {
      updateMaterial(materialData);
      setMaterial(materialData);
      setNotification({
        message: 'Material updated successfully!',
        type: 'success'
      });
    }
  };
  
  const handleDelete = () => {
    deleteMaterial(materialId);
    setNotification({
      message: 'Material deleted successfully!',
      type: 'success'
    });
    setTimeout(() => {
      navigate('/admin/materials');
    }, 1500);
  };
  
  return (
    <div className="material-edit-container">
      {/* Left Column: Info sidebar, guide, actions */}
      <div className="material-edit-info-side">
        <Link to="/admin/materials" className="back-link-modern">
          <ArrowLeft size={16} />
          <span>Back to Materials</span>
        </Link>
        
        <h1 className="material-edit-title-modern">
          {isCreating ? 'Create New Material' : 'Edit Material'}
        </h1>
        
        <p className="material-edit-desc-modern">
          {isCreating 
            ? 'Publish a new learning resource for your students. Choose between writing rich text articles or uploading PDF documents, and organize them into categories.'
            : 'Update this learning resource. Your changes will be updated instantly for all enrolled students.'}
        </p>

        <div className="material-edit-guide-card">
          <h4>Quick Guide</h4>
          <ul>
            <li><strong>Categories:</strong> Choose a relevant category so students can discover this resource.</li>
            <li><strong>Article Text:</strong> Best for guides, tutorials, and structured readable content.</li>
            <li><strong>PDF Document:</strong> Best for textbooks, slide decks, and offline readings.</li>
          </ul>
        </div>
        
        {!isCreating && (
          <div className="danger-zone-section">
            <h4>Danger Zone</h4>
            <p>Once you delete a learning material, it cannot be recovered.</p>
            <Button 
              variant="danger" 
              onClick={() => setShowDeleteConfirm(true)}
              className="delete-button-modern"
            >
              <Trash2 size={16} />
              <span>Delete Material</span>
            </Button>
          </div>
        )}
      </div>
      
      {/* Right Column: Form card */}
      <div className="material-edit-form-side">
        {(isCreating || material) && (
          <MaterialForm 
            onSubmit={handleSubmit}
            initialData={isCreating ? null : material}
          />
        )}
      </div>
      
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Delete Material</h3>
            <p>Are you sure you want to delete this material? This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <Button 
                variant="ghost" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
              >
                Delete Material
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default MaterialEdit;