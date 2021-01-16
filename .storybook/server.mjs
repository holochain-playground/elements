import { storybookPlugin } from '@web/dev-server-storybook';
import plugins from '../web-dev-plugins.mjs';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  port: 8080,
  watch: true,
  open: '/',
  nodeResolve: true,
  plugins: [...plugins, storybookPlugin({ type: 'web-components' })],
});
