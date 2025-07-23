/**
 * Mock data para simular a API da loja
 * Este arquivo será carregado quando as requisições AJAX falharem
 */

// Função para simular a API
(function() {
  // Verificar se o objeto global já existe
  window.mockApi = window.mockApi || {};
  
  // Dados simulados da loja
  const mockData = {
    // Dados de loja
    loja: {
      id: "1",
      nome: "Delivery Gourmet",
      telefone: "11999999999",
      aberta: "s",
      urlLoja: "delivery-gourmet"
    },
    
    // Categorias e produtos
    categorias: [
      {
        id: "1",
        nome: "Hambúrgueres",
        produtos: [
          {
            id: "1",
            nome: "Hambúrguer Clássico",
            descricao: "Hambúrguer com queijo, alface e tomate",
            preco: "25.90",
            precoPromocao: "0",
            tiposComplementos: []
          },
          {
            id: "2",
            nome: "Hambúrguer Duplo",
            descricao: "Dois hambúrgueres com queijo, alface e tomate",
            preco: "35.90",
            precoPromocao: "29.90",
            tiposComplementos: []
          }
        ]
      },
      {
        id: "2",
        nome: "Pizzas",
        produtos: [
          {
            id: "3",
            nome: "Pizza Margherita",
            descricao: "Pizza com molho de tomate, mussarela e manjericão",
            preco: "45.90",
            precoPromocao: "0",
            tiposComplementos: []
          },
          {
            id: "4",
            nome: "Pizza Calabresa",
            descricao: "Pizza com molho de tomate, mussarela e calabresa",
            preco: "49.90",
            precoPromocao: "0",
            tiposComplementos: []
          }
        ]
      }
    ],
    
    // Carrinho
    carrinho: {
      itens: [],
      total: "0.00"
    }
  };
  
  // Função para simular a resposta da API
  window.mockApi.getResponse = function(url, data) {
    console.log('Mock API called:', url, data);
    
    // Verificar o tipo de requisição
    if (url.includes('verificarLojaAberta.php')) {
      return 's';
    }
    
    if (url.includes('carrinho.php')) {
      if (data && data.acao === 'addProduto') {
        return '<div class="lista"><div class="item"><div class="col1"><span class="idProduto" style="display:none;">1</span><span class="idItemCarrinho" style="display:none;">1</span><span class="qtdeProduto"><i class="removerQtdeCarrinho" data-item="1"></i><span>1</span><i class="adicionarQtdeCarrinho" data-item="1"></i></span></div><div class="col2"><b>Hambúrguer Clássico</b><span>Hambúrguer com queijo, alface e tomate</span></div><div class="col3">R$ 25,90</div></div></div><div class="valores"><div class="subtotal">25.90</div><div class="total">R$ 25,90</div><div class="nrItens">1</div></div>';
      }
      
      return '<div class="lista"><div class="vazio">Seu carrinho está vazio</div></div><div class="valores"><div class="subtotal">0</div><div class="total">R$ 0,00</div><div class="nrItens">0</div></div>';
    }
    
    if (url.includes('loja-')) {
      return JSON.stringify(mockData);
    }
    
    // Resposta padrão
    return '{}';
  };
  
  // Interceptar XMLHttpRequest para simular respostas
  const originalXHR = window.XMLHttpRequest;
  if (originalXHR) {
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const originalOpen = xhr.open;
      const originalSend = xhr.send;
      
      xhr.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
      };
      
      xhr.send = function(data) {
        // Verificar se a URL é uma API que queremos simular
        if (this._url && (
            this._url.includes('delivery/') || 
            this._url.includes('loja-') || 
            this._url.includes('.json')
        )) {
          console.log('Intercepting XHR request:', this._url);
          
          // Simular uma resposta bem-sucedida após um pequeno atraso
          setTimeout(() => {
            const response = window.mockApi.getResponse(this._url, data);
            
            // Simular os eventos do XHR
            Object.defineProperty(this, 'status', { value: 200 });
            Object.defineProperty(this, 'statusText', { value: 'OK' });
            Object.defineProperty(this, 'responseText', { value: response });
            Object.defineProperty(this, 'readyState', { value: 4 });
            
            // Disparar eventos
            this.onreadystatechange && this.onreadystatechange();
            this.onload && this.onload();
          }, 300);
          
          return;
        }
        
        return originalSend.apply(this, arguments);
      };
      
      return xhr;
    };
  }
  
  // Interceptar fetch para simular respostas
  const originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function(url, options) {
      // Verificar se a URL é uma API que queremos simular
      if (url && (
          url.toString().includes('delivery/') || 
          url.toString().includes('loja-') || 
          url.toString().includes('.json')
      )) {
        console.log('Intercepting fetch request:', url);
        
        // Simular uma resposta bem-sucedida após um pequeno atraso
        return new Promise((resolve) => {
          setTimeout(() => {
            const response = window.mockApi.getResponse(url.toString(), options && options.body);
            
            resolve({
              ok: true,
              status: 200,
              statusText: 'OK',
              json: () => Promise.resolve(JSON.parse(response)),
              text: () => Promise.resolve(response)
            });
          }, 300);
        });
      }
      
      return originalFetch.apply(this, arguments);
    };
  }
  
  console.log('Mock API initialized');
})(); 