import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="space-y-4">
            <img src={logo} alt="Burger & Cia" className="h-16 w-auto" />
            <p className="font-nunito text-gray-300 text-sm">
              A melhor hamburgueria da cidade! Ingredientes frescos, sabor incomparável e entrega rápida.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-fredoka text-lg text-yellow-400 mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-nunito text-gray-300 hover:text-yellow-400 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/cardapio" className="font-nunito text-gray-300 hover:text-yellow-400 transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link to="/monte-seu-burger" className="font-nunito text-gray-300 hover:text-yellow-400 transition-colors">
                  Monte seu Burger
                </Link>
              </li>
              <li>
                <Link to="/promocoes" className="font-nunito text-gray-300 hover:text-yellow-400 transition-colors">
                  Promoções
                </Link>
              </li>
              <li>
                <Link to="/contato" className="font-nunito text-gray-300 hover:text-yellow-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-fredoka text-lg text-yellow-400 mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-red-500" />
                <span className="font-nunito text-gray-300 text-sm">
                  Rua das Delícias, 123 - Centro
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-red-500" />
                <span className="font-nunito text-gray-300 text-sm">
                  (11) 99999-9999
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-red-500" />
                <span className="font-nunito text-gray-300 text-sm">
                  contato@burgerecia.com
                </span>
              </li>
            </ul>
          </div>

          {/* Horário de Funcionamento */}
          <div>
            <h3 className="font-fredoka text-lg text-yellow-400 mb-4">Horário</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-red-500" />
                <div className="font-nunito text-gray-300 text-sm">
                  <p>Segunda a Quinta: 18h - 23h</p>
                  <p>Sexta e Sábado: 18h - 00h</p>
                  <p>Domingo: 18h - 22h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-nunito text-gray-400 text-sm">
              © 2024 Burger & Cia. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/termos" className="font-nunito text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacidade" className="font-nunito text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

