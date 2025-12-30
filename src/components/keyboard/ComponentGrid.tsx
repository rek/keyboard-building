import React, { useState } from 'react';
import { ComponentCard } from './ComponentCard';
import componentsData from '../../data/components.json';
import categoryInfo from '../../data/category-info.json';

type ComponentCategory = 'controllers' | 'switches' | 'features' | 'connectivity' | 'firmware' | 'electronics';

export function ComponentGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('controllers');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { id: ComponentCategory; label: string }[] = [
    { id: 'controllers', label: 'Controllers' },
    { id: 'switches', label: 'Switches' },
    { id: 'features', label: 'Features' },
    { id: 'connectivity', label: 'Connectivity' },
    { id: 'firmware', label: 'Firmware' },
    { id: 'electronics', label: 'Electronics' },
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
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="SEARCH_COMPONENTS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 transition-all focus:outline-none"
          style={{
            border: '3px solid var(--color-border)',
            background: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.875rem',
            letterSpacing: '0.05em'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent-orange)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className="px-6 py-3 font-bold transition-all border-2 text-sm tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              borderColor: selectedCategory === category.id ? 'var(--color-accent-orange)' : 'var(--color-border)',
              background: selectedCategory === category.id ? 'var(--color-accent-orange)' : 'transparent',
              color: selectedCategory === category.id ? 'white' : 'var(--color-text-primary)',
            }}
          >
            {category.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Category Introduction */}
      {currentCategoryInfo && (
        <div
          className="mb-8 p-6 md:p-8"
          style={{
            border: '3px solid var(--color-border)',
            background: 'var(--color-bg-secondary)'
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <h2
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                color: 'var(--color-text-primary)'
              }}
            >
              {currentCategoryInfo.title.toUpperCase()}
            </h2>
            <p
              className="font-medium text-base"
              style={{
                color: 'var(--color-accent-orange)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.03em'
              }}
            >
              // {currentCategoryInfo.tagline}
            </p>
          </div>

          {/* Description */}
          <p
            className="mb-6 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {currentCategoryInfo.description}
          </p>

          {/* Why It Matters */}
          <div className="mb-6">
            <h3
              className="font-bold mb-3 text-sm tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)'
              }}
            >
              [WHY_IT_MATTERS]
            </h3>
            <ul className="space-y-2">
              {currentCategoryInfo.whyItMatters.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm pl-4"
                  style={{
                    borderLeft: '2px solid var(--color-accent-teal)',
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  <span className="font-bold" style={{ color: 'var(--color-accent-teal)' }}>
                    [{String(index + 1).padStart(2, '0')}]
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Tradeoffs */}
          <div className="mb-6">
            <h3
              className="font-bold mb-3 text-sm tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)'
              }}
            >
              [KEY_TRADEOFFS]
            </h3>
            <div className="space-y-3">
              {currentCategoryInfo.keyTradeoffs.map((tradeoff, index) => (
                <div
                  key={index}
                  className="p-4"
                  style={{
                    border: '2px solid var(--color-border-light)',
                    background: 'var(--color-bg-primary)'
                  }}
                >
                  <h4
                    className="font-bold text-sm mb-2 tracking-wide"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-primary)'
                    }}
                  >
                    {tradeoff.factor.toUpperCase()}
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {tradeoff.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div>
            <h3
              className="font-bold mb-3 text-sm tracking-wide"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)'
              }}
            >
              [QUICK_TIPS]
            </h3>
            <ul className="space-y-2">
              {currentCategoryInfo.quickTips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span
                    className="font-bold mt-0.5"
                    style={{
                      color: 'var(--color-accent-orange)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    &gt;
                  </span>
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
        <div
          className="text-center py-12 px-6"
          style={{
            border: '3px solid var(--color-border)',
            background: 'var(--color-bg-secondary)'
          }}
        >
          <p
            className="font-bold tracking-wide"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-secondary)'
            }}
          >
            [NO_RESULTS_FOUND]
          </p>
        </div>
      )}
    </div>
  );
}
