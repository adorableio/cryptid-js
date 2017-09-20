export default function collectBrowserMetadata() {
  return {
    documentLocationUrl: window.location.href,
    documentReferer: window.document.referrer,
    documentEncoding: window.document.characterSet,
    documentTitle: window.document.title,
    documentHostname: window.location.hostname,
    documentPath: window.location.path,
    userLanguage: window.navigator.language || window.navigator.userLanguage,
    screenResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
    viewportSize: `${window.screen.width}x${window.screen.height}`,
    screenColors: window.screen.colorDepth,
  };
}
