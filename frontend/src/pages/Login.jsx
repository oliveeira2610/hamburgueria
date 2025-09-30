import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://hamburgueria-api-lbm4.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar token no localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Chamar função de callback para atualizar estado global
        if (onLogin) {
          onLogin(data.user, data.token);
        }

        // Redirecionar baseado no role do usuário
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-yellow-500 to-green-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform hover:scale-105 transition-transform duration-300">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full mb-4">
            <User size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo!</h1>
          <p className="text-gray-600">Faça login para continuar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-yellow-600 focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Links */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link 
              to="/register" 
              className="text-red-500 hover:text-red-600 font-semibold transition-colors duration-200"
            >
              Cadastre-se
            </Link>
          </p>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Contas de teste:</p>
            <div className="text-xs text-gray-400 space-y-1">
              <p><strong>Admin:</strong> admin@burgercia.com / admin123</p>
              <p><strong>Usuário:</strong> joao@email.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

