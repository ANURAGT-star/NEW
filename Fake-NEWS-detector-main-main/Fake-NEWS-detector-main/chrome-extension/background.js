chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fact-check-selection",
    title: "Fact-check with Fake News Detector",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "fact-check-selection" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    const url = `https://your-fake-news-detector-app-url.com/?q=${query}`;
    chrome.tabs.create({ url });
  }
}); 