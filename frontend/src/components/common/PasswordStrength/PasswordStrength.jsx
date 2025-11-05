import { useState, useEffect } from 'react';
import './PasswordStrength.css';

const PasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState('');
  const [requirements, setRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    if (!password) {
      setStrength('');
      setRequirements({
        minLength: false,
        hasUpperCase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
      return;
    }

    // Verificar requisitos
    const newRequirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    setRequirements(newRequirements);

    // Calcular força da senha
    const metRequirements = Object.values(newRequirements).filter(Boolean).length;

    if (metRequirements === 4) {
      setStrength('forte');
    } else if (metRequirements >= 2) {
      setStrength('media');
    } else {
      setStrength('fraca');
    }
  }, [password]);

  const getStrengthColor = () => {
    switch (strength) {
      case 'forte':
        return '#28a745';
      case 'media':
        return '#ffc107';
      case 'fraca':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStrengthText = () => {
    switch (strength) {
      case 'forte':
        return 'Senha Forte';
      case 'media':
        return 'Senha Média';
      case 'fraca':
        return 'Senha Fraca';
      default:
        return '';
    }
  };

  return (
    <div className="password-strength-container">
      {password && (
        <>
          <div className="strength-bar-container">
            <div 
              className={`strength-bar ${strength}`}
              style={{ backgroundColor: getStrengthColor() }}
            ></div>
            <span className="strength-text" style={{ color: getStrengthColor() }}>
              {getStrengthText()}
            </span>
          </div>

          <div className="password-requirements">
            <p className="requirements-title">A senha deve conter:</p>
            <ul className="requirements-list">
              <li className={requirements.minLength ? 'met' : 'not-met'}>
                <span className="icon">{requirements.minLength ? '✓' : '✗'}</span>
                Mínimo de 8 caracteres
              </li>
              <li className={requirements.hasUpperCase ? 'met' : 'not-met'}>
                <span className="icon">{requirements.hasUpperCase ? '✓' : '✗'}</span>
                Pelo menos uma letra maiúscula
              </li>
              <li className={requirements.hasNumber ? 'met' : 'not-met'}>
                <span className="icon">{requirements.hasNumber ? '✓' : '✗'}</span>
                Pelo menos um número
              </li>
              <li className={requirements.hasSpecialChar ? 'met' : 'not-met'}>
                <span className="icon">{requirements.hasSpecialChar ? '✓' : '✗'}</span>
                Pelo menos um caractere especial (!@#$%^&*...)
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default PasswordStrength;
