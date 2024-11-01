let scrollLeft = 0;

window.onload = function () {
  const contentEl = document.getElementById("content");
  const contentWidth = contentEl.getBoundingClientRect().width;

  document.addEventListener(
    "message",
    function (event) {
      // console.log("Received message from React Native:", event.data);
      // You can also respond back using window.ReactNativeWebView.postMessage(...)

      // scrollLeft = scrollLeft + contentWidth;
      // content.scrollLeft(scrollLeft)
      window.ReactNativeWebView.postMessage("pan ${event}");
    },
    false
  );
};
