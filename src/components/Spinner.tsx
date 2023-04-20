import { getCssColorFromTailwind } from '@/utils/ThemeUtils';

export default function Spinner({ size = 64, color = 'brand-green-400'}) {
  //Due to the way tailwind works, we need to convert the tailwind color to a css color
  //TODO: Try to see if importing the color list into the tailwind config file will work
  const cssColor = getCssColorFromTailwind(color);

  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" strokeWidth="8" stroke={cssColor} fill="none" opacity="0.2" />
      <circle className="fill" cx="50" cy="50" r="40" strokeWidth="8" stroke={cssColor} strokeLinecap="round" fill="none" />
    </svg>
  );
}