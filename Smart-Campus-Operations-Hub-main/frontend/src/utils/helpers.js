/**
 * Utility functions for form validation
 */

export const validateResource = (formData) => {
  const errors = {};

  // Validate name
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Resource name is required';
  }

  // Validate type
  if (!formData.type) {
    errors.type = 'Resource type is required';
  }

  // Validate capacity
  if (!formData.capacity || formData.capacity <= 0) {
    errors.capacity = 'Capacity must be greater than 0';
  } else if (isNaN(formData.capacity)) {
    errors.capacity = 'Capacity must be a number';
  }

  // Validate times if provided
  if (formData.availableFrom && formData.availableTo) {
    if (formData.availableFrom >= formData.availableTo) {
      errors.availableFrom = 'Start time must be before end time';
    }
  }

  return errors;
};

/**
 * Format time string from input to HH:mm format
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  // Assuming input is already in HH:mm format
  return timeString;
};

/**
 * Get display name for enum values
 */
export const getEnumDisplay = (enumType, value) => {
  const displayNames = {
    ResourceType: {
      LAB: 'Laboratory',
      HALL: 'Hall',
      ROOM: 'Room',
      EQUIPMENT: 'Equipment',
    },
    ResourceStatus: {
      AVAILABLE: 'Available',
      UNAVAILABLE: 'Unavailable',
      MAINTENANCE: 'Under Maintenance',
    },
    AvailableDay: {
      MONDAY: 'Monday',
      TUESDAY: 'Tuesday',
      WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday',
      FRIDAY: 'Friday',
      SATURDAY: 'Saturday',
      SUNDAY: 'Sunday',
    },
  };

  return displayNames[enumType]?.[value] || value;
};

/**
 * Convert response data for display
 */
export const convertResourceForDisplay = (resource) => {
  return {
    ...resource,
    typeDisplay: getEnumDisplay('ResourceType', resource.type),
    statusDisplay: getEnumDisplay('ResourceStatus', resource.status),
  };
};

/**
 * Paginate array
 */
export const paginate = (array, page = 0, size = 10) => {
  const start = page * size;
  const end = start + size;
  return {
    content: array.slice(start, end),
    totalElements: array.length,
    totalPages: Math.ceil(array.length / size),
    currentPage: page,
    pageSize: size,
  };
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
};

/**
 * Format date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
