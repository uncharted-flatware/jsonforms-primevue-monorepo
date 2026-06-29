import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { INIT, Actions, coreReducer } from '@jsonforms/core';
import {
  applyDisplayOnlyToControls,
  createDisplayOnlyOnInitMiddleware,
  displayOnlyOnInitMiddleware,
  MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX,
} from './displayOnlyOnInitMiddleware';

describe('displayOnlyOnInitMiddleware', () => {
  it('sets displayOnly on every Control in the UI schema', () => {
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/a' },
        {
          type: 'Group',
          elements: [
            { type: 'Control', scope: '#/properties/b', options: { prefix: '$' } },
          ],
        },
      ],
    };

    const result = applyDisplayOnlyToControls(uischema as any);
    const controls = [
      (result as any).elements[0],
      (result as any).elements[1].elements[0],
    ];

    for (const control of controls) {
      expect(control.options.displayOnly).toBe(true);
    }
    expect(controls[1].options.prefix).toBe('$');
  });

  it('accepts Vue reactive UI schema (UPDATE_CORE path in playground)', () => {
    const uischema = reactive({
      type: 'Control',
      scope: '#/properties/a',
    });

    expect(() => applyDisplayOnlyToControls(uischema as any)).not.toThrow();
    const result = applyDisplayOnlyToControls(uischema as any);
    expect((result as any).options.displayOnly).toBe(true);
  });

  it('sets displayOnly only for controls under a scope prefix', () => {
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/other/properties/x' },
        {
          type: 'Control',
          scope: `${MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX}/properties/title`,
        },
      ],
    };

    const result = applyDisplayOnlyToControls(uischema as any, {
      scopePrefix: MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX,
    });

    expect((result as any).elements[0].options?.displayOnly).toBeUndefined();
    expect((result as any).elements[1].options.displayOnly).toBe(true);
  });

  it('applies displayOnly on INIT via middleware', () => {
    const schema = { type: 'object', properties: { a: { type: 'string' } } };
    const uischema = { type: 'Control', scope: '#/properties/a' };
    const data = { a: 'hello' };

    const action = Actions.init(data, schema, uischema);
    const next = displayOnlyOnInitMiddleware(
      { data: {}, schema: {}, errors: [], additionalErrors: [] } as any,
      action,
      coreReducer
    );

    expect(action.type).toBe(INIT);
    expect((next.uischema as any).options.displayOnly).toBe(true);
  });

  it('applies scoped displayOnly via factory middleware', () => {
    const schema = {
      type: 'object',
      properties: {
        middlewareDisplayOnlyDemo: {
          type: 'object',
          properties: { title: { type: 'string' } },
        },
        other: { type: 'string' },
      },
    };
    const uischema = {
      type: 'VerticalLayout',
      elements: [
        { type: 'Control', scope: '#/properties/other' },
        {
          type: 'Control',
          scope: '#/properties/middlewareDisplayOnlyDemo/properties/title',
        },
      ],
    };
    const middleware = createDisplayOnlyOnInitMiddleware({
      scopePrefix: MIDDLEWARE_DISPLAY_ONLY_DEMO_SCOPE_PREFIX,
    });
    const action = Actions.init({}, schema, uischema);
    const next = middleware(
      { data: {}, schema: {}, errors: [], additionalErrors: [] } as any,
      action,
      coreReducer
    );

    const elements = (next.uischema as any).elements;
    expect(elements[0].options?.displayOnly).toBeUndefined();
    expect(elements[1].options.displayOnly).toBe(true);
  });
});
