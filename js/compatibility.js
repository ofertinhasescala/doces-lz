/**
 * Script de compatibilidade para garantir que o site funcione em diferentes navegadores
 */

(function() {
  // Polyfill para URL() em navegadores antigos
  if (typeof window.URL !== 'function') {
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
    // Carrega um polyfill para Promise
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
    document.head.appendChild(script);
  }
  
  // Polyfill para fetch
  if (typeof window.fetch !== 'function') {
    // Carrega um polyfill para fetch
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js';
    document.head.appendChild(script);
  }
  
  // Corrigir problemas de CORS em navegadores antigos
  var originalXHR = window.XMLHttpRequest;
  if (originalXHR) {
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
        }
        
        return originalOpen.call(this, method, url, async === undefined ? true : async, user, password);
      };
      
      return xhr;
    };
  }
  
  // Detecção de conexão com a internet
  window.isOnline = function() {
    return navigator.onLine !== false;
  };
  
  // Sobrescrever a função verificarConexaoInternet para ser mais robusta
  var originalVerificarConexaoInternet = window.verificarConexaoInternet;
  window.verificarConexaoInternet = function() {
    // Se a função original não existir, criar uma nova
    if (typeof originalVerificarConexaoInternet !== 'function') {
      return new Promise(function(resolve) {
        if (navigator.onLine === false) {
          resolve('desconectado');
          return;
        }
        
        // Tentar fazer uma requisição para verificar a conexão
        var xhr = new XMLHttpRequest();
        xhr.timeout = 5000;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            resolve(xhr.status >= 200 && xhr.status < 300 ? 'conectado' : 'desconectado');
          }
        };
        xhr.ontimeout = function() {
          resolve('desconectado');
        };
        xhr.onerror = function() {
          resolve('desconectado');
        };
        
        try {
          xhr.open('HEAD', window.location.origin + '/favicon.ico?' + new Date().getTime(), true);
          xhr.send();
        } catch (e) {
          resolve('desconectado');
        }
      });
    }
    
    // Usar a função original, mas com um fallback
    return new Promise(function(resolve) {
      var timeoutId = setTimeout(function() {
        resolve('conectado'); // Assume conectado após timeout
      }, 5000);
      
      originalVerificarConexaoInternet()
        .then(function(status) {
          clearTimeout(timeoutId);
          resolve(status);
        })
        .catch(function() {
          clearTimeout(timeoutId);
          resolve('conectado'); // Assume conectado em caso de erro
        });
    });
  };
  
  // Corrigir problemas com caminhos em diferentes ambientes
  window.getBaseUrl = function() {
    return window.location.origin;
  };
  
  console.log('Script de compatibilidade carregado com sucesso');
})(); 