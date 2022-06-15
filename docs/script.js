(() => {
  const inputs = Array.from(document.querySelectorAll(".input-group select, .input-group input"));
  const loader = document.querySelector("#preview .loader");
  const previewImage = document.querySelector("#preview img");
  const previewLink = document.querySelector("#preview a");
  const markdownBlock = document.querySelector("#preview .markdown pre");

  function getBadgeURL(dataType, params) {
    const baseRunkit = "https://dynamic-badge-formatter-ynrxn78r2oye.runkit.sh/";
    const baseShieldsEndpoint = "https://img.shields.io/endpoint";
    const runkitURL = `${baseRunkit}/${dataType}?${Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&")}`;
    return `${baseShieldsEndpoint}?url=${encodeURIComponent(runkitURL)}`;
  }

  function toggleLoader(show) {
    loader.style.display = show ? "block" : "none";
    previewImage.style.display = show ? "none" : "block";
  }

  function updatePreview() {
    const params = inputs.reduce((acc, el) => {
      const obj = { ...acc };
      if (el.value !== "") {
        obj[el.id] = el.value;
      }
      return obj;
    }, {});

    if (!params.dataType || !params.query || !params.url) {
      previewImage.src =
        "https://img.shields.io/badge/preview-fill%20in%20a%20data%20url%20and%20query%20to%20see%20a%20preview-blue.svg";
      return;
    }

    const { dataType, href, ...rest } = params;
    const shieldsEndpoint = getBadgeURL(dataType, rest);

    toggleLoader(true);

    previewLink.removeAttribute("href");
    let markdown = `![badge](${shieldsEndpoint})`;
    if (href) {
      previewLink.href = href;
      markdown = `[${markdown}](${href})`;
    }
    markdownBlock.innerText = markdown;

    previewImage.src = shieldsEndpoint;
  }

  inputs.forEach((el) => {
    el.addEventListener("change", updatePreview);
  });

  previewImage.addEventListener("load", () => {
    toggleLoader(false);
  });
})();
