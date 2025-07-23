// Sistema de Rastreamento Completo do Meta Pixel
// Pixel ID: 1729058507716063
// Token de API: EAAQkYMSo764BPLIzQRR9ksbmAz13GtBcZCeSop5chVq8QxpCZCSx6D96Hb0V669cZBwjASAGMaT8MLm1ssRZB86ZCeVVqqS701ZCispXxudjA0ZBjRAlBEcTDLzwRYqJftHSZCOZCiuc95a59MqCjpUz15fXwnrELy9LAj3YJOWyDVWaNGvwPBGdm76zde65hlZBjPoAZDZD

(function() {
  // Configuração inicial do pixel
  window.pixelId = '1729058507716063';
  window.fbAccessToken = 'EAAQkYMSo764BPLIzQRR9ksbmAz13GtBcZCeSop5chVq8QxpCZCSx6D96Hb0V669cZBwjASAGMaT8MLm1ssRZB86ZCeVVqqS701ZCispXxudjA0ZBjRAlBEcTDLzwRYqJftHSZCOZCiuc95a59MqCjpUz15fXwnrELy9LAj3YJOWyDVWaNGvwPBGdm76zde65hlZBjPoAZDZD';
  
  // Inicializa o Facebook Pixel se ainda não estiver inicializado
  if (!window.fbq) {
    !function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    // Inicialização do pixel
    fbq('init', window.pixelId);
    
    // Evento inicial de PageView
    fbq('track', 'PageView');
    
    console.log('Pixel inicializado com sucesso: ' + window.pixelId);
  }
  
  // Objeto para armazenar dados do usuário
  window.pixelTracker = {
    // Armazena dados da sessão
    sessionData: {
      userId: null,
      sessionId: generateUUID(),
      startTime: new Date(),
      pagesVisited: 0,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      platform: navigator.platform,
      language: navigator.language
    },
    
    // Armazena dados coletados de formulários
    userData: {
      email: null,
      name: null,
      phone: null
    },
    
    // Armazena parâmetros UTM
    utmParams: {},
    
    // Inicializa o rastreador
    init: function() {
      this.collectUtmParameters();
      this.trackPageView();
      this.setupFormTracking();
      this.setupLinkTracking();
      this.setupScrollTracking();
      this.setupTimeOnPageTracking();
      this.setupProductViewTracking();
      this.setupAddToCartTracking();
      this.setupCheckoutTracking();
      this.setupVideoTracking();
      
      // Salva o estado inicial no localStorage
      this.saveState();
      
      console.log('Sistema de rastreamento avançado iniciado com sucesso');
    },
    
    // Rastreia a visualização da página
    trackPageView: function() {
      this.sessionData.pagesVisited++;
      
      const eventData = {
        ...this.getEventBaseData(),
        content_name: document.title,
        content_type: 'website',
        content_ids: [window.location.pathname]
      };
      
      fbq('track', 'PageView', eventData);
      
      // Rastreia com o servidor de conversões
      this.sendServerEvent('PageView', eventData);
      
      console.log('Evento PageView enviado', eventData);
    },
    
    // Configura o rastreamento de formulários
    setupFormTracking: function() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          // Coleta dados do formulário
          const formData = new FormData(form);
          const formDataObject = {};
          
          for (let [key, value] of formData.entries()) {
            formDataObject[key] = value;
            
            // Identifica campos comuns
            if (key.toLowerCase().includes('email')) {
              this.userData.email = value;
            }
            if (key.toLowerCase().includes('nome') || key.toLowerCase().includes('name')) {
              this.userData.name = value;
            }
            if (key.toLowerCase().includes('telefone') || key.toLowerCase().includes('phone')) {
              this.userData.phone = value;
            }
          }
          
          // Salva os dados coletados
          this.saveState();
          
          // Rastreia o evento Lead
          const eventData = {
            ...this.getEventBaseData(),
            form_id: form.id || form.action,
            form_name: form.name || form.getAttribute('name') || 'form',
            form_data: JSON.stringify(formDataObject)
          };
          
          fbq('track', 'Lead', eventData);
          
          // Rastreia com o servidor de conversões
          this.sendServerEvent('Lead', eventData);
          
          console.log('Evento Lead enviado', eventData);
        });
      });
    },
    
    // Configura o rastreamento de cliques em links
    setupLinkTracking: function() {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          
          if (!href || href === '#') return;
          
          if (href.startsWith('tel:')) {
            // Rastreia cliques em números de telefone
            fbq('track', 'Contact', {
              ...this.getEventBaseData(),
              content_name: 'Phone Call',
              content_category: 'Contact',
              content_ids: [href.replace('tel:', '')]
            });
          } else if (href.startsWith('mailto:')) {
            // Rastreia cliques em emails
            fbq('track', 'Contact', {
              ...this.getEventBaseData(),
              content_name: 'Email Contact',
              content_category: 'Contact',
              content_ids: [href.replace('mailto:', '')]
            });
          } else if (href.includes('whatsapp') || href.includes('wa.me')) {
            // Rastreia cliques em WhatsApp
            fbq('track', 'Contact', {
              ...this.getEventBaseData(),
              content_name: 'WhatsApp Contact',
              content_category: 'Contact',
              content_ids: [href]
            });
          } else if (link.getAttribute('download')) {
            // Rastreia downloads
            fbq('track', 'Download', {
              ...this.getEventBaseData(),
              content_name: link.getAttribute('download') || link.textContent,
              content_type: 'download',
              content_ids: [href]
            });
          } else if (isExternalLink(href)) {
            // Rastreia cliques em links externos
            fbq('track', 'ClickLink', {
              ...this.getEventBaseData(),
              content_name: link.textContent,
              content_type: 'external_link',
              content_ids: [href]
            });
          } else {
            // Rastreia cliques em links internos
            fbq('track', 'ClickLink', {
              ...this.getEventBaseData(),
              content_name: link.textContent,
              content_type: 'internal_link',
              content_ids: [href]
            });
          }
        });
      });
    },
    
    // Configura o rastreamento de rolagem da página
    setupScrollTracking: function() {
      let maxScroll = 0;
      let checkpoints = [25, 50, 75, 90, 100];
      let reachedCheckpoints = [];
      
      window.addEventListener('scroll', debounce(() => {
        const scrollPercentage = calculateScrollPercentage();
        
        if (scrollPercentage > maxScroll) {
          maxScroll = scrollPercentage;
          
          // Verifica se algum checkpoint foi atingido
          checkpoints.forEach(checkpoint => {
            if (scrollPercentage >= checkpoint && !reachedCheckpoints.includes(checkpoint)) {
              reachedCheckpoints.push(checkpoint);
              
              fbq('trackCustom', 'ScrollDepth', {
                ...this.getEventBaseData(),
                percent_scrolled: checkpoint
              });
            }
          });
        }
      }, 250));
    },
    
    // Configura o rastreamento de tempo na página
    setupTimeOnPageTracking: function() {
      const timeIntervals = [10, 30, 60, 120, 300]; // segundos
      let trackedIntervals = [];
      
      const startTime = new Date();
      
      const checkTimeOnPage = setInterval(() => {
        const currentTime = new Date();
        const timeSpent = Math.floor((currentTime - startTime) / 1000);
        
        timeIntervals.forEach(interval => {
          if (timeSpent >= interval && !trackedIntervals.includes(interval)) {
            trackedIntervals.push(interval);
            
            fbq('trackCustom', 'TimeOnPage', {
              ...this.getEventBaseData(),
              seconds_on_page: interval
            });
          }
        });
      }, 1000);
      
      // Limpa o intervalo quando a página for fechada
      window.addEventListener('beforeunload', () => {
        clearInterval(checkTimeOnPage);
        
        // Rastreia o tempo total na página
        const finalTime = Math.floor((new Date() - startTime) / 1000);
        fbq('trackCustom', 'TotalTimeOnPage', {
          ...this.getEventBaseData(),
          seconds_on_page: finalTime
        });
      });
    },
    
    // Configura o rastreamento de visualização de produtos
    setupProductViewTracking: function() {
      // Detecção de visualização de produtos pela URL
      if (window.location.href.includes('/product/') || window.location.href.includes('/produto/')) {
        const productName = document.querySelector('h1')?.textContent || 'Produto não identificado';
        const productPrice = document.querySelector('.price, .product-price')?.textContent || '';
        const productId = extractProductIdFromUrl(window.location.href);
        
        fbq('track', 'ViewContent', {
          ...this.getEventBaseData(),
          content_name: productName,
          content_type: 'product',
          content_ids: [productId],
          value: extractPrice(productPrice),
          currency: 'BRL'
        });
      }
    },
    
    // Configura o rastreamento de adição ao carrinho
    setupAddToCartTracking: function() {
      // Botões de adicionar ao carrinho
      const addToCartButtons = document.querySelectorAll('.add-to-cart, [data-action="add-to-cart"], button:contains("Adicionar ao Carrinho")');
      
      addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
          // Tenta encontrar informações do produto
          const productContainer = button.closest('.product, .product-item, .product-container');
          
          let productName = 'Produto não identificado';
          let productPrice = '0';
          let productId = '';
          
          if (productContainer) {
            productName = productContainer.querySelector('h2, h3, .product-title')?.textContent || productName;
            productPrice = productContainer.querySelector('.price, .product-price')?.textContent || productPrice;
            productId = productContainer.getAttribute('data-product-id') || '';
          } else {
            // Página de produto individual
            productName = document.querySelector('h1')?.textContent || productName;
            productPrice = document.querySelector('.price, .product-price')?.textContent || productPrice;
            productId = extractProductIdFromUrl(window.location.href);
          }
          
          fbq('track', 'AddToCart', {
            ...this.getEventBaseData(),
            content_name: productName,
            content_type: 'product',
            content_ids: [productId],
            value: extractPrice(productPrice),
            currency: 'BRL'
          });
        });
      });
    },
    
    // Configura o rastreamento de checkout
    setupCheckoutTracking: function() {
      // Botões de checkout/finalizar compra
      const checkoutButtons = document.querySelectorAll('.checkout-button, [data-action="checkout"], button:contains("Finalizar Compra"), button:contains("Comprar"), a:contains("Finalizar")');
      
      checkoutButtons.forEach(button => {
        button.addEventListener('click', () => {
          fbq('track', 'InitiateCheckout', this.getEventBaseData());
        });
      });
    },
    
    // Configura o rastreamento de vídeos
    setupVideoTracking: function() {
      // Vídeos do YouTube
      if (typeof YT !== 'undefined' && YT.Player) {
        setupYouTubeTracking.call(this);
      } else {
        window.addEventListener('load', () => {
          if (typeof YT !== 'undefined' && YT.Player) {
            setupYouTubeTracking.call(this);
          }
        });
      }
      
      // Vídeos HTML5
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        let isPlaying = false;
        let progress = 0;
        let videoTitle = video.getAttribute('title') || video.getAttribute('data-title') || 'Vídeo HTML5';
        
        video.addEventListener('play', () => {
          if (!isPlaying) {
            isPlaying = true;
            fbq('trackCustom', 'VideoPlay', {
              ...this.getEventBaseData(),
              video_title: videoTitle,
              video_type: 'html5'
            });
          }
        });
        
        video.addEventListener('pause', () => {
          if (isPlaying) {
            isPlaying = false;
            fbq('trackCustom', 'VideoPause', {
              ...this.getEventBaseData(),
              video_title: videoTitle,
              video_type: 'html5',
              video_progress: Math.floor((video.currentTime / video.duration) * 100)
            });
          }
        });
        
        video.addEventListener('ended', () => {
          isPlaying = false;
          fbq('trackCustom', 'VideoComplete', {
            ...this.getEventBaseData(),
            video_title: videoTitle,
            video_type: 'html5'
          });
        });
        
        video.addEventListener('timeupdate', () => {
          const currentProgress = Math.floor((video.currentTime / video.duration) * 100);
          const checkpoints = [25, 50, 75];
          
          checkpoints.forEach(checkpoint => {
            if (progress < checkpoint && currentProgress >= checkpoint) {
              fbq('trackCustom', 'VideoProgress', {
                ...this.getEventBaseData(),
                video_title: videoTitle,
                video_type: 'html5',
                video_progress: checkpoint
              });
            }
          });
          
          progress = currentProgress;
        });
      });
    },
    
    // Coleta parâmetros UTM da URL
    collectUtmParameters: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source');
      const utmMedium = urlParams.get('utm_medium');
      const utmCampaign = urlParams.get('utm_campaign');
      const utmContent = urlParams.get('utm_content');
      const utmTerm = urlParams.get('utm_term');
      const fbclid = urlParams.get('fbclid');
      const gclid = urlParams.get('gclid');
      
      this.utmParams = {
        utm_source: utmSource || localStorage.getItem('utm_source'),
        utm_medium: utmMedium || localStorage.getItem('utm_medium'),
        utm_campaign: utmCampaign || localStorage.getItem('utm_campaign'),
        utm_content: utmContent || localStorage.getItem('utm_content'),
        utm_term: utmTerm || localStorage.getItem('utm_term'),
        fbclid: fbclid || localStorage.getItem('fbclid'),
        gclid: gclid || localStorage.getItem('gclid')
      };
      
      // Armazena os parâmetros UTM para uso em outras páginas
      if (utmSource) localStorage.setItem('utm_source', utmSource);
      if (utmMedium) localStorage.setItem('utm_medium', utmMedium);
      if (utmCampaign) localStorage.setItem('utm_campaign', utmCampaign);
      if (utmContent) localStorage.setItem('utm_content', utmContent);
      if (utmTerm) localStorage.setItem('utm_term', utmTerm);
      if (fbclid) localStorage.setItem('fbclid', fbclid);
      if (gclid) localStorage.setItem('gclid', gclid);
    },
    
    // Envia evento para o servidor de conversões do Facebook
    sendServerEvent: function(eventName, eventData) {
      const url = `https://graph.facebook.com/v17.0/${window.pixelId}/events`;
      
      const eventId = generateUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      
      const serverData = {
        data: [{
          event_name: eventName,
          event_time: timestamp,
          event_id: eventId,
          event_source_url: window.location.href,
          action_source: 'website',
          user_data: {
            client_ip_address: null,  // Preenchido pelo servidor
            client_user_agent: navigator.userAgent,
            em: this.userData.email ? hash(this.userData.email.trim().toLowerCase()) : undefined,
            ph: this.userData.phone ? hash(this.userData.phone.replace(/\D/g, '')) : undefined,
            external_id: this.sessionData.userId || this.sessionData.sessionId
          },
          custom_data: eventData
        }],
        access_token: window.fbAccessToken,
        test_event_code: 'TEST12345' // Remova em produção ou atualize com seu código de teste
      };
      
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverData)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Evento do servidor enviado:', data);
      })
      .catch(error => {
        console.error('Erro ao enviar evento do servidor:', error);
      });
    },
    
    // Obtém dados básicos para todos os eventos
    getEventBaseData: function() {
      return {
        session_id: this.sessionData.sessionId,
        page_url: window.location.href,
        page_title: document.title,
        ...this.utmParams
      };
    },
    
    // Salva o estado atual no localStorage
    saveState: function() {
      localStorage.setItem('pixelTrackerSession', JSON.stringify(this.sessionData));
      localStorage.setItem('pixelTrackerUser', JSON.stringify(this.userData));
    },
    
    // Carrega o estado salvo
    loadState: function() {
      const savedSession = localStorage.getItem('pixelTrackerSession');
      const savedUser = localStorage.getItem('pixelTrackerUser');
      
      if (savedSession) {
        this.sessionData = { ...this.sessionData, ...JSON.parse(savedSession) };
      }
      
      if (savedUser) {
        this.userData = { ...this.userData, ...JSON.parse(savedUser) };
      }
    }
  };
  
  // Funções auxiliares
  
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
  
  function calculateScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    );
    
    return Math.floor((scrollTop / (documentHeight - windowHeight)) * 100);
  }
  
  function isExternalLink(url) {
    if (!url) return false;
    
    // Remove o protocolo e verifica se o domínio é diferente
    const currentDomain = window.location.hostname;
    
    // Verifica se o link é relativo
    if (url.startsWith('/') || !url.includes('://')) {
      return false;
    }
    
    try {
      const linkDomain = new URL(url).hostname;
      return linkDomain !== currentDomain;
    } catch (e) {
      return false;
    }
  }
  
  function extractProductIdFromUrl(url) {
    // Tenta extrair o ID do produto da URL
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    
    // Retorna o último segmento da URL como ID
    return pathSegments[pathSegments.length - 1] || '';
  }
  
  function extractPrice(priceString) {
    if (!priceString) return 0;
    
    // Remove símbolos não numéricos e converte para float
    const cleanPrice = priceString.replace(/[^\d,\.]/g, '')
      .replace(',', '.');
    
    return parseFloat(cleanPrice) || 0;
  }
  
  function hash(input) {
    // Função simples para retornar o valor sem hash por enquanto
    // Em produção, você deve usar SHA256
    return input;
  }
  
  function setupYouTubeTracking() {
    const tracker = this;
    const iframes = document.querySelectorAll('iframe');
    const youtubeIframes = Array.from(iframes).filter(iframe => iframe.src.includes('youtube.com'));
    
    youtubeIframes.forEach((iframe, index) => {
      const videoId = extractYouTubeVideoId(iframe.src);
      const playerId = 'youtube-player-' + index;
      iframe.id = playerId;
      
      new YT.Player(playerId, {
        events: {
          onStateChange: function(event) {
            const playerState = event.data;
            const videoData = event.target.getVideoData();
            const videoTitle = videoData ? videoData.title : videoId;
            
            // YT.PlayerState: -1 (não iniciado), 0 (terminado), 1 (em reprodução), 2 (pausado), 3 (armazenando), 5 (vídeo em fila)
            if (playerState === YT.PlayerState.PLAYING) {
              fbq('trackCustom', 'VideoPlay', {
                ...tracker.getEventBaseData(),
                video_title: videoTitle,
                video_id: videoId,
                video_type: 'youtube'
              });
            } else if (playerState === YT.PlayerState.PAUSED) {
              const progress = Math.floor((event.target.getCurrentTime() / event.target.getDuration()) * 100);
              fbq('trackCustom', 'VideoPause', {
                ...tracker.getEventBaseData(),
                video_title: videoTitle,
                video_id: videoId,
                video_type: 'youtube',
                video_progress: progress
              });
            } else if (playerState === YT.PlayerState.ENDED) {
              fbq('trackCustom', 'VideoComplete', {
                ...tracker.getEventBaseData(),
                video_title: videoTitle,
                video_id: videoId,
                video_type: 'youtube'
              });
            }
          }
        }
      });
    });
  }
  
  function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }
  
  // Inicializa o rastreador
  document.addEventListener('DOMContentLoaded', function() {
    window.pixelTracker.loadState();
    window.pixelTracker.init();
  });
  
  // Garante que seja inicializado mesmo se o evento DOMContentLoaded já tiver sido disparado
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    window.pixelTracker.loadState();
    window.pixelTracker.init();
  }
})(); 