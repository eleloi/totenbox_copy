var codigos = new Array();
let codigo_tras, precio_Tras, des_tras
$(document).ready(function () {

    $("#selector-medidas").change(function (e) {

        var formatter = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        });
       
        $("#pedido_Precio").val($('option:selected', this).attr("data-precio"));
      
        var precio_con_iva = Number($("#pedido_Precio").val().replace(",","."));
        precio_con_iva = Number(precio_con_iva);
        console.log(precio_con_iva);
        el_iva = Number(precio_con_iva) * 0.21;
        precio_con_iva = (Math.round(precio_con_iva *100)/100)+ (Math.round(el_iva *100)/100) ;
      
        precio_con_iva = Math.round(precio_con_iva * 100) / 100;
    
        $(".smallspanprecio").html("<h6>Precio " + formatter.format($('option:selected', this).attr("data-precio").replace(',', '.')) + "/mes</h6>");
        $("#pedido_Stripe_priceId").val($('option:selected', this).attr("data-precioid"));
        var codigo = $('option:selected', this).val();
        $.ajax({
            type: "GET",
            url: "/lloguer?handler=TrasterosVacios",
            data: { codigo: codigo },
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                elHtml = '';

                if (data.length == 0) {
                    $(".service-box").html(elHtml);
                    $("#pedido_Codigo_trastero").val(0);
                    $("#lipedido").html('');
                    $("#pedido_Descripcion").val('');
                    $("#spantotal").html('');
                    return;
                }

                if (data.length > 1)
                    elHtml = '<h6 class="trasteros-disponibles pt-3 pb-3">Hay ' + data.length + ' trasteros disponibles. Elige entre uno de ellos</h6>';
                else
                    elHtml = '<h6 class="trasteros-disponibles pt-3 pb-3">Hay 1 trastero disponible.</h6>';

                var a = document.getElementById("planosvg");


                var svgDoc = a.contentDocument;

                codigos.forEach(function (elemento, indice, array) {
                    var delta = svgDoc.getElementById(elemento);

                    delta.classList.remove("activate");

                });
                $.each(data, function (index, item) {

                    elHtml += '<button type="button" class="btn btn-small btn-primary btn-eleccion" id="btn-' + item["codigo"] + '" data-codigo="' + item["codigo"] + '" data-precio="' + item["precio"] + '" data-descripcion="' + item["descripcion"] + '">' + item["codigo"] + '</button>&nbsp;';
                    var delta = svgDoc.getElementById(item["codigo"]);

                    delta.classList.add("activate");
                    codigos.push(item["codigo"]);

                });

                elHtml += '<br/><small>Si no quedan trasteros del tamaño que necesitas, <a href="reserva">haz click aquí para que te avisemos cuando haya disponibilidad</a></small>';
                $(".service-box").html(elHtml);
            },
            failure: function (response) {
                console.log(response);
            }
        });
    });
    $(document).on("click", ".btn-eleccion", function () {
        var a = document.getElementById("planosvg");

        var svgDoc = a.contentDocument;
       

        if ($("#pedido_Codigo_trastero").val() != 0) {

            var delta = svgDoc.getElementById($("#pedido_Codigo_trastero").val());

            delta.classList.remove("seleccionado");
            delta.classList.add("activate");
            $("#btn-" + $("#pedido_Codigo_trastero").val()).removeClass('btn-success');
            $("#btn-" + $("#pedido_Codigo_trastero").val()).addClass('btn-primary');
          
        }
        var alpha = svgDoc.getElementById($(this).data("codigo"));
      
        alpha.classList.remove("activate");
        alpha.classList.add("seleccionado");

        $("#btn-" + $(this).data("codigo")).removeClass('btn-primary');
        $("#btn-" + $(this).data("codigo")).addClass('btn-success');
        $("#pedido_Codigo_trastero").val($(this).data("codigo"));
        $("#Trastero_Id").val($(this).data("id"));

       
        $("#pedido_Descripcion").val("Trastero " + $(this).data("codigo"));
       
        $("#alerta1").removeClass('show');
       
   
    });

    $("#pedido_Email").focusin(function () {

        $("#alerta2").removeClass('show');
       
        $('#fase2').removeAttr('disabled');

    });

    $("#pedido_Email").focusout(function () {

       
        CompruebaEmail();

    });

    CompruebaEmail = function () {
       
        var devuelta;
        $.ajax({
            type: "GET",
            url: "/lloguer?handler=CompruebaEmail",
            contentType: "application/json",
            dataType: "json",
            data: { email: $("#pedido_Email").val() },
            success: function (response) {
                if (response == "no") {
                   
                    $("#alerta2").addClass('show');
                    $("#fase2").prop('disabled', true); 
                    devuelta =  false;
                }
                else {
                    $("#alerta2").removeClass('show');
                    $("#fase2").prop('disabled', false); 
                    devuelta = true;
                }
            },
            error: function (response) {

            }
        });
        return devuelta;
    }



   

}); //document ready
