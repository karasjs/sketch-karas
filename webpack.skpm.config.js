module.exports = function (config, entry) {
  config.node = entry.isPluginCommand ? false : {
    setImmediate: false
  };
  config.module.rules.push({
    test: /\.(html)$/,
    use: [
      {
        loader: "army8735-extract",
      },
      {
        loader: "html-loader",
        options: {
          attrs: [
            'img:src',
            'link:href'
          ],
          interpolate: true,
        },
      },
    ]
  });
  config.module.rules.push({
    test: /\.(css)$/,
    use: [
      {
        loader: "army8735-extract",
      },
      {
        loader: "css-loader",
      },
      {
        loader: "less-loader",
      }
    ]
  });
  config.module.rules.push({
    test: /\.(csx)$/,
    use: [
      {
        loader: "babel-loader",
      },
      {
        loader: "karas-loader",
      }
    ]
  });
};
