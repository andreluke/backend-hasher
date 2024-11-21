module.exports = {
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '^\\./(.*)$': './$1.js', 
          },
        },
      ],
    ],
  };
  