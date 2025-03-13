chrome.commands.onCommand.addListener((command) => {
  if (command === "reload-css") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: reloadCSS
        });
      }
    });
  }
});

function reloadCSS() {
  // This function will be injected into the page
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    const href = link.href;
    link.href = href.includes('?') 
      ? href.split('?')[0] + '?reload=' + new Date().getTime() 
      : href + '?reload=' + new Date().getTime();
  });
  
  // Also reload inline styles
  const styles = document.querySelectorAll('style');
  styles.forEach(style => {
    const parent = style.parentNode;
    const clone = style.cloneNode(true);
    parent.replaceChild(clone, style);
  });
  
  console.log('CSS reloaded at ' + new Date().toLocaleTimeString());
} 