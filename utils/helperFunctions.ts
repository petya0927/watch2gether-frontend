export const isValidUrl = (url: string) => {
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://');

  if (!hasProtocol) {
    url = window.location.protocol + url;
  }

  try {
    new URL(url);
  } catch (error) {
    return false;
  }

  if (!url.includes('localhost')) {
    const domainExtensionRegex = /\.[a-z]{2,}/i;
    return domainExtensionRegex.test(url);
  } else {
    return true;
  }
};
