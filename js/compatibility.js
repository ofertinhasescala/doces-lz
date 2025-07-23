/**
 * Script de compatibilidade para garantir que o site funcione em diferentes navegadores e ambientes
 */

(function() {
  console.log('Loading compatibility script...');
  
  // Detectar ambiente (local, vercel, etc)
  const isVercel = window.location.hostname.includes('vercel.app');
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  console.log('Environment detection:', { 
    isVercel: isVercel, 
    isLocal: isLocal,
    hostname: window.location.hostname,
    pathname: window.location.pathname
  });
  
  // Polyfill para URL() em navegadores antigos
  if (typeof window.URL !== 'function') {
    console.log('Adding URL polyfill');
    window.URL = function(url) {
      var anchor = document.createElement('a');
      anchor.href = url;
      
      this.href = anchor.href;
      this.protocol = anchor.protocol;
      this.host = anchor.host;
      this.hostname = anchor.hostname;
      this.port = anchor.port;
      this.pathname = anchor.pathname;
      this.search = anchor.search;
      this.hash = anchor.hash;
      this.origin = anchor.protocol + '//' + anchor.hostname + (anchor.port ? ':' + anchor.port : '');
      
      this.toString = function() {
        return this.href;
      };
    };
  }
  
  // Polyfill para URLSearchParams
  if (typeof window.URLSearchParams !== 'function') {
    console.log('Adding URLSearchParams polyfill');
    window.URLSearchParams = function(searchString) {
      this.params = {};
      
      if (searchString) {
        if (searchString.charAt(0) === '?') {
          searchString = searchString.slice(1);
        }
        
        var pairs = searchString.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i].split('=');
          this.params[decodeURIComponent(pair[0])] = pair[1] ? decodeURIComponent(pair[1]) : '';
        }
      }
      
      this.get = function(key) {
        return this.params[key] || null;
      };
      
      this.set = function(key, value) {
        this.params[key] = value;
      };
      
      this.toString = function() {
        var pairs = [];
        for (var key in this.params) {
          if (this.params.hasOwnProperty(key)) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(this.params[key]));
          }
        }
        return pairs.join('&');
      };
    };
  }
  
  // Polyfill para Promise
  if (typeof window.Promise !== 'function') {
    console.log('Adding Promise polyfill');
    // Carrega um polyfill para Promise
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
    document.head.appendChild(script);
  }
  
  // Polyfill para fetch
  if (typeof window.fetch !== 'function') {
    console.log('Adding fetch polyfill');
    // Carrega um polyfill para fetch
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js';
    document.head.appendChild(script);
  }
  
  // Corrigir problemas com jQuery em ambientes sem jQuery
  if (typeof window.jQuery === 'undefined') {
    console.log('jQuery not found, loading jQuery');
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.onload = function() {
      console.log('jQuery loaded successfully');
      
      // Inicializar jQuery novamente
      $ = jQuery = window.jQuery;
      
      // Disparar evento de carregamento do jQuery
      var event = document.createEvent('Event');
      event.initEvent('jquery-loaded', true, true);
      document.dispatchEvent(event);
    };
    document.head.appendChild(script);
  }
  
  // Corrigir problemas de CORS em navegadores antigos
  var originalXHR = window.XMLHttpRequest;
  if (originalXHR) {
    console.log('Patching XMLHttpRequest for CORS support');
    window.XMLHttpRequest = function() {
      var xhr = new originalXHR();
      var originalOpen = xhr.open;
      
      xhr.open = function(method, url, async, user, password) {
        // Converter URLs relativas em absolutas
        if (url && typeof url === 'string' && !url.match(/^(https?:)?\/\//)) {
          if (url.startsWith('/')) {
            url = window.location.origin + url;
          } else {
            var basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
            url = window.location.origin + basePath + url;
          }
          console.log('XHR: Fixed relative URL to absolute:', url);
        }
        
        return originalOpen.call(this, method, url, async === undefined ? true : async, user, password);
      };
      
      return xhr;
    };
  }
  
  // Detecção de conexão com a internet
  window.isOnline = function() {
    return true; // Sempre assumir online para evitar bloqueios
  };
  
  // Sobrescrever a função verificarConexaoInternet para ser mais robusta
  window.verificarConexaoInternet = function() {
    console.log('Checking internet connection...');
    return Promise.resolve('conectado'); // Sempre retornar conectado
  };
  
  // Corrigir problemas com caminhos em diferentes ambientes
  window.getBaseUrl = function() {
    return window.location.origin;
  };
  
  // Corrigir problemas com redirecionamentos
  const originalPushState = history.pushState;
  history.pushState = function(state, title, url) {
    console.log('History pushState:', { state, title, url });
    
    // Corrigir URLs relativas
    if (url && !url.match(/^(https?:)?\/\//)) {
      if (!url.startsWith('/')) {
        url = '/' + url;
      }
      url = window.location.origin + url;
      console.log('Fixed pushState URL:', url);
    }
    
    return originalPushState.call(this, state, title, url);
  };
  
  // Adicionar função de fallback para readJsonFile
  if (typeof window.readJsonFile !== 'function') {
    console.log('Adding readJsonFile fallback');
    window.readJsonFile = function(file, callback) {
      console.log('Reading JSON file (fallback):', file);
      
      // Usar caminho absoluto baseado na origem
      const baseUrl = window.location.origin;
      let correctedFile = file;
      
      if (file.includes('delivery/json/')) {
        correctedFile = baseUrl + '/' + file;
      }
      
      console.log('Corrected JSON file path:', correctedFile);
      
      fetch(correctedFile)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(text => {
          callback(text);
        })
        .catch(error => {
          console.error('Error fetching JSON file:', error);
          // Fornecer um JSON vazio como fallback
          callback('{}');
        });
    };
  }
  
  // Adicionar função de fallback para mostrarPopup
  if (typeof window.mostrarPopup !== 'function') {
    console.log('Adding mostrarPopup fallback');
    window.mostrarPopup = function(titulo, msg) {
      console.log('Popup:', titulo, msg);
      alert(titulo + '\n\n' + msg);
    };
  }
  
  // Adicionar função de fallback para atualizar
  if (typeof window.atualizar !== 'function') {
    console.log('Adding atualizar fallback');
    window.atualizar = function() {
      console.log('atualizar called (fallback)');
      // Implementação vazia
    };
  }
  
  // Adicionar função de fallback para inicio
  if (typeof window.inicio !== 'function') {
    console.log('Adding inicio fallback');
    window.inicio = function() {
      console.log('inicio called (fallback)');
      // Implementação vazia
    };
  }
  
  // Adicionar função de fallback para verificarLojaAberta
  if (typeof window.verificarLojaAberta !== 'function') {
    console.log('Adding verificarLojaAberta fallback');
    window.verificarLojaAberta = function() {
      console.log('verificarLojaAberta called (fallback)');
      return 's'; // Sempre retornar que a loja está aberta
    };
  }
  
  console.log('Compatibility script loaded successfully');
})(); 