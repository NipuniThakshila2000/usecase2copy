const navLinks = document.querySelectorAll("a[href^='#']");

function setupAnchorLinks() {
  navLinks.forEach((link) => {
    if (link.dataset.anchorBound === "true") {
      return;
    }

    link.dataset.anchorBound = "true";
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      window.parent.postMessage(
        {
          source: "ciq-ecc-ccc",
          type: "anchor",
          target: link.getAttribute("href").slice(1),
          top: Math.round(target.getBoundingClientRect().top + window.scrollY),
        },
        "*",
      );
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", link.getAttribute("href"));
    });
  });
}

function getDocumentHeight() {
  return Math.ceil(
    Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    ),
  );
}

function postIframeHeight() {
  if (window.parent === window) {
    return;
  }

  window.parent.postMessage(
    {
      source: "ciq-ecc-ccc",
      type: "resize",
      height: getDocumentHeight(),
    },
    "*",
  );
}

window.addEventListener("load", postIframeHeight);
window.addEventListener("resize", postIframeHeight);

if ("ResizeObserver" in window) {
  const resizeObserver = new ResizeObserver(postIframeHeight);
  resizeObserver.observe(document.body);
}

setupAnchorLinks();
postIframeHeight();
