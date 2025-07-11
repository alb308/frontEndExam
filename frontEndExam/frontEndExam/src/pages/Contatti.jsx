import React, { useState } from 'react';
import './Contatti.css';

function Contatti() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    oggetto: '',
    messaggio: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;

  const validateField = (name, value) => {
    switch (name) {
      case 'nome':
        if (!value.trim()) return 'Il nome è obbligatorio';
        if (value.length < 2) return 'Il nome deve avere almeno 2 caratteri';
        if (value.length > 50) return 'Il nome non può superare i 50 caratteri';
        return '';

      case 'email':
        if (!value.trim()) return 'L\'email è obbligatoria';
        if (!emailRegex.test(value)) return 'Email non valida';
        return '';

      case 'telefono':
        if (value && !phoneRegex.test(value)) return 'Numero di telefono non valido';
        if (value && value.replace(/\D/g, '').length < 10) return 'Il numero deve avere almeno 10 cifre';
        return '';

      case 'oggetto':
        if (!value.trim()) return 'L\'oggetto è obbligatorio';
        if (value.length < 5) return 'L\'oggetto deve avere almeno 5 caratteri';
        if (value.length > 100) return 'L\'oggetto non può superare i 100 caratteri';
        return '';

      case 'messaggio':
        if (!value.trim()) return 'Il messaggio è obbligatorio';
        if (value.length < 10) return 'Il messaggio deve avere almeno 10 caratteri';
        if (value.length > 1000) return 'Il messaggio non può superare i 1000 caratteri';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.nome.trim() && 
           formData.email.trim() && 
           emailRegex.test(formData.email) &&
           formData.oggetto.trim() && 
           formData.messaggio.trim() &&
           formData.messaggio.length >= 10 &&
           formData.messaggio.length <= 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form inviato:', formData);

      setSubmitSuccess(true);
      setFormData({
        nome: '',
        email: '',
        telefono: '',
        oggetto: '',
        messaggio: ''
      });
      setErrors({});

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Errore:', error);
      setErrors({ submit: 'Errore nell\'invio del messaggio. Riprova più tardi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contatti-page">
      <div className="contatti-container">
        <h1 className="page-title">Contattaci</h1>
        <p className="contatti-subtitle">
          Hai domande sulla collezione o vuoi suggerire nuove lattine? Scrivici!
        </p>

        {submitSuccess && (
          <div className="success-message">
            ✅ Messaggio inviato con successo! Ti risponderemo presto.
          </div>
        )}

        {errors.submit && (
          <div className="error-message">
            ❌ {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.nome ? 'error' : ''}`}
                disabled={isSubmitting}
                placeholder="Il tuo nome"
              />
              {errors.nome && <span className="field-error">{errors.nome}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={isSubmitting}
                placeholder="tua@email.com"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Telefono (opzionale)</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.telefono ? 'error' : ''}`}
                placeholder="+39 123 456 7890"
                disabled={isSubmitting}
              />
              {errors.telefono && <span className="field-error">{errors.telefono}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="oggetto">Oggetto *</label>
              <input
                type="text"
                id="oggetto"
                name="oggetto"
                value={formData.oggetto}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.oggetto ? 'error' : ''}`}
                disabled={isSubmitting}
                placeholder="Oggetto del messaggio"
              />
              {errors.oggetto && <span className="field-error">{errors.oggetto}</span>}
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="messaggio">Messaggio *</label>
            <textarea
              id="messaggio"
              name="messaggio"
              value={formData.messaggio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.messaggio ? 'error' : ''}`}
              rows="6"
              disabled={isSubmitting}
              placeholder="Scrivi il tuo messaggio..."
            />
            <div className="textarea-info">
              <span className={formData.messaggio.length > 1000 ? 'over-limit' : ''}>
                {formData.messaggio.length}/1000 caratteri
              </span>
            </div>
            {errors.messaggio && <span className="field-error">{errors.messaggio}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting || !isFormValid()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Invio in corso...
                </>
              ) : (
                'Invia Messaggio'
              )}
            </button>
            <button 
              type="button" 
              className="reset-btn"
              onClick={() => {
                setFormData({
                  nome: '',
                  email: '',
                  telefono: '',
                  oggetto: '',
                  messaggio: ''
                });
                setErrors({});
              }}
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>

          <p className="required-note">* Campi obbligatori</p>
        </form>

        <div className="contact-info">
          <h3>Altri Modi per Contattarci</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>📧 Email</h4>
              <p>albertogiunta2004@gmail.com</p>
            </div>
            <div className="info-item">
              <h4>📱 Social</h4>
              <p>@albertogiunta_</p>
            </div>
            <div className="info-item">
              <h4>🕐 Tempi di Risposta</h4>
              <p>24-48 ore lavorative(se non ho altri esami)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contatti;