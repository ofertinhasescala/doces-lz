/**
 * Script para corrigir redirecionamento para checkout nas páginas J1, J2, J3 e J16
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos em uma subpágina (J1, J2, J3, J16)
    const isSubPage = window.location.pathname.includes('/J1/') || 
                      window.location.pathname.includes('/J2/') || 
                      window.location.pathname.includes('/J3/') || 
                      window.location.pathname.includes('/J16/');

    if (isSubPage) {
        // Corrigir o evento de clique no botão de finalizar
        $(document).on('click', 'button#btFinalizar', function(e) {
            e.preventDefault();
            
            verificarConexaoInternet().then(status => {
                if (status === 'conectado') {
                    const urlLoja = $('body').data('urlloja');
                    // Corrigir o redirecionamento para usar o caminho relativo correto
                    const currentPath = window.location.pathname;
                    const baseUrl = currentPath.substring(0, currentPath.lastIndexOf('/'));
                    const parentUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
                    
                    // Redirecionar para a página de finalização
                    window.location.href = parentUrl + "/loja/" + urlLoja + "/finalizar";
                } else {
                    $('#modalCarregando').hide();
                    $("#modal button").addClass('confirmar');
                    mostrarPopup('Sem Conexão com a Internet',
                        'Parece que você está offline. Verifique sua conexão com a internet e tente novamente.');
                }
            });
        });

        // Corrigir a função readJsonFile para obter o caminho correto
        window.originalReadJsonFile = window.readJsonFile;
        window.readJsonFile = function(file, callback) {
            // Ajustar o caminho para apontar para o diretório superior
            const correctedFile = file.replace("../../../delivery/json/", "../../delivery/json/");
            
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", correctedFile, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    callback(rawFile.responseText);
                }
            }
            rawFile.send(null);
        };

        // Corrigir URLs nas requisições AJAX
        const originalAjax = $.ajax;
        $.ajax = function(settings) {
            if (typeof settings === 'object') {
                // Corrigir URLs relativas em requisições AJAX
                if (settings.url && settings.url.startsWith('delivery/')) {
                    settings.url = '../../' + settings.url;
                }
            }
            return originalAjax.apply(this, arguments);
        };

        // Corrigir a função inicio para usar o caminho correto
        window.originalInicio = window.inicio;
        window.inicio = function() {
            const urlLoja = $('body').data('urlloja');
            
            // Determinar o caminho base correto
            const currentPath = window.location.pathname;
            const baseUrl = currentPath.substring(0, currentPath.lastIndexOf('/'));
            const parentUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
            
            history.pushState({ page: 'inicio' }, "", parentUrl + "/loja/" + urlLoja);
            
            $("#produto").hide();
            $('body').css('overflow-y', 'auto');
            atualizar();
        };

        console.log('Checkout path fix initialized for subpages');
    }
}); 