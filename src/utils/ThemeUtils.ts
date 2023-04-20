// This file contains utility functions for working with the site theme

// This is the default brand color for the site
export const brandGreen : any = {
  100: 'hsl(118, 68%, 80%)',
  200: 'hsl(118, 57%, 72%)',
  300: 'hsl(118, 47%, 63%)',
  400: 'hsl(118, 39%, 56%)',
  500: 'hsl(118, 33%, 50%)',
  600: 'hsl(118, 27%, 43%)',
  700: 'hsl(118, 37%, 39%)',
  800: 'hsl(118, 41%, 32%)',
  900: 'hsl(118, 44%, 25%)',
};

type ColorMapper = {
  [key: string]: string;
};

const tailwindColorMapper: ColorMapper = {
  ...Object.keys(brandGreen).reduce<ColorMapper>((acc, shade) => {
    acc[`brand-green-${shade}`] = brandGreen[shade];
    return acc;
  }, {}),
  // Add more color mappings here
};

export function getCssColorFromTailwind(tailwindColor: string): string {
  return tailwindColorMapper[tailwindColor] || tailwindColor;
}