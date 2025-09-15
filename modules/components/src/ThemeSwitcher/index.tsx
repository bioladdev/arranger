import { useState } from 'react';
import StyleProvider from './StyleProvider.js';

interface Theme {
  id: string;
  title: string;
  stylePath: string;
}

interface ThemeSwitcherProps {
  availableThemes: Theme[];
}

const ThemeSwitcher = ({ availableThemes }: ThemeSwitcherProps) => {
  const [selectedThemeId, setSelectedThemeId] = useState(availableThemes[0]?.id);

  return (
    <>
      <select
        value={selectedThemeId}
        onChange={(e) => setSelectedThemeId(e.target.value)}
      >
        {availableThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.title}
          </option>
        ))}
      </select>
      <StyleProvider
        selected={selectedThemeId}
        availableThemes={availableThemes}
      />
    </>
  );
};

export default ThemeSwitcher;

export const AVAILABLE_THEMES = [
  {
    id: 'beagle',
    title: 'Beagle',
    stylePath: '/themeStyles/beagle/beagle.css',
  },
  {
    id: 'default',
    title: 'Default',
    stylePath: '/themeStyles/default.css',
  },
];

export { StyleProvider };
