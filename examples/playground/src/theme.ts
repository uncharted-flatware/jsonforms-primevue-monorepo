import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';

const primaryColor = palette('#f02896');

export default definePreset(Aura, {
  semantic: {
    primary: primaryColor,
  },
});
