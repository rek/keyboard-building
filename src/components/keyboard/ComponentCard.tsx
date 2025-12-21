import React from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAppSettings } from '../../contexts/AppSettingsContext';

interface ComponentCardProps {
  component: {
    id: string;
    name: string;
    price: number;
    priceUnit?: string;
    image: string;
    complexity: number;
    specs?: Record<string, any>;
    pros: string[];
    cons: string[];
    compatibleWith?: string[];
    incompatibleWith?: string[];
  };
  category: string;
  onClick?: () => void;
}

export function ComponentCard({ component, category, onClick }: ComponentCardProps) {
  const { formatCurrency } = useCurrency();
  const { settings } = useAppSettings();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
        {component.image ? (
          <img
            src={component.image}
            alt={component.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400">Component Image</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-gray-900 text-lg">{component.name}</h3>
            <span className="text-sm text-gray-500 uppercase">{category}</span>
          </div>

          {/* Price */}
          {settings.showPricing && (
            <div className="text-blue-600 font-semibold text-xl">
              {formatCurrency(component.price)}
              {component.priceUnit && (
                <span className="text-sm text-gray-500 ml-1">
                  {component.priceUnit}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Complexity */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Complexity</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < component.complexity ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Specs Preview */}
        {component.specs && (
          <div className="mb-3 space-y-1">
            {Object.entries(component.specs)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="text-gray-900 font-medium">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Pros (top 2) */}
        {component.pros.length > 0 && (
          <div className="mb-2">
            <div className="text-xs font-semibold text-green-700 mb-1">Pros</div>
            <ul className="space-y-1">
              {component.pros.slice(0, 2).map((pro, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-700">
                  <span className="text-green-600 mt-0.5">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons (top 2) */}
        {component.cons.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-red-700 mb-1">Cons</div>
            <ul className="space-y-1">
              {component.cons.slice(0, 2).map((con, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-700">
                  <span className="text-red-600 mt-0.5">−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compatibility Tags */}
        {(component.compatibleWith || component.incompatibleWith) && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-200">
            {component.compatibleWith?.slice(0, 3).map((item) => (
              <span
                key={item}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
              >
                {item}
              </span>
            ))}
            {component.incompatibleWith?.slice(0, 2).map((item) => (
              <span
                key={item}
                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs line-through"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
