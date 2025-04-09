export const ERROR_MESSAGES = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: (min: number) => `Must be at least ${min} characters`,
    phone: 'Please enter a valid phone number',
    password: {
      pattern: 'Password must contain at least one letter and one number',
      minLength: 'Password must be at least 6 characters'
    },
    server: {
      default: 'An error occurred. Please try again later',
      notFound: 'Resource not found',
      unauthorized: 'Unauthorized access'
    }
  };