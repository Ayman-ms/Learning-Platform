export const APP_CONSTANTS = {
    PAGINATION: {
      ITEMS_PER_PAGE: 9,
      MAX_PAGES_SHOWN: 5
    },
    IMAGE: {
      MAX_DIMENSIONS: {
        width: 800,
        height: 800
      },
      COMPRESSION_QUALITY: 0.7,
      DEFAULT_PROFILE: 'assets/default-profile.png',
      DEFAULT_COURSE:'assets/default-profile.png'
    },
    API:{
      BASE_URL:'http://localhost:5270/api'
    },
    API_ENDPOINTS: {
      TEACHERS: 'http://localhost:5270/api/Teacher',
      UPLOAD: '/api/upload'
    },
    VALIDATION: {
      PHONE: {
        MIN_LENGTH: 10,
        MAX_LENGTH: 15
      },
      PASSWORD: {
        MIN_LENGTH: 6
      }
    }
  };