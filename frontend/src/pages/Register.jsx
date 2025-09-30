import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, MapPin, Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Função para formatar telefone automaticamente
  const formatPhone = (value) => {
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 11) numbers = numbers.slice(0, 11);
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  // Validação de telefone (opcional, mas se preenchido, deve ser válido)
  const validatePhone = (phone) => {
    if (!phone) return true;
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  // Validação de endereço (opcional, mas se preenchido, mínimo 10 caracteres)
  const validateAddress = (address) => {
    if (!address) return true;
    return address.trim().length >= 10;
  };

  // Validação de CPF (mantida)
  const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  };

  // Atualização do estado com formatação de telefone
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const formattedPhone = formatPhone(value);
      setFormData({
        ...formData,
        phone: formattedPhone
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  // Validação geral do formulário
  const validateForm = () => {
    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    if (!validatePhone(formData.phone)) {
      setError('Telefone inválido. Use o formato (XX) XXXXX-XXXX');
      return false;
    }
    if (!validateAddress(formData.address)) {
      setError('Endereço deve ter pelo menos 10 caracteres');
      return false;
    }
    return true;
  };

  // Submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch('https://hamburgueria-api-lbm4.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (onLogin) {
          onLogin(data.user, data.token);
        }

        navigate('/');
      } else {
        setError(data.error || 'Erro ao criar conta');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-yellow-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform hover:scale-105 transition-transform duration-300">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full mb-4">
            <UserPlus size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se à família Burger & Cia</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Nome */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Seu nome completo"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
                          focus:ring-2 focus:ring-green-500 focus:border-transparent 
                          transition-all duration-200"
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={15}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Rua, número, bairro"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Botão de Registro */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-yellow-600 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Criando conta...
              </div>
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link 
              to="/login" 
              className="text-green-500 hover:text-green-600 font-semibold transition-colors duration-200"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;