import type { ReactNode } from 'react';

/** A pickable filament: the swatch shows its calibrated colour and its name. */
export type ColourOption = {
  id: string;
  name: string;
  hex: string;
};

type ColorStepProps = {
  title: string;
  description: string;
  colours: ColourOption[];
  value: string;
  onChange: (colour: string) => void;
  secondary?: {
    title: string;
    description: string;
    value: string;
    onChange: (colour: string) => void;
  };
  /** Extra fields rendered after the colour choices (e.g. text + font). */
  children?: ReactNode;
};

function ColourChoice({
  title,
  colours,
  value,
  onChange,
}: Omit<ColorStepProps, 'description' | 'secondary'>) {
  return (
    <div className="tapBoard2LargeSwatches" role="group" aria-label={title}>
      {colours.map((colour) => {
        const selected = colour.hex.toLowerCase() === value.toLowerCase();

        return (
          <button
            type="button"
            className={selected ? 'cubiSwatch active' : 'cubiSwatch'}
            aria-label={`${title}: ${colour.name}`}
            aria-pressed={selected}
            title={colour.name}
            onClick={() => onChange(colour.hex)}
            key={colour.id}
          >
            <span
              className="cubiSwatchChip"
              style={{ backgroundColor: colour.hex }}
              aria-hidden="true"
            >
              {selected ? <span aria-hidden="true">✓</span> : null}
            </span>
            <span className="cubiSwatchName">{colour.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function ColorStep({
  title,
  description,
  colours,
  value,
  onChange,
  secondary,
  children,
}: ColorStepProps) {
  return (
    <section className="tapBoard2StepContent" aria-labelledby="colour-step-title">
      <div className="tapBoard2StepHeading">
        <p>Choose a finish</p>
        <h3 id="colour-step-title">{title}</h3>
        <span>{description}</span>
      </div>

      <ColourChoice
        title={title}
        colours={colours}
        value={value}
        onChange={onChange}
      />

      {secondary ? (
        <div className="tapBoard2SecondaryColour">
          <div>
            <h4>{secondary.title}</h4>
            <p>{secondary.description}</p>
          </div>
          <ColourChoice
            title={secondary.title}
            colours={colours}
            value={secondary.value}
            onChange={secondary.onChange}
          />
        </div>
      ) : null}

      {children}
    </section>
  );
}
