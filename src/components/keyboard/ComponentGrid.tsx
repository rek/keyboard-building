import React, { useState } from 'react';
import { ComponentCard } from './ComponentCard';
import componentsData from '../../data/components.json';
import categoryInfo from '../../data/category-info.json';

type ComponentCategory = 'controllers' | 'switches' | 'features' | 'connectivity' | 'firmware';

export function ComponentGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('controllers');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { id: ComponentCategory; label: string }[] = [
    { id: 'controllers', label: 'Controllers' },
    { id: 'switches', label: 'Switches' },
    { id: 'features', label: 'Features' },
    { id: 'connectivity', label: 'Connectivity' },
    { id: 'firmware', label: 'Firmware' },
  ];

  const getComponents = (category: ComponentCategory) => {
    const categoryData = componentsData[category];
    if (!categoryData) return [];

    return Object.values(categoryData).map((component: any) => ({
      ...component,
      category,
    }));
  };

  const filteredComponents = getComponents(selectedCategory).filter((component) =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCategoryInfo = categoryInfo[selectedCategory];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Component Encyclopedia
        </h1>
        <p className="text-gray-600">
          Browse and learn about all the components you'll need for your split keyboard build.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search components..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Category Introduction */}
      {currentCategoryInfo && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {currentCategoryInfo.title}
            </h2>
            <p className="text-blue-600 font-medium italic">
              {currentCategoryInfo.tagline}
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {currentCategoryInfo.description}
          </p>

          {/* Why It Matters */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Why It Matters:</h3>
            <ul className="space-y-1">
              {currentCategoryInfo.whyItMatters.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Tradeoffs */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Key Trade-offs:</h3>
            <div className="space-y-3">
              {currentCategoryInfo.keyTradeoffs.map((tradeoff, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {tradeoff.factor}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {tradeoff.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Tips:</h3>
            <ul className="space-y-1">
              {currentCategoryInfo.quickTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Components Grid */}
      {filteredComponents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              category={selectedCategory}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No components found matching your search.</p>
        </div>
      )}
    </div>
  );
}
