import commonjs from '@rollup/plugin-commonjs'
import rollupJson from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: './src/main.js',
  output: {
    file: './dist/bin/main.js'
  },
  external: ['adm-zip', 'axios', 'clear', 'commander', 'figlet', 'fs-extra', 'inquirer', 'kleur', 'ora'],
  plugins: [resolve(), commonjs(), rollupJson()]
}
