import {
  INIT,
  UPDATE_CORE,
  type CoreActions,
  type Middleware,
  type UISchemaElement,
} from '@jsonforms/core';

export const MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX =
  '#/properties/middlewareDisplayOnlyDemo';

export type ApplyDisplayOnlyOptions = {
  /** When set, only controls whose scope starts with this prefix are updated. */
  scopePrefix?: string;
};

type UiElementWithChildren = UISchemaElement & {
  scope?: string;
  elements?: UISchemaElement[];
  options?: Record<string, unknown> & { detail?: UISchemaElement };
};

function shouldApplyDisplayOnly(
  scope: string | undefined,
  scopePrefix?: string
): boolean {
  if (!scopePrefix) {
    return true;
  }
  return !!scope && scope.startsWith(scopePrefix);
}

/** Recursively set `displayOnly: true` on matching Control elements in a UI schema. */
export function applyDisplayOnlyToControls(
  uischema: UISchemaElement,
  options?: ApplyDisplayOnlyOptions
): UISchemaElement {
  const clone = structuredClone(uischema) as UiElementWithChildren;
  visitUiSchemaElement(clone, options?.scopePrefix);
  return clone;
}

function visitUiSchemaElement(
  element: UiElementWithChildren,
  scopePrefix?: string
): void {
  if (element.type === 'Control') {
    if (shouldApplyDisplayOnly(element.scope, scopePrefix)) {
      element.options = { ...element.options, displayOnly: true };
    }
  }
  if (element.elements) {
    for (const child of element.elements) {
      visitUiSchemaElement(child as UiElementWithChildren, scopePrefix);
    }
  }
  if (element.options?.detail) {
    visitUiSchemaElement(element.options.detail as UiElementWithChildren, scopePrefix);
  }
}

function isInitOrUpdateCore(action: CoreActions): boolean {
  return action.type === INIT || action.type === UPDATE_CORE;
}

/**
 * Creates middleware that marks controls as display-only on INIT (and UPDATE_CORE).
 * Without `scopePrefix`, every Control is affected.
 */
export function createDisplayOnlyOnInitMiddleware(
  options?: ApplyDisplayOnlyOptions
): Middleware {
  return (state, action, defaultReducer) => {
    const newState = defaultReducer(state, action);
    if (!isInitOrUpdateCore(action) || !newState.uischema) {
      return newState;
    }
    return {
      ...newState,
      uischema: applyDisplayOnlyToControls(newState.uischema, options),
    };
  };
}

/** Middleware that display-only-ifies every control (standalone forms). */
export const displayOnlyOnInitMiddleware = createDisplayOnlyOnInitMiddleware();

/** Playground middleware: only controls under `middlewareDisplayOnlyDemo` in data. */
export const playgroundDisplayOnlyOnInitMiddleware =
  createDisplayOnlyOnInitMiddleware({
    scopePrefix: MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX,
  });
