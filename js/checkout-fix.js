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
        console.log('Checkout path fix initialized for subpages');
        
        // Corrigir o evento de clique no botão de finalizar
        $(document).on('click', 'button#btFinalizar', function(e) {
            e.preventDefault();
            
            verificarConexaoInternet().then(status => {
                if (status === 'conectado') {
                    const urlLoja = $('body').data('urlloja');
                    
                    // Determinar o caminho base correto independente do ambiente
                    const currentPath = window.location.pathname;
                    const pathParts = currentPath.split('/');
                    const folderName = pathParts[pathParts.length - 2]; // Ex: J1, J2, etc.
                    
                    // Construir URL absoluta para evitar problemas de caminho relativo
                    const baseUrl = window.location.origin;
                    window.location.href = `${baseUrl}/loja/${urlLoja}/finalizar`;
                } else {
                    $('#modalCarregando').hide();
                    $("#modal button").addClass('confirmar');
                    mostrarPopup('Sem Conexão com a Internet',
                        'Parece que você está offline. Verifique sua conexão com a internet e tente novamente.');
                }
            });
        });

        // Sobrescrever a função readJsonFile para usar caminhos absolutos
        window.originalReadJsonFile = window.readJsonFile;
        window.readJsonFile = function(file, callback) {
            // Usar caminho absoluto baseado na origem
            const baseUrl = window.location.origin;
            const correctedFile = file.replace("../../../delivery/json/", baseUrl + "/delivery/json/");
            
            var rawFile = new XMLHttpRequest();
            rawFile.overrideMimeType("application/json");
            rawFile.open("GET", correctedFile, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4) {
                    if (rawFile.status == "200") {
                        callback(rawFile.responseText);
                    } else {
                        console.error('Erro ao carregar arquivo JSON:', correctedFile);
                    }
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
                    const baseUrl = window.location.origin;
                    settings.url = baseUrl + '/' + settings.url;
                }
            }
            return originalAjax.apply(this, arguments);
        };

        // Corrigir a função inicio para usar o caminho correto
        window.originalInicio = window.inicio;
        window.inicio = function() {
            const urlLoja = $('body').data('urlloja');
            
            // Usar caminho absoluto baseado na origem
            const baseUrl = window.location.origin;
            
            history.pushState({ page: 'inicio' }, "", baseUrl + "/loja/" + urlLoja);
            
            $("#produto").hide();
            $('body').css('overflow-y', 'auto');
            atualizar();
        };

        // Corrigir a função verificarLojaAberta para usar caminhos absolutos
        window.originalVerificarLojaAberta = window.verificarLojaAberta;
        window.verificarLojaAberta = function() {
            let lojaAberta = 'n';
            let idUsuario = $('body').data('idusuario');
            
            const baseUrl = window.location.origin;
            
            $.ajax({
                type: "post",
                url: baseUrl + "/delivery/verificarLojaAberta.php",
                data: "idUsuario=" + idUsuario,
                async: false,
                cache: false,
                datatype: "text",
                beforeSend: function () { },
                success: function (data) {
                    lojaAberta = data;
                },
                error: function () { }
            });
            return lojaAberta;
        };
    }
}); 