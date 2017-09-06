export default function collectBrowserMetadata() {
  return {
    document_location_url: window.location.href,
    document_referer: window.document.referrer,
    document_encoding: document.characterSet,
    document_title: document.window.title,
    document_hostname: window.location.hostname,
    document_path: window.location.path,
    user_language: window.navigator.language || window.navigator.userLanguage,
    screen_resolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
    viewport_size: `${window.screen.width}x${window.screen.height}`,
    screen_colors: window.screen.colorDepth,
  };
};