/**
 * A utility class for building GraphQL schemas in a structured way
 */
export class SchemaBuilder {
	private scalars: string[] = [];
	private enums: string[] = [];
	private interfaces: string[] = [];
	private types: string[] = [];
	private inputs: string[] = [];
	private unions: string[] = [];
	private directives: string[] = [];
	private schema?: string;

	/**
	 * Add scalar type definitions
	 */
	addScalar(scalarDef: string): this {
		this.scalars.push(this.cleanTypeDef(scalarDef));
		return this;
	}

	/**
	 * Add enum type definitions
	 */
	addEnum(enumDef: string): this {
		this.enums.push(this.cleanTypeDef(enumDef));
		return this;
	}

	/**
	 * Add interface type definitions
	 */
	addInterface(interfaceDef: string): this {
		this.interfaces.push(this.cleanTypeDef(interfaceDef));
		return this;
	}

	/**
	 * Add object type definitions
	 */
	addType(typeDef: string): this {
		this.types.push(this.cleanTypeDef(typeDef));
		return this;
	}

	/**
	 * Add input type definitions
	 */
	addInput(inputDef: string): this {
		this.inputs.push(this.cleanTypeDef(inputDef));
		return this;
	}

	/**
	 * Add union type definitions
	 */
	addUnion(unionDef: string): this {
		this.unions.push(this.cleanTypeDef(unionDef));
		return this;
	}

	/**
	 * Add directive definitions
	 */
	addDirective(directiveDef: string): this {
		this.directives.push(this.cleanTypeDef(directiveDef));
		return this;
	}

	/**
	 * Set the schema definition (Query, Mutation, Subscription)
	 */
	setSchema(schemaDef: string): this {
		this.schema = this.cleanTypeDef(schemaDef);
		return this;
	}

	/**
	 * Add multiple type definitions at once
	 */
	addMultiple(typeDefs: string[]): this {
		typeDefs.forEach(typeDef => {
			const cleaned = this.cleanTypeDef(typeDef);
			// Try to detect the type and add to appropriate category
			if (cleaned.includes('scalar ')) {
				this.scalars.push(cleaned);
			} else if (cleaned.includes('enum ')) {
				this.enums.push(cleaned);
			} else if (cleaned.includes('interface ')) {
				this.interfaces.push(cleaned);
			} else if (cleaned.includes('input ')) {
				this.inputs.push(cleaned);
			} else if (cleaned.includes('union ')) {
				this.unions.push(cleaned);
			} else if (cleaned.includes('directive ')) {
				this.directives.push(cleaned);
			} else if (cleaned.includes('schema ')) {
				this.schema = cleaned;
			} else {
				this.types.push(cleaned);
			}
		});
		return this;
	}

	/**
	 * Build the final schema string
	 */
	build(): string {
		const sections = [
			...this.directives,
			...this.scalars,
			...this.enums,
			...this.interfaces,
			...this.unions,
			...this.inputs,
			...this.types,
		];

		if (this.schema) {
			sections.push(this.schema);
		}

		return sections.filter(Boolean).join('\n\n');
	}

	/**
	 * Clean and normalize type definitions
	 */
	private cleanTypeDef(typeDef: string): string {
		return typeDef
			.replace(/^#graphql\s*/, '') // Remove #graphql comment
			.trim();
	}

	/**
	 * Reset the builder to start fresh
	 */
	reset(): this {
		this.scalars = [];
		this.enums = [];
		this.interfaces = [];
		this.types = [];
		this.inputs = [];
		this.unions = [];
		this.directives = [];
		this.schema = undefined;
		return this;
	}

	/**
	 * Create a new builder instance
	 */
	static create(): SchemaBuilder {
		return new SchemaBuilder();
	}
}