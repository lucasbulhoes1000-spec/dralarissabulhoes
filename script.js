(function () {

  /* =====================================================
     CONFIGURAÇÕES
  ===================================================== */

  const WHATSAPP_INSTITUTO = "551340427082";
  const WHATSAPP_CLINICA = "5513996300176";


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

      landing_page: window.location.href,

      first_referrer:
        document.referrer || "direct"

    };

  }


  /* =====================================================
     GERAR ID DO CLIQUE
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
     REGISTRAR EVENTO NO GA4
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
     REGISTRAR INTENÇÃO DE LEAD
  ===================================================== */

  function registerLeadIntent(
    destination
  ) {

    const clickId =
      generateClickId();


    const tracking =
      getTrackingData();


    const record = {

      click_id:
        clickId,

      destination:
        destination,

      timestamp:
        new Date().toISOString(),

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

      landing_page:
        tracking.landing_page || "",

      first_referrer:
        tracking.first_referrer || ""

    };


    /*
    Guarda localmente também.
    Quando o CRM entrar,
    podemos aproveitar essa estrutura.
    */

    try {

      localStorage.setItem(
        "last_lead_click",
        JSON.stringify(record)
      );

    }

    catch (error) {

      console.log(
        "Não foi possível salvar o clique localmente."
      );

    }


    return record;

  }


  /* =====================================================
     CRIAR LINK DO WHATSAPP
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
     INSTITUTO BULHÕES
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

        const record =
          registerLeadIntent(
            "whatsapp_instituto"
          );


        sendGA4Event(
          "click_instituto",
          "whatsapp_instituto",
          record.click_id
        );


        if (
          typeof window.trackLeadClick ===
          "function"
        ) {

          window.trackLeadClick(
            "whatsapp_instituto"
          );

        }

      }
    );

  }


  /* =====================================================
     AGENDAR AVALIAÇÃO
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

        const record =
          registerLeadIntent(
            "whatsapp_clinica"
          );


        sendGA4Event(
          "click_avaliacao",
          "whatsapp_clinica",
          record.click_id
        );


        if (
          typeof window.trackLeadClick ===
          "function"
        ) {

          window.trackLeadClick(
            "whatsapp_clinica"
          );

        }

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

        const record =
          registerLeadIntent(
            "site_bulhoes"
          );


        sendGA4Event(
          "click_site",
          "site_bulhoes",
          record.click_id
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
