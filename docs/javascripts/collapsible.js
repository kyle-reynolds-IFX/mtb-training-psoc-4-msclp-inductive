// Example heading interaction for MkDocs Material
document.addEventListener('DOMContentLoaded', function() {
  const isFilePreview = window.location.protocol === 'file:';
  if (isFilePreview) {
    document.documentElement.classList.add('file-preview-no-search');
  }

  // Handle code block copy to clipboard for offline/file protocol
  document.addEventListener('click', function(e) {
    const button = e.target.closest('.md-clipboard');
    if (!button) return;

    if (!navigator.clipboard) {
      let text = button.getAttribute('data-clipboard-text');
      if (!text) {
        // Fallback to searching the surrounding code block
        const container = button.closest('.highlight') || button.closest('pre') || button.closest('.md-code') || button.parentNode;
        if (container) {
          const codeEl = container.querySelector('td.code pre code') || 
                         container.querySelector('td.code code') || 
                         container.querySelector('.code code') || 
                         container.querySelector('pre code') || 
                         container.querySelector('code');
          if (codeEl) {
            text = codeEl.textContent;
          }
        }
      }

      if (text) {
        // Create temporary textarea
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (successful) {
            const originalTitle = button.getAttribute('title') || 'Copy to clipboard';
            const originalLabel = button.getAttribute('aria-label') || 'Copy to clipboard';
            
            button.setAttribute('title', 'Copied to clipboard');
            button.setAttribute('aria-label', 'Copied to clipboard');
            button.classList.add('md-clipboard--copied');
            
            setTimeout(() => {
              button.setAttribute('title', originalTitle);
              button.setAttribute('aria-label', originalLabel);
              button.classList.remove('md-clipboard--copied');
            }, 2000);
          }
        } catch (err) {
          console.error('Offline copy to clipboard failed:', err);
        }

        document.body.removeChild(textArea);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }, true);
});