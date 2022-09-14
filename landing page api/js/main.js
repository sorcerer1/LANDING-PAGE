const getShortenedLink = () => {
  document
    .querySelector(".shortener__container")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const url = document.querySelector(".shortener__input").value;

      if (url === "") {
        toggleErrors("You must add a link to shorten");
        return;
      }

      setButtonAndInputText();

      const response = await fetch(
        `https://api.shrtco.de/v2/shorten?url=${url}`
      );

      const data = await response.json();

      if (!data.ok) {
        toggleErrors("Oops! The link you provided is invalid");
        setButtonAndInputText(false);
        return;
      }

      setButtonAndInputText(false);

      createLinksContainers(data);
    });
};

const showStoredLinks = () => {
  if (!localStorage.getItem("links")) return;

  const links = JSON.parse(localStorage.getItem("links"));

  const container = document.querySelector(".shortener__links-container");

  links.forEach((link) => {
    const div = makeHtml("div", undefined, ["shortener__links"]);

    const oldLink = makeHtml("p", undefined, ["shortener__old-link"]);
    oldLink.textContent = link.old;
    div.appendChild(oldLink);

    const flexDiv = makeHtml("div", undefined, ["shortener__flex"]);

    const newLink = makeHtml("p", undefined, ["shortener__new-link"]);
    newLink.textContent = link.new;
    flexDiv.appendChild(newLink);

    const button = makeHtml(
      "button",
      undefined,
      ["shortener__btn-copy", link.copied && "link-copied"],
      {
        type: "button",
        "data-copied-link": link.new,
      }
    );
    button.textContent = link.copied ? "Copied!" : "Copy";
    flexDiv.appendChild(button);
    div.appendChild(flexDiv);

    container.appendChild(div);
  });

  copyLinkToClipboard();
};

const copyLinkToClipboard = () => {
  document.querySelectorAll(".shortener__btn-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const linkToCopy = btn.getAttribute("data-copied-link");

      const links = JSON.parse(localStorage.getItem("links"));

      if (links.find((link) => link.new === linkToCopy).copied) return;

      await navigator.clipboard.writeText(linkToCopy);

      const linkIndex = links.findIndex((link) => link.new === linkToCopy);

      const copiedLink = links.find((link) => link.new === linkToCopy);

      copiedLink.copied = true;

      links.splice(linkIndex, 1, copiedLink);

      localStorage.setItem("links", JSON.stringify(links));

      btn.classList.toggle("link-copied");
      btn.textContent = "Copied!";
    });
  });
};

const toggleErrors = (errorText = "") => {
  document.querySelector(".shortener__input").classList.toggle("empty-link");
  document.querySelector(".error-msg").classList.toggle("d-none");
  document.querySelector(".error-msg").textContent = errorText;
  setTimeout(() => {
    document.querySelector(".shortener__input").classList.toggle("empty-link");
    document.querySelector(".error-msg").classList.toggle("d-none");
    document.querySelector(".error-msg").textContent = errorText;
  }, 3000);
};

const setButtonAndInputText = (isLoading = true) => {
  if (isLoading) {
    document.querySelector(".shortener__btn-shorten").textContent =
      "Loading...";
    document
      .querySelector(".shortener__btn-shorten")
      .setAttribute("disabled", "");
  } else {
    document.querySelector(".shortener__btn-shorten").textContent =
      "Shorten Link";
    document
      .querySelector(".shortener__btn-shorten")
      .removeAttribute("disabled");
    document.querySelector(".shortener__input").value = "";
  }
};

const createLinksContainers = (data) => {
  const { original_link, full_short_link3 } = data.result;

  const container = document.querySelector(".shortener__links-container");

  const div = makeHtml("div", undefined, ["shortener__links"]);

  const oldLink = makeHtml("p", undefined, ["shortener__old-link"]);
  oldLink.textContent = original_link;
  div.appendChild(oldLink);

  const flexDiv = makeHtml("div", undefined, ["shortener__flex"]);

  const newLink = makeHtml("p", undefined, ["shortener__new-link"]);
  newLink.textContent = full_short_link3;
  flexDiv.appendChild(newLink);

  const button = makeHtml("button", undefined, ["shortener__btn-copy"], {
    type: "button",
    "data-copied-link": full_short_link3,
  });
  button.setAttribute("type", "button");
  button.textContent = "Copy";
  flexDiv.appendChild(button);
  div.appendChild(flexDiv);

  container.appendChild(div);

  setLocalStorage(original_link, full_short_link3);

  copyLinkToClipboard();
};

const setLocalStorage = (oldLink, newLink) => {
  const link = {
    old: oldLink,
    new: newLink,
    copied: false,
  };

  if (!localStorage.getItem("links")) {
    localStorage.setItem("links", JSON.stringify([link]));
  } else {
    const links = JSON.parse(localStorage.getItem("links"));
    links.push(link);
    localStorage.setItem("links", JSON.stringify(links));
  }
};

const makeHtml = (
  element = "",
  elementID = "",
  elementClassNames = [],
  elementAttribs = {}
) => {
  const el = document.createElement(element);

  if (elementID !== "") {
    el.id = elementID;
  }

  if (elementClassNames.length > 0) {
    elementClassNames.forEach((className) => {
      el.classList.add(className);
    });
  }

  if (Object.keys(elementAttribs).length > 0) {
    Object.keys(elementAttribs).forEach((key, i) => {
      el.setAttribute(key, Object.values(elementAttribs)[i]);
    });
  }

  return el;
};

const init = () => {
  getShortenedLink();
  showStoredLinks();
};

init();

function nav_open() {
  document.getElementById("mySidebar").style.display = "block";
}

function nav_close() {
  document.getElementById("mySidebar").style.display = "none";
}