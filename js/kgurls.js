document.addEventListener('DOMContentLoaded', () => {
  const urls = document.getElementsByClassName("kg-url");

  for (let i = 0; i < urls.length; i ++) {
    const url = urls[i];
    url.onclick = (e) => {
      copyURLToClipboard(e.target.getAttribute('data-url'));
    };
  }

  document.addEventListener('keydown', event => {
    const key = event.key;

    if (key === 'Alt') {
      const urls = document.getElementsByClassName("kg-url");

      for (let i = 0; i < urls.length; i ++) {
        const url = urls[i];
        url.className = url.className.replace('hidden', '');
      }
    }
  });

  document.addEventListener('keyup', event => {
    const key = event.key;

    if (key === 'Alt') {
      const urls = document.getElementsByClassName("kg-url");

      for (let i = 0; i < urls.length; i ++) {
        const url = urls[i];
        url.className += ' hidden';
      }
    }
  });
});

function copyURLToClipboard(url) {
  const textArea = document.createElement("textarea");
  textArea.value = url;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}