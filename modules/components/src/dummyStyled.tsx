import { forwardRef, createElement } from 'react';
import type { ComponentPropsWithRef, ElementType } from 'react';

type StyledOptions = {
	shouldForwardProp?: boolean | ((prop: string) => boolean);
};

function styled<Tag extends ElementType>(tag: Tag, _options?: StyledOptions) {
	// Returns a function so `styled('button', {...})` can still be called
	// as a tagged template OR a plain function — both just render `tag` with props.
	return function styledComponent(
		_strings?: TemplateStringsArray | Record<string, unknown>,
		..._interpolations: unknown[]
	) {
		const Component = forwardRef<unknown, ComponentPropsWithRef<Tag>>((props, ref) =>
			createElement(tag, { ...props, ref }),
		);
		Component.displayName = `styled(${typeof tag === 'string' ? tag : tag.displayName || tag.name || 'Component'})`;
		return Component;
	};
}

export default styled;
