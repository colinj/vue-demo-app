let counter = 0;

export const uniqueId = (prefix = ""): string => (prefix ? `${prefix}-${counter++}` : (counter++).toString());
