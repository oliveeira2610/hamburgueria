import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, ChefHat, Sparkles } from 'lucide-react';

const CustomBurger = ({ onAddToCart }) => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [burgerName, setBurgerName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('https://hamburgueria-api-lbm4.onrender.com/api/ingredients');
      const data = await response.json();
      setIngredients(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar ingredientes:', error);
      setLoading(false);
    }
  };

  const handleIngredientChange = (ingredientId, quantity) => {
    setSelectedIngredients(prev => {
      if (quantity <= 0) {
        const newSelected = { ...prev };
        delete newSelected[ingredientId];
        return newSelected;
      }
      return {
        ...prev,
        [ingredientId]: quantity
      };
    });
  };

  const calculateTotal = () => {
    const basePrice = 12.90; // Preço base do hambúrguer personalizado
    const ingredientsPrice = Object.entries(selectedIngredients).reduce((total, [ingredientId, quantity]) => {
      const ingredient = ingredients.find(ing => ing.id === parseInt(ingredientId));
      return total + (ingredient ? ingredient.price * quantity : 0);
    }, 0);
    return basePrice + ingredientsPrice;
  };

  const getSelectedIngredientsText = () => {
    return Object.entries(selectedIngredients).map(([ingredientId, quantity]) => {
      const ingredient = ingredients.find(ing => ing.id === parseInt(ingredientId));
      return ingredient ? `${quantity}x ${ingredient.name}` : '';
    }).filter(Boolean).join(', ');
  };

  const handleAddToCart = () => {
    if (Object.keys(selectedIngredients).length === 0) {
      alert('Selecione pelo menos um ingrediente para seu hambúrguer!');
      return;
    }

    const customBurger = {
  id: `custom-${Date.now()}`,
  name: burgerName || 'Hambúrguer Personalizado',
  price: calculateTotal(),
  image: null,
  quantity: 1,
  custom_ingredients: selectedIngredients, 
  notes: getSelectedIngredientsText()
};


    onAddToCart(customBurger);
    
    // Reset form
    setSelectedIngredients({});
    setBurgerName('');
    
    alert('Hambúrguer personalizado adicionado ao carrinho!');
  };

  const ingredientCategories = {
    'Proteínas': ingredients.filter(ing => ['Carne Bovina'].includes(ing.name)),
    'Queijos': ingredients.filter(ing => ['Queijo Cheddar'].includes(ing.name)),
    'Carnes Extras': ingredients.filter(ing => ['Bacon'].includes(ing.name)),
    'Vegetais': ingredients.filter(ing => ['Alface', 'Tomate', 'Cebola', 'Picles'].includes(ing.name)),
    'Molhos': ingredients.filter(ing => ['Molho Especial', 'Molho Barbecue'].includes(ing.name)),
    'Pães': ingredients.filter(ing => ['Pão Brioche'].includes(ing.name))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="font-nunito text-lg text-gray-600">Carregando ingredientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="w-12 h-12 text-red-600 mr-4" />
            <h1 className="font-fredoka text-4xl md:text-5xl text-gray-800">
              Monte seu Hambúrguer
            </h1>
            <Sparkles className="w-12 h-12 text-yellow-400 ml-4" />
          </div>
          <p className="font-nunito text-lg text-gray-600 max-w-2xl mx-auto">
            Crie o hambúrguer dos seus sonhos! Escolha os ingredientes e monte uma combinação única e deliciosa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Burger Name Input */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="font-fredoka text-2xl text-gray-800 mb-4">
                Nome do seu Hambúrguer
              </h2>
              <input
                type="text"
                value={burgerName}
                onChange={(e) => setBurgerName(e.target.value)}
                placeholder="Ex: Mega Burger do João"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-nunito"
              />
            </div>

            {/* Ingredients Categories */}
            {Object.entries(ingredientCategories).map(([category, categoryIngredients]) => (
              categoryIngredients.length > 0 && (
                <div key={category} className="bg-white rounded-2xl p-6 shadow-lg">
                  <h2 className="font-fredoka text-2xl text-gray-800 mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryIngredients.map((ingredient) => (
                      <div key={ingredient.id} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-nunito font-semibold text-gray-800">{ingredient.name}</h3>
                            <p className="font-nunito text-red-600 font-bold">
                              {ingredient.price > 0 ? `+R$ ${ingredient.price.toFixed(2).replace('.', ',')}` : 'Grátis'}
                            </p>
                          </div>
                          <div className="text-3xl">
                            {ingredient.name === 'Carne Bovina' ? '🥩' :
                             ingredient.name === 'Queijo Cheddar' ? '🧀' :
                             ingredient.name === 'Bacon' ? '🥓' :
                             ingredient.name === 'Alface' ? '🥬' :
                             ingredient.name === 'Tomate' ? '🍅' :
                             ingredient.name === 'Cebola' ? '🧅' :
                             ingredient.name === 'Picles' ? '🥒' :
                             ingredient.name === 'Molho Especial' ? '🍯' :
                             ingredient.name === 'Molho Barbecue' ? '🍯' :
                             ingredient.name === 'Pão Brioche' ? '🍞' : '🍔'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() => handleIngredientChange(ingredient.id, (selectedIngredients[ingredient.id] || 0) - 1)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            disabled={!selectedIngredients[ingredient.id]}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-nunito font-bold text-lg w-8 text-center">
                            {selectedIngredients[ingredient.id] || 0}
                          </span>
                          
                          <button
                            onClick={() => handleIngredientChange(ingredient.id, (selectedIngredients[ingredient.id] || 0) + 1)}
                            className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Burger Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
              <h2 className="font-fredoka text-2xl text-gray-800 mb-4">Seu Hambúrguer</h2>
              
              {/* Burger Visual */}
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">🍔</div>
                <h3 className="font-fredoka text-xl text-gray-800">
                  {burgerName || 'Hambúrguer Personalizado'}
                </h3>
              </div>

              {/* Selected Ingredients */}
              <div className="mb-6">
                <h4 className="font-nunito font-semibold text-gray-700 mb-3">Ingredientes Selecionados:</h4>
                {Object.keys(selectedIngredients).length === 0 ? (
                  <p className="font-nunito text-gray-500 text-sm italic">Nenhum ingrediente selecionado</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(selectedIngredients).map(([ingredientId, quantity]) => {
                      const ingredient = ingredients.find(ing => ing.id === parseInt(ingredientId));
                      return ingredient ? (
                        <div key={ingredientId} className="flex justify-between items-center text-sm">
                          <span className="font-nunito text-gray-700">
                            {quantity}x {ingredient.name}
                          </span>
                          <span className="font-nunito font-semibold text-gray-800">
                            R$ {(ingredient.price * quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-nunito text-gray-600">Base do Hambúrguer:</span>
                  <span className="font-nunito font-semibold">R$ 12,90</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-nunito text-gray-600">Ingredientes Extras:</span>
                  <span className="font-nunito font-semibold">
                    R$ {(calculateTotal() - 12.90).toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg border-t border-gray-200 pt-2">
                  <span className="font-fredoka text-gray-800">Total:</span>
                  <span className="font-fredoka text-2xl text-red-600">
                    R$ {calculateTotal().toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full btn-primary py-4 rounded-lg font-nunito font-bold text-lg flex items-center justify-center space-x-2 hover:scale-105 transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="font-fredoka text-lg text-gray-800 mb-3">💡 Dicas do Chef</h3>
              <ul className="font-nunito text-sm text-gray-700 space-y-2">
                <li>• Experimente combinar bacon com queijo cheddar</li>
                <li>• O molho barbecue vai bem com cebola</li>
                <li>• Não esqueça dos vegetais para equilibrar</li>
                <li>• O pão brioche deixa tudo mais gostoso!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Popular Combinations */}
        <div className="mt-16">
          <h2 className="font-fredoka text-3xl text-center text-gray-800 mb-8">
            Combinações Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Clássico Gourmet',
                ingredients: 'Carne, Queijo Cheddar, Alface, Tomate, Molho Especial',
                price: 'R$ 16,90',
                emoji: '🍔'
              },
              {
                name: 'Bacon Lover',
                ingredients: 'Carne, Bacon, Queijo Cheddar, Cebola, Molho Barbecue',
                price: 'R$ 19,90',
                emoji: '🥓'
              },
              {
                name: 'Veggie Deluxe',
                ingredients: 'Alface, Tomate, Cebola, Picles, Molho Especial',
                price: 'R$ 13,90',
                emoji: '🥬'
              }
            ].map((combo, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{combo.emoji}</div>
                  <h3 className="font-fredoka text-xl text-gray-800">{combo.name}</h3>
                </div>
                <p className="font-nunito text-gray-600 text-sm mb-4 text-center">
                  {combo.ingredients}
                </p>
                <div className="text-center">
                  <span className="font-fredoka text-xl text-red-600">{combo.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomBurger;

