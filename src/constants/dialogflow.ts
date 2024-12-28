export const INTENT_NAMES = {
    SCHEDULE_MEETING: 'SchedulingaMeetingorCoffee.SchedulingaMeetingorCoffee-custom.Follow-upIntent-PlatformSelected-custom.ContactInfo-custom'
  } as const;
  
  export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };