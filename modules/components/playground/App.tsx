// src/dev/Playground.jsx
import { useState, Suspense, lazy, useMemo } from 'react';

// Adjust glob pattern to match where your components live
const modules = import.meta.glob('../src/**/*.{jsx,tsx}');

const EXCLUDED = new Set(['Aggregations', 'Bar', 'Baz']);

const registry = Object.fromEntries(
	Object.entries(modules)
		.map(([path, loader]) => {
			const name = path.split('/').pop().replace('.jsx', '');
			return [name, lazy(loader)];
		})
		.filter((o) => !EXCLUDED.has(o.name)),
);

console.log(registry);

export default function Playground() {
	const names = useMemo(() => Object.keys(registry).sort(), []);
	const [selected, setSelected] = useState(names[0] ?? '');
	const Selected = selected ? registry[selected] : null;

	return (
		<div style={{ padding: 16, fontFamily: 'sans-serif' }}>
			<select
				value={selected}
				onChange={(e) => setSelected(e.target.value)}
			>
				{names.map((n) => (
					<option
						key={n}
						value={n}
					>
						{n}
					</option>
				))}
			</select>

			<div style={{ marginTop: 24, border: '1px solid #ddd', padding: 24 }}>
				<Suspense fallback={<div>Loading…</div>}>
					{Selected ? <Selected /> : <div>No components found</div>}
				</Suspense>
			</div>
		</div>
	);
}
