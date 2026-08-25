(function () {

  /* =====================================================
     CONFIGURAÇÕES
  ===================================================== */

  const WHATSAPP_INSTITUTO = "551340427082";
  const WHATSAPP_CLINICA = "5513996300176";

  const CLICK_ENDPOINT =
    "https://script.google.com/macros/s/AKfycbx-2IhvdBZH2JfLGU-mSVIyub2KHbOrGukal-diPqxm0wa7YF2Uljk4HytL4wDNISf-/exec";


  /* =====================================================
     RECUPERAR DADOS DE ATRIBUIÇÃO
  ===================================================== */

  function getTrackingData() {

    if (
      typeof window.getLeadTrackingData === "function"
    ) {

      return window.getLeadTrackingData();

    }


    return {

      utm_source: "direct",
      utm_medium: "none",
      utm_campaign: "none",
      utm_content: "none",
      utm_term: "none",

      fbclid: "",
      gclid: "",

      landing_page:
        window.location.href,

      first_referrer:
        document.referrer || "direct"

    };

  }


  /* =====================================================
     GERAR ID ÚNICO DO CLIQUE
  ===================================================== */

  function generateClickId() {

    const timestamp =
      Date.now()
        .toString(36)
        .toUpperCase();


    const random =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();


    return `LARI-${timestamp}-${random}`;

  }


  /* =====================================================
     GA4
  ===================================================== */

  function sendGA4Event(
    eventName,
    destination,
    clickId
  ) {

    const tracking =
      getTrackingData();


    if (
      typeof window.gtag !== "function"
    ) {

      return;

    }


    window.gtag(
      "event",
      eventName,
      {

        destination:
          destination,

        click_id:
          clickId,

        utm_source:
          tracking.utm_source || "",

        utm_medium:
          tracking.utm_medium || "",

        utm_campaign:
          tracking.utm_campaign || "",

        utm_content:
          tracking.utm_content || "",

        utm_term:
          tracking.utm_term || "",

        landing_page:
          tracking.landing_page || "",

        first_referrer:
          tracking.first_referrer || "",

        page_location:
          window.location.href

      }
    );

  }


  /* =====================================================
     CRIAR REGISTRO DO CLIQUE
  ===================================================== */

  function createClickRecord(
    destination
  ) {

    const tracking =
      getTrackingData();


    return {

      click_id:
        generateClickId(),

      data_hora:
        new Date().toISOString(),

      destino:
        destination,

      origem_link:
        "lp_principal_larissa",

      utm_source:
        tracking.utm_source || "",

      utm_medium:
        tracking.utm_medium || "",

      utm_campaign:
        tracking.utm_campaign || "",

      utm_content:
        tracking.utm_content || "",

      utm_term:
        tracking.utm_term || "",

      fbclid:
        tracking.fbclid || "",

      gclid:
        tracking.gclid || "",

      pagina:
        window.location.href,

      landing_page:
        tracking.landing_page || "",

      first_referrer:
        tracking.first_referrer || ""

    };

  }


  /* =====================================================
     SALVAR LOCALMENTE
  ===================================================== */

  function saveLocally(record) {

    try {

      localStorage.setItem(
        "last_lead_click",
        JSON.stringify(record)
      );

    }

    catch (error) {

      console.log(
        "Não foi possível salvar localmente."
      );

    }

  }


  /* =====================================================
     ENVIAR PARA GOOGLE SHEETS
  ===================================================== */

  function sendToExternalEndpoint(
    record
  ) {

    const payload =
      JSON.stringify(record);


    try {

      if (
        navigator.sendBeacon
      ) {

        const blob =
          new Blob(
            [payload],
            {
              type:
                "text/plain;charset=UTF-8"
            }
          );


        navigator.sendBeacon(
          CLICK_ENDPOINT,
          blob
        );


        return;

      }


      fetch(
        CLICK_ENDPOINT,
        {

          method:
            "POST",

          mode:
            "no-cors",

          keepalive:
            true,

          headers: {

            "Content-Type":
              "text/plain;charset=UTF-8"

          },

          body:
            payload

        }
      );

    }

    catch (error) {

      console.log(
        "Falha ao enviar clique para o banco externo."
      );

    }

  }


  /* =====================================================
     REGISTRAR INTENÇÃO
  ===================================================== */

  function registerIntent(
    destination,
    gaEvent
  ) {

    const record =
      createClickRecord(
        destination
      );


    saveLocally(
      record
    );


    sendGA4Event(
      gaEvent,
      destination,
      record.click_id
    );


    sendToExternalEndpoint(
      record
    );


    if (
      typeof window.trackLeadClick ===
      "function"
    ) {

      window.trackLeadClick(
        destination
      );

    }


    return record;

  }


  /* =====================================================
     WHATSAPP
  ===================================================== */

  function createWhatsAppLink(
    phone,
    message
  ) {

    return (
      `https://wa.me/${phone}` +
      `?text=${encodeURIComponent(message)}`
    );

  }


  /* =====================================================
     ELEMENTOS
  ===================================================== */

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


  /* =====================================================
     INSTITUTO
  ===================================================== */

  if (instituto) {

    const message =
      "Olá! Vim pelo Instagram da Dra. Larissa e gostaria de conhecer os cursos do Instituto Bulhões.";


    instituto.href =
      createWhatsAppLink(
        WHATSAPP_INSTITUTO,
        message
      );


    instituto.addEventListener(
      "click",
      function () {

        registerIntent(
          "whatsapp_instituto",
          "click_instituto"
        );

      }
    );

  }


  /* =====================================================
     AVALIAÇÃO
  ===================================================== */

  if (avaliacao) {

    const message =
      "Olá! Vim pelo Instagram da Dra. Larissa e gostaria de agendar uma avaliação na Bulhões Odontologia.";


    avaliacao.href =
      createWhatsAppLink(
        WHATSAPP_CLINICA,
        message
      );


    avaliacao.addEventListener(
      "click",
      function () {

        registerIntent(
          "whatsapp_clinica",
          "click_avaliacao"
        );

      }
    );

  }


  /* =====================================================
     SITE
  ===================================================== */

  if (site) {

    site.addEventListener(
      "click",
      function () {

        registerIntent(
          "site_bulhoes",
          "click_site"
        );

      }
    );

  }


  /* =====================================================
     PAGE VIEW PERSONALIZADO
  ===================================================== */

  sendGA4Event(
    "lp_larissa_view",
    "landing_page",
    generateClickId()
  );

})();
