/**
 * Script para lidar com o redirecionamento de checkout das páginas J1, J2, J3 e J16
 */

(function() {
    console.log('Checkout handler script loaded');
    
    // Função para ser executada quando o DOM estiver carregado
    function onDOMContentLoaded() {
        console.log('Checking for checkout redirect');
        
        // Verificar se há um redirecionamento de checkout pendente
        const isCheckoutRedirect = localStorage.getItem('checkoutRedirect') === 'true';
        const urlLoja = localStorage.getItem('checkoutUrlLoja');
        const timestamp = localStorage.getItem('checkoutTimestamp');
        
        // Verificar se o redirecionamento é recente (menos de 5 segundos)
        const isRecentRedirect = timestamp && (Date.now() - parseInt(timestamp) < 5000);
        
        console.log('Checkout redirect status:', { 
            isCheckoutRedirect, 
            urlLoja, 
            timestamp,
            isRecentRedirect
        });
        
        if (isCheckoutRedirect && urlLoja && isRecentRedirect) {
            console.log('Processing checkout redirect');
            
            // Limpar os dados do localStorage
            localStorage.removeItem('checkoutRedirect');
            localStorage.removeItem('checkoutUrlLoja');
            localStorage.removeItem('checkoutTimestamp');
            
            // Simular o processo de checkout
            setTimeout(function() {
                console.log('Simulating checkout process');
                
                // Verificar se o carrinho tem itens
                const hasItems = $('#meuCarrinho .lista .item').length > 0;
                
                if (!hasItems) {
                    console.log('Carrinho vazio, adicionando item simulado');
                    
                    // Adicionar um item simulado ao carrinho
                    const simulatedCartHtml = `
                        <div class="lista">
                            <div class="item">
                                <div class="col1">
                                    <span class="idProduto" style="display:none;">1</span>
                                    <span class="idItemCarrinho" style="display:none;">1</span>
                                    <span class="qtdeProduto">
                                        <i class="removerQtdeCarrinho" data-item="1"></i>
                                        <span>1</span>
                                        <i class="adicionarQtdeCarrinho" data-item="1"></i>
                                    </span>
                                </div>
                                <div class="col2">
                                    <b>Produto do Pedido</b>
                                    <span>Descrição do produto</span>
                                </div>
                                <div class="col3">R$ 19,99</div>
                            </div>
                        </div>
                        <div class="valores">
                            <div class="subtotal">19.99</div>
                            <div class="total">R$ 19,99</div>
                            <div class="nrItens">1</div>
                        </div>
                    `;
                    
                    $('#meuCarrinho .pedido').html(simulatedCartHtml);
                }
                
                // Mostrar o carrinho
                $('#opacidade').addClass('opacidade');
                $('#meuCarrinho').addClass('mostrar');
                $('body').css('overflow-y', 'hidden');
                
                // Clicar no botão de finalizar automaticamente
                setTimeout(function() {
                    const btFinalizar = $('button#btFinalizar');
                    
                    if (btFinalizar.length > 0) {
                        console.log('Clicking finalize button');
                        btFinalizar.trigger('click');
                    } else {
                        console.error('Finalize button not found');
                        alert('Erro ao processar o checkout. Por favor, tente novamente.');
                    }
                }, 500);
            }, 1000);
        }
    }
    
    // Executar quando o DOM estiver carregado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
    } else {
        onDOMContentLoaded();
    }
})(); 