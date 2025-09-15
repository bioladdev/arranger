import { useCallback, useEffect, useState } from 'react';

interface Theme {
  id: string;
  title: string;
  stylePath: string;
}

interface StyleProviderProps {
  availableThemes: Theme[];
  selected: string;
}

const StyleProvider = ({ availableThemes, selected }: StyleProviderProps) => {
  const [state, setState] = useState({
    themeLoaded: false,
    loadedStyle: null,
  });

  const applyStyle = useCallback(async (themes: Theme[], selectedThemeId: string) => {
    const theme = themes.find((theme) => theme.id === selectedThemeId);
    if (!theme) return;

    try {
      const response = await fetch(theme.stylePath);
      const loadedStyle = await response.text();

      setState({
        themeLoaded: true,
        loadedStyle,
      });
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  }, []);

  useEffect(() => {
    applyStyle(availableThemes, selected);
  }, [availableThemes, selected, applyStyle]);

  return state.themeLoaded && state.loadedStyle ? (
    <style type="text/css">{state.loadedStyle}</style>
  ) : null;
};

export default StyleProvider;
