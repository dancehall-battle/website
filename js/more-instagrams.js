document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.getElementsByClassName("more-instagrams");

  for (let i = 0; i < buttons.length; i ++) {
    const button = buttons[i];
    button.onclick = (e) => {
      const igs = JSON.parse(e.target.getAttribute('data-instagrams'));
      console.log(igs);
      const list = document.getElementsByClassName("modal-list")[0];
      list.innerHTML = '';

      igs.forEach(ig => {
        list.innerHTML += `<p><a href="https://instagram.com/${ig}">@${ig}</a></p>`;
      });

      modal.style.display = "block";
    };
  }

  // Get the modal
  var modal = document.getElementById("myModal");

  if (modal) {
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }
  }
});