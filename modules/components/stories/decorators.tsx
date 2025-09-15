import ThemeSwitcher, { AVAILABLE_THEMES } from '#ThemeSwitcher/index.js';

export const themeDecorator = (story: () => React.ReactNode) => (
	<>
		<ThemeSwitcher availableThemes={AVAILABLE_THEMES} />
		{story()}
	</>
);
