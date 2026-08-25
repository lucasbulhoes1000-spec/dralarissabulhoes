const params = new URLSearchParams(window.location.search);

const trackingData = {
  utm_source: params.get("utm_source") || "",
  utm_medium: params.get("utm_medium") || "",
  utm_campaign: params.get("utm_campaign") || "",
  utm_content: params.get("utm_content") || "",
  utm_term: params.get("utm_term") || "",
  fbclid: params.get("fbclid") || "",
  gclid: params.get("gclid") || ""
};

const hasTrackingData = Object.values(trackingData).some(value => value);

if (hasTrackingData) {
  localStorage.setItem(
    "larissa_tracking",
    JSON.stringify({
      ...trackingData,
      landing_page: window.location.href,
      first_visit: new Date().toISOString()
    })
  );
}

window.dataLayer = window.dataLayer || [];

function trackEvent(eventName, destination) {
  let storedTracking = {};

  try {
    storedTracking = JSON.parse(
      localStorage.getItem("larissa_tracking")
    ) || {};
  } catch {
    storedTracking = {};
  }

  const eventData = {
    event: eventName,
    page_type: "link_bio_larissa",
    destination: destination,
    timestamp: new Date().toISOString(),
    ...storedTracking
  };

  window.dataLayer.push(eventData);

  console.log("Evento registrado:", eventData);
}

trackEvent(
  "page_view_larissa",
  "landing_page"
);

document.addEventListener("DOMContentLoaded", function () {

  const instituto = document.querySelector(".card-instituto");

  const avaliacao = document.querySelector(".card-avaliacao");

  const site = document.querySelector(".card-site");


  if (instituto) {
    instituto.addEventListener("click", function () {

      trackEvent(
        "click_instituto",
        "whatsapp_instituto"
      );

    });
  }


  if (avaliacao) {
    avaliacao.addEventListener("click", function () {

      trackEvent(
        "click_avaliacao",
        "whatsapp_bulhoes"
      );

    });
  }


  if (site) {
    site.addEventListener("click", function () {

      trackEvent(
        "click_site",
        "site_bulhoes"
      );

    });
  }

});
