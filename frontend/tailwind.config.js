module.exports = {
    theme: {
      extend: {
        keyframes: {
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          fadeIn: {
            from: {
              opacity: '0',
              transform: 'translateY(10px)',
            },
            to: {
              opacity: '1',
              transform: 'translateY(0)',
            },
          },
        },
        animation: {
          shimmer: 'shimmer 1.5s ease-in-out infinite',
          'fade-in': 'fadeIn 0.4s ease-out',
        },
        backgroundSize: {
          '200': '200% 100%',
        },
      },
    },
  };