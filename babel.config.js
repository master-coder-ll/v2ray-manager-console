module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
