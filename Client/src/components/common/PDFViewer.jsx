import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download, RotateCw, Maximize, Minimize, Loader } from 'lucide-react';
import './PDFViewer.css';

const PDFViewer = ({ pdfUrl, fileName, onDownload }) => {
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(pdfUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load PDF: ${response.status} ${response.statusText}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (pdfUrl) {
      fetchPDF();
    }

    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfUrl]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (error) {
    return (
      <div className="pdf-viewer-container">
        <div className="pdf-error-container">
          <div className="pdf-error-content">
            <div className="pdf-error-icon">📄</div>
            <h3>PDF Loading Error</h3>
            <p>{error}</p>
            <button className="pdf-download-btn" onClick={onDownload}>
              <Download size={16} />
              Try Download Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* PDF Controls Toolbar */}
      <div className="pdf-toolbar">
        <div className="pdf-toolbar-left">
          <span className="pdf-file-info">
            📄 {fileName}
          </span>
        </div>

        <div className="pdf-toolbar-center">
          <button
            className="pdf-control-btn"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <span className="pdf-zoom-info">
            {Math.round(zoom * 100)}%
          </span>

          <button
            className="pdf-control-btn"
            onClick={handleZoomIn}
            disabled={zoom >= 3.0}
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <button
            className="pdf-control-btn"
            onClick={handleRotate}
            title="Rotate"
          >
            <RotateCw size={16} />
          </button>

          <button
            className="pdf-control-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>

        <div className="pdf-toolbar-right">
          <button
            className="pdf-download-btn"
            onClick={onDownload}
            title="Download PDF"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="pdf-viewer-content">
        {loading && (
          <div className="pdf-loading-overlay">
            <Loader className="pdf-loading-spinner" size={40} />
            <p>Loading PDF...</p>
          </div>
        )}

        {pdfBlobUrl && (
          <div
            className="pdf-iframe-container"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transformOrigin: 'center top',
              transition: 'transform 0.3s ease'
            }}
          >
            <iframe
              ref={iframeRef}
              src={pdfBlobUrl}
              width="100%"
              height="600"
              style={{
                border: 'none',
                borderRadius: 'var(--radius-md)',
                display: loading ? 'none' : 'block'
              }}
              title={`PDF Viewer - ${fileName}`}
              allowFullScreen
            />
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="pdf-instructions">
        <small>
          💡 Tip: Use your browser's PDF viewer controls for page navigation, or use the zoom/rotate buttons above
        </small>
      </div>
    </div>
  );
};

export default PDFViewer;