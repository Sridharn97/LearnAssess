import React, { useState } from 'react';
import Button from '../common/Button';
import './MaterialForm.css';

const MaterialForm = ({ onSubmit, initialData = null }) => {
  const [contentType, setContentType] = useState(initialData?.contentType || 'text');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'general',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    
    if (contentType === 'pdf' && formData.file) {
      submitData.append('file', formData.file);
    } else {
      submitData.append('content', formData.content);
    }

    onSubmit(submitData);
  };

  return (
    <form className="material-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="general">General</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="science">Science</option>
          <option value="math">Mathematics</option>
          <option value="history">History</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          required
        ></textarea>
      </div>

      <div className="form-group">
        <label>Content Type</label>
        <div className="content-type-toggle">
          <button
            type="button"
            className={`toggle-btn ${contentType === 'text' ? 'active' : ''}`}
            onClick={() => setContentType('text')}
          >
            📝 Text Content
          </button>
          <button
            type="button"
            className={`toggle-btn ${contentType === 'pdf' ? 'active' : ''}`}
            onClick={() => setContentType('pdf')}
          >
            📄 PDF Upload
          </button>
        </div>
      </div>
      
      {contentType === 'text' ? (
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
            className="content-editor"
            placeholder="Enter your learning material content here..."
          ></textarea>
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="file">PDF File</label>
          <input
            type="file"
            id="file"
            name="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="file-input"
          />
          <small className="file-help">Upload a PDF file (max 10MB)</small>
          {formData.file && (
            <div className="file-info">
              Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>
      )}
      
      <div className="form-actions">
        <Button type="submit" variant="primary">
          {initialData ? 'Update Material' : 'Create Material'}
        </Button>
      </div>
    </form>
  );
};

export default MaterialForm;