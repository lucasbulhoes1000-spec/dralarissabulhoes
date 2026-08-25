(function () {

  /*
  =====================================================
  CONFIGURAÇÕES
  =====================================================
  */

  const WHATSAPP_INSTITUTO =
    "551340427082";

  const WHATSAPP_CLINICA =
    "5513996300176";

  const STORAGE_NAME =
    "larissa_attribution";


  /*
  =====================================================
  LER UTMS
  =====================================================
  */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const incomingData = {

    utm_source:
      params.get("utm_source") || "",

    utm_medium:
      params.get("utm_medium") || "",

    utm_campaign:
      params.get("utm_campaign") || "",

    utm_content:
      params.get("utm_content") || "",

    utm_term:
      params.get("utm_term") || "",

    fbclid:
      params.get("fbclid") || "",

    gclid:
      params.get("gclid") || ""

  };


  /*
  =====================================================
  SALVAR ATRIBUIÇÃO
  =====================================================
  */

  const hasIncomingData =
    Object.values(
      incomingData
    ).some(Boolean);


  if (hasIncomingData) {

    const savedData = {

      ...incomingData,

      landing_page:
        window.location.href,

      first_seen:
        new Date().toISOString()

    };


    localStorage.setItem(
      STORAGE_NAME,
      JSON.stringify(savedData)
    );

  }


  /*
  =====================================================
  RECUPERAR ATRIBUIÇÃO
  =====================================================
  */

  function getAttribution() {

    try {

      const saved =
        localStorage.getItem(
          STORAGE_NAME
        );


      if (!saved) {

        return {

          utm_source: "direct",
          utm_medium: "",
          utm_campaign: "",
          utm_content: "",
          utm_term: "",
          fbclid: "",
          gclid: ""

        };

      }


      return JSON.parse(saved);

    }

    catch (error) {

      return {};

    }

  }


  /*
  =====================================================
  ENVIAR EVENTO AO GA4
  =====================================================
  */

  function trackGA4(
    eventName,
    destination
  ) {

    const attribution =
      getAttribution();


    if (
      typeof window.gtag !==
      "function"
    ) {

      return;

    }


    window.gtag(
      "event",
      eventName,
      {

        destination:
          destination,

        utm_source:
          attribution.utm_source || "",

        utm_medium:
          attribution.utm_medium || "",

        utm_campaign:
          attribution.utm_campaign || "",

        utm_content:
          attribution.utm_content || "",

        utm_term:
          attribution.utm_term || "",

        page_location:
          window.location.href

      }
    );

  }


  /*
  =====================================================
  LINKS
  =====================================================
  */

  const instituto =
    document.getElementById(
      "link-instituto"
    );


  const avaliacao =
    document.getElementById(
      "link-avaliacao"
    );


  const site =
    document.getElementById(
      "link-site"
    );


  /*
  =====================================================
  WHATSAPP INSTITUTO
  =====================================================
  */

  if (instituto) {

    const message =

      "Olá! Vim pelo Instagram da Dra. Larissa e gostaria de conhecer os cursos do Instituto Bulhões.";


    instituto.href =

      `https://wa.me/${WHATSAPP_INSTITUTO}` +

      `?text=${encodeURIComponent(message)}`;


    instituto.addEventListener(
      "click",
      function () {

        trackGA4(
          "click_instituto",
          "whatsapp_instituto"
        );

      }
    );

  }


  /*
  =====================================================
  WHATSAPP CLÍNICA
  =====================================================
  */

  if (avaliacao) {

    const message =

      "Olá! Vim pelo Instagram da Dra. Larissa e gostaria de agendar uma avaliação na Bulhões Odontologia.";


    avaliacao.href =

      `https://wa.me/${WHATSAPP_CLINICA}` +

      `?text=${encodeURIComponent(message)}`;


    avaliacao.addEventListener(
      "click",
      function () {

        trackGA4(
          "click_avaliacao",
          "whatsapp_clinica"
        );

      }
    );

  }


  /*
  =====================================================
  SITE
  =====================================================
  */

  if (site) {

    site.addEventListener(
      "click",
      function () {

        trackGA4(
          "click_site",
          "site_bulhoes"
        );

      }
    );

  }


  /*
  =====================================================
  PAGE VIEW PERSONALIZADO
  =====================================================
  */

  trackGA4(
    "lp_larissa_view",
    "landing_page"
  );

})();
