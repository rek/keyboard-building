import { useState } from "react";
import { useCurrency } from "../../contexts/CurrencyContext";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { ImageModal } from "../common/ImageModal";

// Get base path from vite config for GitHub Pages support
const getImageUrl = (path: string) => {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present and combine with base
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};

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

export function ComponentCard({
  component,
  category,
  onClick,
}: ComponentCardProps) {
  const { formatCurrency } = useCurrency();
  const { settings } = useAppSettings();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer overflow-hidden transition-all tech-card group"
      style={{
        border: "3px solid var(--color-border)",
        background: "var(--color-bg-secondary)",
      }}
    >
      {/* Image */}
      <div
        className="w-full h-48 flex items-center justify-center overflow-hidden relative group/image"
        style={{
          background: "var(--color-bg-primary)",
          borderBottom: "3px solid var(--color-border)",
        }}
      >
        {component.image ? (
          <div
            className="w-full h-full relative cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageModalOpen(true);
            }}
          >
            <img
              src={getImageUrl(component.image)}
              alt={component.name}
              className="w-full h-full object-contain p-4 transition-transform group-hover/image:scale-105"
            />
            {/* Zoom indicator */}
            <div
              className="absolute bottom-2 right-2 px-2 py-1 text-xs font-bold tracking-wider opacity-0 group-hover/image:opacity-100 transition-opacity"
              style={{
                background: "var(--color-accent-orange)",
                color: "white",
                fontFamily: "var(--font-display)",
              }}
            >
              🔍 CLICK TO ENLARGE
            </div>
          </div>
        ) : (
          <span
            className="font-bold text-xs tracking-widest"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-secondary)",
            }}
          >
            [IMG_PLACEHOLDER]
          </span>
        )}
        {/* Category badge */}
        <div
          className="absolute top-2 right-2 px-2 py-1 text-xs font-bold tracking-wider"
          style={{
            background: "var(--color-accent-teal)",
            color: "white",
            fontFamily: "var(--font-display)",
          }}
        >
          {category.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h3
            className="font-bold text-base mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
              letterSpacing: "0.02em",
            }}
          >
            {component.name.toUpperCase()}
          </h3>

          {/* Price */}
          {settings.showPricing && (
            <div
              className="font-bold text-lg"
              style={{
                color: "var(--color-accent-orange)",
                fontFamily: "var(--font-display)",
              }}
            >
              {formatCurrency(component.price)}
              {component.priceUnit && (
                <span
                  className="text-xs ml-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  /{component.priceUnit}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Complexity */}
        <div className="mb-4">
          <div
            className="text-xs mb-2 font-bold tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-secondary)",
            }}
          >
            COMPLEXITY
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 border-2 transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  background:
                    i < component.complexity
                      ? "var(--color-accent-orange)"
                      : "transparent",
                }}
              />
            ))}
          </div>
        </div>

        {/* Specs Preview */}
        {component.specs && (
          <div
            className="mb-4 p-3 space-y-1.5"
            style={{
              border: "2px solid var(--color-border-light)",
              background: "var(--color-bg-primary)",
            }}
          >
            {Object.entries(component.specs)
              .slice(0, 3)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs"
                >
                  <span
                    className="font-bold tracking-wide"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {key.replace(/([A-Z])/g, "_$1").toUpperCase()}:
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {typeof value === "boolean"
                      ? value
                        ? "YES"
                        : "NO"
                      : String(value).toUpperCase()}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Pros (top 2) */}
        {component.pros.length > 0 && (
          <div className="mb-3">
            <div
              className="text-xs font-bold mb-2 tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-accent-teal)",
              }}
            >
              [+] PROS
            </div>
            <ul className="space-y-1.5">
              {component.pros.slice(0, 2).map((pro, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs pl-3"
                  style={{
                    borderLeft: "2px solid var(--color-accent-teal)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Cons (top 2) */}
        {component.cons.length > 0 && (
          <div className="mb-4">
            <div
              className="text-xs font-bold mb-2 tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-accent-orange)",
              }}
            >
              [-] CONS
            </div>
            <ul className="space-y-1.5">
              {component.cons.slice(0, 2).map((con, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs pl-3"
                  style={{
                    borderLeft: "2px solid var(--color-accent-orange)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Compatibility Tags */}
        {(component.compatibleWith || component.incompatibleWith) && (
          <div
            className="flex flex-wrap gap-2 pt-3"
            style={{ borderTop: "2px solid var(--color-border-light)" }}
          >
            {component.compatibleWith?.slice(0, 3).map((item) => (
              <span
                key={item}
                className="px-2 py-1 text-xs font-bold tracking-wide"
                style={{
                  border: "2px solid var(--color-accent-teal)",
                  background: "transparent",
                  color: "var(--color-accent-teal)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {item.toUpperCase()}
              </span>
            ))}
            {component.incompatibleWith?.slice(0, 2).map((item) => (
              <span
                key={item}
                className="px-2 py-1 text-xs font-bold tracking-wide line-through opacity-50"
                style={{
                  border: "2px solid var(--color-border-light)",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {item.toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {isImageModalOpen && component.image && (
        <ImageModal
          src={getImageUrl(component.image)}
          alt={component.name}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}
