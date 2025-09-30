import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, User } from 'lucide-react';

const Cart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, user, token }) => {
  // ✅ Função para formatar CPF (opcional)
  const formatCPF = (value) => {
    if (!value) return '';
    let numbers = value.replace(/\D/g, '');
    if (numbers.length > 11) numbers = numbers.slice(0, 11);
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`;
  };

  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    cpf: user?.cpf || '', // ✅ CPF carregado automaticamente
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // ✅ Atualizado para formatar CPF automaticamente
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      const formattedCPF = formatCPF(value);
      setCustomerInfo(prev => ({
        ...prev,
        cpf: formattedCPF
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (!user || !token) {
      alert('Você precisa estar logado para finalizar o pedido.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email,
        customer_cpf: customerInfo.cpf.replace(/\D/g, ''), // ✅ Remove máscara ao enviar
        delivery_address: customerInfo.address,
        notes: customerInfo.notes,
        total_amount: calculateTotal(),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1, // ✅ Valor padrão se não existir
          unit_price: item.price,
          custom_ingredients: item.custom_ingredients || [],
          notes: item.notes || '',
          custom_name: item.custom_name || null
        }))
      };

      const response = await fetch('https://hamburgueria-api-lbm4.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setOrderSuccess(true);
        onClearCart();
        setCustomerInfo({
          name: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          address: user?.address || '',
          cpf: user?.cpf || '',
          notes: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao processar pedido');
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      if (error.message.includes('Token')) {
        alert('Sua sessão expirou. Faça login novamente.');
        navigate('/login');
      } else {
        alert('Erro ao processar pedido. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user && cartItems.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="font-fredoka text-3xl text-gray-800 mb-4">
                Login Necessário
              </h1>
              <p className="font-nunito text-gray-600 mb-6">
                Para finalizar seu pedido, você precisa estar logado em sua conta.
              </p>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="btn-primary px-8 py-3 rounded-full font-nunito font-semibold inline-block"
                >
                  Fazer Login
                </Link>
                <br />
                <Link
                  to="/register"
                  className="font-nunito text-green-600 hover:text-green-700 transition-colors"
                >
                  Ou criar uma conta nova
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="font-fredoka text-3xl text-green-600 mb-4">
                Pedido Realizado com Sucesso!
              </h1>
              <p className="font-nunito text-gray-600 mb-6">
                Seu pedido foi recebido e está sendo preparado. Você receberá uma confirmação em breve.
              </p>
              <div className="space-y-4">
                <Link
                  to="/cardapio"
                  className="btn-primary px-8 py-3 rounded-full font-nunito font-semibold inline-block"
                >
                  Fazer Novo Pedido
                </Link>
                <br />
                <Link
                  to="/"
                  className="font-nunito text-gray-600 hover:text-red-600 transition-colors"
                >
                  Voltar ao Início
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="font-fredoka text-3xl text-gray-800 mb-4">
                Seu carrinho está vazio
              </h1>
              <p className="font-nunito text-gray-600 mb-6">
                Adicione alguns deliciosos hambúrgueres ao seu carrinho para continuar.
              </p>
              <Link
                to="/cardapio"
                className="btn-primary px-8 py-3 rounded-full font-nunito font-semibold inline-block"
              >
                Ver Cardápio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                to="/cardapio"
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Cardápio
              </Link>
              <h1 className="font-fredoka text-3xl text-gray-800">Seu Carrinho</h1>
            </div>
            
            {user && (
              <div className="hidden md:flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
                <User className="w-4 h-4 text-green-600" />
                <span className="font-nunito text-sm text-green-800">
                  Logado como: {user.name}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="font-fredoka text-xl text-gray-800">Itens do Pedido</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-yellow-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-2xl">🍔</div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-nunito font-semibold text-gray-800">{item.name}</h3>
                        {item.notes && (
                          <ul className="list-disc list-inside text-xs text-gray-500 mt-1">
                            {item.notes.split(',').map((note, idx) => (
                              <li key={idx}>{note.trim()}</li>
                            ))}
                          </ul>
                        )}
                        <p className="font-nunito text-red-600 font-bold">
                          R$ {parseFloat(item.price).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-nunito font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary & Customer Info */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-fredoka text-xl text-gray-800 mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-nunito text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-nunito font-semibold">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      {item.notes && (
                        <ul className="list-disc list-inside text-xs text-gray-500 ml-4">
                          {item.notes.split(',').map((note, idx) => (
                            <li key={idx}>{note.trim()}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>R$ {calculateTotal().toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Customer Information Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="font-fredoka text-xl text-gray-800 mb-4">Dados para Entrega</h2>
                
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={customerInfo.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                      maxLength="14"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      Endereço de Entrega *
                    </label>
                    <textarea
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Rua, número, bairro, cidade..."
                    />
                  </div>
                  
                  <div>
                    <label className="block font-nunito font-semibold text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Alguma observação especial..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 rounded-lg font-nunito font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;