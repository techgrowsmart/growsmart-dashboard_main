import { useState, useEffect, useCallback } from 'react';
import {
  Upload, Image as ImageIcon, X, Save, Edit, Trash2, Plus,
  RefreshCw, AlertCircle, CheckCircle, Tag, Type, MousePointer,
  Palette, Sparkles, ToggleLeft, ToggleRight
} from 'lucide-react';
import apiService from '../services/api';

const GRADIENT_PRESETS = [
  { label: 'Indigo to Violet', colors: ['#4F46E5', '#7C3AED'] },
  { label: 'Blue to Teal', colors: ['#0EA5E9', '#0369A1'] },
  { label: 'Emerald to Green', colors: ['#059669', '#047857'] },
  { label: 'Orange to Red', colors: ['#EA580C', '#DC2626'] },
  { label: 'Purple to Pink', colors: ['#A855F7', '#EC4899'] },
  { label: 'Rose to Red', colors: ['#F43F5E', '#B91C1C'] },
  { label: 'Sky to Blue', colors: ['#0EA5E9', '#2563EB'] },
  { label: 'Lime to Green', colors: ['#84CC16', '#16A34A'] },
];

const AdvertisementManagement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: 'Learn More',
    tag: 'ADVERTISEMENT',
    gradient: ['#4F46E5', '#7C3AED'],
    accent: '#A78BFA',
    icon: 'school-outline',
    targetRole: 'student',
    section: 'section1',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllAds();
      if (response.success) {
        setAds(response.ads || []);
      }
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to fetch advertisements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      cta: 'Learn More',
      tag: 'ADVERTISEMENT',
    gradient: ['#4F46E5', '#7C3AED'],
    accent: '#A78BFA',
    icon: 'school-outline',
    targetRole: 'student',
    section: 'section1',
  });
  setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'targetRole' && value !== 'student' && formData.section === 'section2') {
      setFormData(prev => ({ ...prev, [name]: value, section: 'section1' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGradientChange = (colors) => {
    setFormData(prev => ({ ...prev, gradient: colors }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!selectedFile && !editingId) {
      setError('Please upload an image');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('title', formData.title);
      formDataPayload.append('subtitle', formData.subtitle);
      formDataPayload.append('cta', formData.cta);
      formDataPayload.append('tag', formData.tag);
      formDataPayload.append('gradient', JSON.stringify(formData.gradient));
      formDataPayload.append('accent', formData.accent);
      formDataPayload.append('icon', formData.icon);
      formDataPayload.append('targetRole', formData.targetRole);
      formDataPayload.append('section', formData.section);

      if (selectedFile) {
        formDataPayload.append('image', selectedFile);
      }

      let response;
      if (editingId) {
        response = await apiService.updateAd(editingId, formDataPayload);
      } else {
        response = await apiService.createAd(formDataPayload);
      }

      if (response.success) {
        await fetchAds();
        resetForm();
        setError(null);
      } else {
        setError(response.message || 'Failed to save advertisement');
      }
    } catch (err) {
      setError(err.message || 'Failed to save advertisement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (ad) => {
    setFormData({
      title: ad.title,
      subtitle: ad.subtitle,
      cta: ad.cta,
      tag: ad.tag,
      gradient: ad.gradient || ['#4F46E5', '#7C3AED'],
      accent: ad.accent || '#A78BDA',
      icon: ad.icon || 'school-outline',
      targetRole: ad.targetRole || 'student',
      section: ad.section || 'section1',
    });
    setEditingId(ad.id);
    setPreviewUrl(ad.imageUrl || null);
    setSelectedFile(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      const response = await apiService.deleteAd(id);
      if (response.success) {
        setAds(ads.filter(ad => ad.id !== id));
      } else {
        setError(response.message || 'Failed to delete advertisement');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete advertisement');
    }
  };

  const handleToggleActive = async (ad) => {
    try {
      const formDataPayload = new FormData();
      formDataPayload.append('title', ad.title);
      formDataPayload.append('subtitle', ad.subtitle);
      formDataPayload.append('cta', ad.cta);
      formDataPayload.append('tag', ad.tag);
      formDataPayload.append('gradient', JSON.stringify(ad.gradient || ['#4F46E5', '#7C3AED']));
      formDataPayload.append('accent', ad.accent || '#A78BDA');
      formDataPayload.append('icon', ad.icon || 'school-outline');
      formDataPayload.append('targetRole', ad.targetRole || 'student');
      formDataPayload.append('section', ad.section || 'section1');
      formDataPayload.append('isActive', String(!ad.isActive));

      const response = await apiService.updateAd(ad.id, formDataPayload);
      if (response.success) {
        setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: !ad.isActive } : a));
      }
    } catch (err) {
      console.error('Error toggling ad status:', err);
    }
  };

  const renderGradientPreview = (colors) => (
    <div
      className="w-full h-8 rounded-lg"
      style={{
        background: `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 100%)`
      }}
    />
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advertisement Management</h2>
          <p className="text-dark-muted mt-1">Manage banner advertisements shown to students</p>
        </div>
        <button
          onClick={fetchAds}
          className="p-2 hover:bg-dark-border rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="text-dark-muted" size={20} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Ad Form */}
      <div className="glass-card rounded-xl border border-dark-border p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {editingId ? 'Edit Advertisement' : 'Create New Advertisement'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drag and Drop Upload Area */}
          <div>
            <label className="block text-sm font-medium mb-2">Ad Banner Image</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-border hover:border-primary-500 hover:bg-dark-border/20'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('ad-image-input').click()}
            >
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-dark-border/30 rounded-full flex items-center justify-center">
                    <ImageIcon className="text-dark-muted" size={32} />
                  </div>
                  <p className="text-dark-text font-medium mb-1">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-dark-muted text-sm">
                    JPEG, PNG, WebP — max 5MB
                  </p>
                </div>
              )}
              <input
                id="ad-image-input"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                <Type size={16} className="inline mr-2" />
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Try a Session with Any Tutor"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Tag size={16} className="inline mr-2" />
                Tag
              </label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleInputChange}
                placeholder="e.g., 📚 GET STARTED"
                className="input-field w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <textarea
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Describe your advertisement..."
                rows={3}
                className="input-field w-full resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CTA Button Text</label>
              <input
                type="text"
                name="cta"
                value={formData.cta}
                onChange={handleInputChange}
                placeholder="e.g., Browse Tutors"
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Sparkles size={16} className="inline mr-2" />
                Icon
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                placeholder="e.g., school-outline"
                className="input-field w-full"
              />
              <p className="text-xs text-dark-muted mt-1">Ionicons icon name</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Palette size={16} className="inline mr-2" />
                Gradient Preset
              </label>
              <div className="grid grid-cols-2 gap-2">
                {GRADIENT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleGradientChange(preset.colors)}
                    className={`relative p-2 rounded-lg border transition-all duration-200 ${
                      formData.gradient[0] === preset.colors[0] &&
                      formData.gradient[1] === preset.colors[1]
                        ? 'border-primary-500 ring-2 ring-primary-500/30'
                        : 'border-dark-border hover:border-primary-500'
                    }`}
                  >
                    <div
                      className="h-8 rounded-lg mb-1"
                      style={{
                        background: `linear-gradient(90deg, ${preset.colors[0]} 0%, ${preset.colors[1]} 100%)`
                      }}
                    />
                    <span className="text-xs text-dark-muted">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.accent}
                  onChange={(e) => setFormData(prev => ({ ...prev, accent: e.target.value }))}
                  className="w-12 h-10 rounded-lg cursor-pointer p-1 bg-transparent"
                />
                <input
                  type="text"
                  name="accent"
                  value={formData.accent}
                  onChange={handleInputChange}
                  placeholder="#A78BFA"
                  className="input-field flex-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <MousePointer size={16} className="inline mr-2" />
                Target Role
              </label>
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="teacher">Teacher (Section 1 only)</option>
                <option value="student">Student (Section 1 or 2)</option>
              </select>
              <p className="text-xs text-dark-muted mt-1">Where this ad appears</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Tag size={16} className="inline mr-2" />
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="input-field w-full"
              >
                <option value="section1">Section 1</option>
                <option value="section2" disabled={formData.targetRole !== 'student'}>Section 2 (Student only)</option>
              </select>
              <p className="text-xs text-dark-muted mt-1">
                Teachers use Section 1 only. Students use Section 1 &amp; Section 2.
              </p>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-dark-border">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editingId ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Save size={18} />
                  {editingId ? 'Update Advertisement' : 'Create Advertisement'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Ads List */}
      <div className="glass-card rounded-xl border border-dark-border">
        <div className="p-6 border-b border-dark-border">
          <h3 className="text-lg font-semibold text-white">Existing Advertisements</h3>
          <p className="text-dark-muted text-sm mt-1">{ads.length} advertisement(s) total</p>
        </div>

        {ads.length === 0 ? (
          <div className="p-8 text-center text-dark-muted">
            <ImageIcon size={48} className="mx-auto mb-3 opacity-50" />
            <p>No advertisements created yet</p>
            <p className="text-sm mt-1">Create one using the form above</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-border">
            {ads.map((ad) => (
              <div key={ad.id} className="p-4 flex items-center gap-4 hover:bg-dark-border/20 transition-colors">
                {/* Image Preview */}
                <div className="w-20 h-20 rounded-lg bg-dark-border/30 overflow-hidden flex-shrink-0">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="text-dark-muted" size={24} />
                    </div>
                  )}
                </div>

                {/* Ad Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-white">{ad.title}</h4>
                      <p className="text-sm text-dark-muted mt-1 line-clamp-1">{ad.subtitle}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-dark-muted">
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {ad.tag}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer size={12} />
                          {ad.cta}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles size={12} />
                          {ad.targetRole === 'both'
                            ? 'Both'
                            : ad.targetRole === 'teacher'
                            ? 'Teacher'
                            : 'Student'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Palette size={12} />
                          {ad.section === 'section2' ? 'Section 2' : 'Section 1'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleActive(ad)}
                        className={`p-1 rounded transition-colors ${
                          ad.isActive
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-dark-muted hover:text-dark-text'
                        }`}
                        title={ad.isActive ? 'Active' : 'Inactive'}
                      >
                        {ad.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(ad)}
                        className="p-1 text-primary-400 hover:text-primary-300 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-1 text-red-400 hover:text-red-300 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertisementManagement;
