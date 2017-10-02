$(document).ready(function(){
    dateInput('dob-picker');
    dateInput('startdate-picker');

	$("#sin").keydown(function(e){numberFilter(e);});

    new Cleave('#sin', {
        delimiter: ' ',
        blocks: [3, 3, 3]
    });

    $("#is_driver_checkbox").change(function(){
    	if($(this).prop('checked'))
    		enableDriver();
    	else 
    		disableDriver();
    });

    $("#is_sales_checkbox").change(function(){
    	if($(this).prop('checked'))
    		enableSales();
    	else
    		disableSales();
    })

	if($("#is_driver").val())
		enableDriver();

	if($("#is_sales").val()) 
		enableSales();
});

function enableSales() {
	//TODO: create sales type of employee, with default commission settings for that employee (see commissions partial blade)
}

function enableDriver() {
	dateInput('license-picker');
	dateInput('lp-picker');
	dateInput('insurance-picker');
	phoneInput('pager');

	$('#dln').keydown(function(e){numberFilter(e);});

    new Cleave('#dln', {
        delimiter: '-',
		blocks: [6, 3]
	});

	$('#driver_form_button').removeClass('hidden');
	$('#is_driver').val(true);
}

function disableDriver() {
	$('#driver_form_button').addClass('hidden');
	$('#is_driver').val('false');
	if($('#driver').hasClass('active')) {
		$('#driver').removeClass('active');
		$('#main').addClass('active');
	}
	$('#is_driver').val(false);
}
