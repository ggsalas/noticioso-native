const styles = `

  * {
    font-family: var(--fontFamilySerif);
    font-weight: normal;
  }

  html,
  body {
    font-size: var(--fontSizeMain);
    font-family: var(--fontFamilySerif);
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    user-select: none;
    align-items: center;
    margin: 0;
    padding: 0;
    background-color: var(--colorBackground);
    color: var(--colorText);
  }

  #viewport {
    column-width: var(--articleColumnWidth);
    column-gap: 0;
    height: 100%;
    overflow-x: hidden;
    background-color: var(--colorBackground);
    color: var(--colorText);
  }

  p,
  ul,
  ol {
    font-size: 1rem;
    text-align: justify;
    text-align-last: left;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  a { 
    color: var(--colorText);
  }

  img, 
  iframe {
    max-width: 100%;
    height: auto;
  }

  figcaption {
    font-style: italic;
    color: green;
  }

  ._title_ {
    font-size: 1.6rem;
    line-height: 1em;
    margin: 0 0 1em 0;
  }

  ._author_ {
    font-size: .8rem;
    line-height: 1em;
    font-style: italic;
    font-weight: bold;
    margin: 0 0 1em 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.2rem;
    line-height: 1em;
    margin: 0 0 1em 0;
  }

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.4rem;
  }

  h3 {
    font-size: 1.3rem;
  }

  code,
  code p,
  pre p,
  pre {
    font-size: 0.7rem;
    font-family: var(--fontFamilyMono), SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    white-space: pre-wrap;
    padding: 0.5rem;
  }

  p code,
  li code {
    padding: 0;
  }
`;

const script = `
  let scrollLeft = 0;

  window.onload = function () {
    const viewportEl = document.getElementById("viewport");
    const articleEl = document.getElementById("article");
    const viewportWidth = viewportEl.getBoundingClientRect().width;
    const articleWidth = articleEl.getBoundingClientRect().width;

    window.ReactNativeWebView.postMessage(JSON.stringify({
      viewportWidth,
      articleWidth,
      scrollLeft,
      eventName: event.data,
    }))

    document.addEventListener("message", function(event) {
      // Handle scrollLeft
      if (event.data === 'SWIPE_NEXT') { 
        if (!(articleWidth <= scrollLeft + viewportWidth)) {
          scrollLeft = scrollLeft + viewportWidth;
        }
      } else {
        if (scrollLeft != 0) {
          scrollLeft = scrollLeft - viewportWidth;
        }
      }
      viewportEl.scrollLeft = scrollLeft

      window.ReactNativeWebView.postMessage(JSON.stringify({
        viewportWidth,
        articleWidth,
        scrollLeft,
        eventName: event.data,
      }))
    }, false);
  };
`;

export function getHorizontalNavigationPage({ content, width, theme }) {
  return `
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,500;0,700;1,400;1,700&family=JetBrains+Mono:ital,wght@0,500;0,700;1,500;1,700&display=swap");

      :root {
        --fontFamilySerif: "Alegreya", "Georgia", "Times", "Times New Roman", serif;
        --fontFamilySans: sans-serif;
        --fontFamilyMono: "JetBrains Mono", monospace;

        --fontSizeSmall: max(0.6rem, 10px);
        --fontSizeMain: calc(${theme.fonts.baseFontSize}px * 1.1);

        --articleColumnWidth: ${width}px;

        --colorText: ${theme.colors.text};
        --colorBackground: transparent;
        --colorTint: ${theme.colors.tint};
        --colorIcon: ${theme.colors.icon};
        --colorBorderDark: ${theme.colors.borderDark};
        --colorBackgroundDark: ${theme.colors.backgroundDark};
        --colorBackgroundDark_text: ${theme.colors.backgroundDark_text};
      } 

      ${styles}
    </style>

    <script>
      ${script}
    </script>

    <main id="viewport" lang="es">
      <div id="article">
        ${content}
      </div>
    </main>
  `;
}
