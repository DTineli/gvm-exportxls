function openTab(event, tab) {
  const tabContent = document.getElementsByClassName("tabcontent")
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }

  const tabButton = document.getElementsByClassName("tabButton");
  for (i = 0; i < tabButton.length; i++) {
    tabButton[i].className = tabButton[i].className.replace(" active", "");
  }

  document.getElementById(tab).style.display = "block";
  event.currentTarget.className += " active";
}
