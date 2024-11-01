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

  #content {
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
`;

const script = `
  let scrollLeft = 0;

  window.onload = function () {
    const contentEl = document.getElementById("content");
    const contentWidth = contentEl.getBoundingClientRect().width;
    // contentEl.onclick = () => (contentEl.scrollLeft += contentWidth);

    document.addEventListener("message", function(event) {
       if (event.data === 'SWIPE_NEXT') { 
          scrollLeft = scrollLeft + contentWidth;
        } else {
          scrollLeft = scrollLeft - contentWidth;
        }

        contentEl.scrollLeft = scrollLeft
        window.ReactNativeWebView.postMessage(event.data + ' - ' + scrollLeft.toString())
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

    <main id="content" lang="es">
      ${content}
    </main>
  `;
}
