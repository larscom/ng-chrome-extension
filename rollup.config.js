import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

export default {
  input: './src/main.ts',
  output: {
    file: './dist/bin/main.js'
  },
  external: ['adm-zip', 'axios', 'clear', 'commander', 'figlet', 'fs-extra', 'inquirer', 'kleur', 'ora'],
  plugins: [typescript(), resolve(), commonjs(), json()]
}
