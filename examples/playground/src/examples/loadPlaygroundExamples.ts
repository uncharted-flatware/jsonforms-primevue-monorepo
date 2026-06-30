export type PlaygroundExampleMeta = {
  label: string;
  order: number;
};

export type PlaygroundExample = {
  id: string;
  meta: PlaygroundExampleMeta;
  dataSchema: Record<string, unknown>;
  uiSchema: Record<string, unknown>;
  data: Record<string, unknown>;
};

const metaModules = import.meta.glob<PlaygroundExampleMeta>('./*/meta.json', {
  eager: true,
  import: 'default',
});

const dataSchemaModules = import.meta.glob<Record<string, unknown>>(
  './*/dataSchema.json',
  { eager: true, import: 'default' }
);

const uiSchemaModules = import.meta.glob<Record<string, unknown>>(
  './*/uiSchema.json',
  { eager: true, import: 'default' }
);

const dataModules = import.meta.glob<Record<string, unknown>>('./*/data.json', {
  eager: true,
  import: 'default',
});

function slugFromGlobKey(key: string): string {
  const match = key.match(/^\.\/([^/]+)\//);
  if (!match) {
    throw new Error(`Invalid example glob key: ${key}`);
  }
  return match[1];
}

function collectBySlug<T>(
  modules: Record<string, T>,
  suffix: string
): Map<string, T> {
  const map = new Map<string, T>();
  for (const [key, value] of Object.entries(modules)) {
    if (!key.endsWith(suffix)) {
      continue;
    }
    map.set(slugFromGlobKey(key), value);
  }
  return map;
}

export function loadPlaygroundExamples(): PlaygroundExample[] {
  const metas = collectBySlug(metaModules, '/meta.json');
  const schemas = collectBySlug(dataSchemaModules, '/dataSchema.json');
  const uiSchemas = collectBySlug(uiSchemaModules, '/uiSchema.json');
  const dataSets = collectBySlug(dataModules, '/data.json');

  const ids = [...metas.keys()].sort();
  const examples: PlaygroundExample[] = [];

  for (const id of ids) {
    const meta = metas.get(id);
    const dataSchema = schemas.get(id);
    const uiSchema = uiSchemas.get(id);
    const data = dataSets.get(id);

    if (!meta || !dataSchema || !uiSchema || data === undefined) {
      throw new Error(
        `Example "${id}" is missing required files (meta, dataSchema, uiSchema, data)`
      );
    }

    examples.push({ id, meta, dataSchema, uiSchema, data });
  }

  examples.sort((a, b) => {
    if (a.meta.order !== b.meta.order) {
      return a.meta.order - b.meta.order;
    }
    return a.meta.label.localeCompare(b.meta.label);
  });

  return examples;
}

export const playgroundExamples = loadPlaygroundExamples();
