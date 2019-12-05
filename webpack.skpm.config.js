module.exports = function (config, entry) {
  config.node = entry.isPluginCommand ? false : {
    setImmediate: false
  };
  config.module.rules.push({
    test: /\.(html)$/,
    use: [{
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
    use: [{
        loader: "army8735-extract",
      },
      {
        loader: "css-loader",
      },
    ]
  });
  config.module.rules.push({
    test: /\.(less)$/,
    use: [{
      loader: "army8735-extract",
    },
      {
        loader: "less-loader",
      },
    ]
  });
};
