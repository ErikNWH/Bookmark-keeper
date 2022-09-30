const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEL = document.getElementById('website-name');
const websiteUrlEL = document.getElementById('website-url');
const bookmarkContainer = document.getElementById('bookmark-container');

let bookmarks = [];

// Show modal, Focus on Input
function showModal() {
  modal.classList.add('show-modal');
  websiteNameEL.focus();
}

// Modal Event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, urlValue) {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  }
  if (!urlValue.match(regex)) {
    alert('Please provide a valid web Address');
    return false;
  }
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Build items
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid', 'fa-trash-can');
    closeIcon.setAttribute('title', 'Delete Bookmark');
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
    // Favicon / link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');
    const favicon = document.createElement('img');
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    favicon.setAttribute('alt', 'Favicon');
    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target', '_black');
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarkContainer.appendChild(item);
  });
}

// Fetch Bookmarks
function fetchBookmarks() {
  // Get bookmarks from localstorage if available
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    // Create Bookmarks array in LocalStorage
    bookmarks = [
      {
        name: 'stackoverflow',
        url: 'stackoverflow.com',
      },
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEL.value;
  let urlValue = websiteUrlEL.value;
  if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEL.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On load, Fetch Bookmarks
fetchBookmarks();
