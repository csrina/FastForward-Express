$(document).ready(function() {
	var checkboxes = '#send-bills, #sub-location, #separate-billing-addr, #give-discount, #give-commission-1, #give-commission-2, #has-invoice-comment, #has-fuel-surcharge, #charge-interest, #gst-exempt, #use-custom-field, #existing-account, #can-be-parent, #existing-account';
	$(checkboxes).change(function() {
		if(this.checked){
            $("input[name='" + $(this).attr('data-hidden-name') + "']").val('true');
            $('#' + $(this).attr('data-div')).fadeIn();
		}
		else {
            $("input[name='" + $(this).attr('data-hidden-name') + "']").val('false');
		    $('#' + $(this).attr('data-div')).fadeOut();
		}
	});

	$(checkboxes).each(function (i, e) {
	    $("#" + $(this).attr('data-div')).css('display', 'none');
	});
});

$('#advFilter input[type="checkbox"]').each(function(i,j) {
	if(j.checked){
		$('tr#' + j.id).fadeIn();
	}
	else{
		$('tr#' + j.id).fadeOut();
	}
});

function validate() {
	return true;
	//TODO: discuss client-side validation
	var errors = {string: "\0"};
	var check = ['name', 'contact-1-first-name', 'contact-1-last-name', 'contact-1-phone1', 'delivery-street', 'delivery-zip-postal', 'delivery-city', 'delivery-state-province', 'delivery-country'];

	$(':input').parent().removeClass('has-error');

	for (var i = 0; i < check.length; i++) {
		notBlank(check[i], errors);
	}

	if ($('#secondary-contact').is(':checked')) {
		var check = ['secondary-first-name', 'secondary-last-name', 'secondary-phone1'];
		for (var i = 0; i < check.length; i++) {
			notBlank(check[i], errors);
		}
	}

	if ($('#billing-address').is(':checked')) {
		var check = ['billing-street', 'billing-zip-postal', 'billing-city', 'billing-state-province', 'billing-country'];
		for (var i = 0; i < check.length; i++) {
			notBlank(check[i], errors);
		}
	}

//validate Parent Company ID
	if ($('#sub-location').is(':checked') && $('#parent-account-id').find(":selected").val() < 0) {
		errors.string += "Please select a valid Parent Account\n";
		$('#parent-account-id').parent().addClass('has-error');
	}

	if ($('#give-discount').is(':checked') && $('[name="discount"]').val().length == 0) {
		errors.string += "Discount field cannot be empty\n";
		$('[name="discount"]').parent().addClass('has-error');
	}

	if ($('#give-commission-1').is(':checked') && ($('[name="driver-commission-employee-id"]').val().length == 0 || $('[name="driver-commission-percent"]').val().length == 0)) {
		errors.string += "Both commission employee and amount must not be empty\n";
		$('[name="driver-commission-employee-id"]').parent().addClass('has-error');
		$('[name="driver-commission-percent"]').parent().addClass('has-error');
	}

	if ($('#give-commission-2').is(':checked') && ($('[name="sales-commission-employee-id"]').val().length == 0 || $('[name="sales-commission-percent"]').val().length == 0)) {
		errors.string += "Both commission employee and amount must not be empty\n";
		$('[name="sales-commission-employee-id"]').parent().addClass('has-error');
		$('[name="sales-commission-percent"]').parent().addClass('has-error');
	}

	if ($('[name="invoice-interval"]').find(':selected').val() < 0) {
		errors.string += "Invalid invoice interval\n";
		$('[name="invoice-interval"]').parent().addClass('has-error');
	}

	if ($('[name="existing-account"]').is(':checked') && $('[name="account-number"]').val().length == 0) {
		errors.string += "Account number cannot be empty\n";
		$('[name="account-number"]').parent().addClass('has-error');
	}

	if (errors.string == "\0") {
		return true;
	}
	$('#errors').removeClass('hidden');
	$('#errors').text(errors.string);
	return false;
}

/*Multiple contacts stuff*/
function saveScContact() {
    var fName = $("#first-name").val();
    var lName = $("#last-name").val();
    var sPpn = $("#phone1").val();
    var sPpnExt = $("#phone1-ext").val();
    var sSpn = $("#phone2").val();
    var sSpnExt = $("#phone2-ext").val();
    var sem = $("#email1").val();
    var sem2 = $("#email2").val();

    var id = -1;
    $("input[data-contact-id='true']").each(function(index, element){
        var newId = $(element).val();

        if (newId > id)
            id = newId;

        id++;
    });

    if (id == -1)
        id = 1;

    var isPrimary = $("input[name^='contact-id-']").length == 0;

    if (!fName || !lName || !sPpn || !sem)
	    return;

    newTabPill(id, fName, lName, isPrimary);
    newTabBody(id, fName, lName, null, sPpn, sPpnExt, null, sSpn, sSpnExt, null, sem, null, sem2, isPrimary, true);
    clearScForm();
    $("#first-name").focus();
    return true;
}

function makePrimary(element) {
	var idToMakePrimary = $(element).parent().parent().parent().parent().parent().find('input[data-contact-id="true"]').val();
	$("#contact-tabs a").each(function(index, el) {
		$(el).children('i.fa-star').remove();
    });

	$("a[data-id='" + idToMakePrimary + "']").prepend('<i class="fa fa-star"></i> ')
	$('input[name="contact-action-change-primary"]').remove();
	$("#" + idToMakePrimary + "-panel").append('<input type="hidden" name="contact-action-change-primary" value="' + idToMakePrimary + '" />');
}

function newTabPill(id, fName, lName, isPrimary) {
    var star = "";

    if (isPrimary)
		star = "<i class='fa fa-star'></i> ";

    var pill = "<li role='presentation'><a data-id='" + id + "' href='#" + id + "-panel' aria-controls='" + id + "' role='tab' data-toggle='tab'>" + star + fName + " " + lName + "</a></li>";

    $("#contact-tabs").append(pill);
}

function newTabBody(id, fName, lName, ppnId, ppn, ppnExt, spnId, spn, spnExt, emId, em, em2Id, em2, isPrimary, isNew) {
    var makePrimaryButton = "";
    if(!isPrimary)
		makePrimaryButton = '<li title="Make Primary"><a onclick="makePrimary(this); return false;"><i class="fa fa-star"></i></a></li>';

    var hasSpn = hasEm2 = false;

    var spnEl;
    if (spnId) {
    	spnEl =
			'<div class="input-group">' +
				'<input type="hidden" name="contact-' + id + '-phone2-id" value="' + spnId + '" />' +
				'<input type="tel" id="contact-' + id + '-phone2" class="form-control" name="contact-' + id + '-phone2" placeholder="Primary Phone" value="' + spn + '"/>' +
				'<span class="input-group-addon">Ext.</span>' +
				'<input type="text" id="contact-' + id + '-phone2-ext" class="form-control" name="contact-' + id + '-phone2-ext" placeholder="Extension" value="' + spnExt + '"/>' +
				'<span class="input-group-btn"><button type="button" onclick="deleteInputs(this, \'pn\', \'' + spnId + '\')" class="btn btn-danger"><i class="fa fa-trash"></i></button></span>' +
			'</div>';
	} else {
        spnEl =
            '<div class="input-group">' +
				'<input disabled type="tel" id="contact-' + id + '-phone2" class="form-control" name="contact-' + id + '-phone2" placeholder="Primary Phone" value="' + spn + '"/>' +
				'<span class="input-group-addon">Ext.</span>' +
				'<input disabled type="text" id="contact-' + id + '-phone2-ext" class="form-control" name="contact-' + id + '-phone2-ext" placeholder="Extension" value="' + spnExt + '"/>' +
				'<span class="input-group-btn"><button type="button" onclick="enableField(this, \'pn\')" class="btn btn-success"><i class="fa fa-plus-square-o"></i></button></span>' +
            '</div>';
	}

	var em2El;
    if (em2Id) {
        em2El =
			'<div class="input-group">' +
				'<input type="hidden" name="contact-' + id + '-email2-id" value="' + em2Id + '" />' +
				'<input type="email" class="form-control" name="contact-' + id + '-email2" placeholder="Secondary Email" value="' + em2 + '" />' +
            	'<span class="input-group-btn"><button type="button" onclick="deleteInputs(this, \'em\', \'' + em2Id + '\')" class="btn btn-danger"><i class="fa fa-trash"></i></button></span>' +
			'</div>';
    } else {
        em2El =
            '<div class="input-group">' +
				'<input type="hidden" name="contact-' + id + '-email2-id" value="' + em2Id + '" />' +
				'<input type="email" class="form-control" name="contact-' + id + '-email2" placeholder="Secondary Email" value="' + em2 + '" />' +
				'<span class="input-group-btn"><button type="button" onclick="enableField(this, \'em\')" class="btn btn-success"><i class="fa fa-plus-square-o"></i></button></span>' +
            '</div>';
	}

    var body =
        '<div role="tabpanel" class="tab-pane" id="' + id + '-panel">' +
			'<input type="hidden" name="contact-id-' + id + '" data-contact-id="true" value="' + id +  '" />' +
			'<div class="col-lg-12" style="padding:15px;">' +
				'<div class="clearfix form-section well" style="padding:15px;">' +
					'<div class="col-lg-6 clearfix bottom15">' +
						'<input type="text" class="form-control contact-body" name="contact-' + id + '-first-name" placeholder="First Name" value="' + fName + '"/>' +
					'</div>' +
					'<div class="col-lg-6 clearfix bottom15">' +
						'<input type="text" class="form-control contact-body" name="contact-' + id + '-last-name" placeholder="Last Name" value="' + lName + '"/>' +
					'</div>' +
					'<div class="col-lg-6 clearfix bottom15">' +
						'<div class="input-group">' +
							'<input type="hidden" name="contact-' + id + '-phone1-id" value="' + ppnId + '" />' +
							'<input type="tel" id="contact-' + id + '-phone1" class="form-control contact-body" name="contact-' + id + '-phone1" placeholder="Primary Phone" value="' + ppn + '"/>' +
							'<span class="input-group-addon">Ext.</span>' +
        					'<input type="text" id="contact-' + id + '-phone1-ext" class="form-control contact-body" name="contact-' + id + '-phone1-ext" placeholder="Extension" value="' + ppnExt + '"/>' +
						'</div>' +
					'</div>' +
					'<div class="col-lg-6 clearfix bottom15">' +
						spnEl +
					'</div>' +
					'<div class="col-lg-6 clearfix bottom15">' +
        				'<input type="hidden" name="contact-' + id + '-email1-id" value="' + emId + '" />' +
						'<input type="email" class="form-control contact-body" name="contact-' + id + '-email1" placeholder="Primary Email" value="' + em + '"/>' +
					'</div>' +
					'<div class="col-lg-6 clearfix bottom15">' +
        				em2El +
					'</div>' +
					'<ul class="nav nav-pills">' +
        				'<li title="Save">' +
        					'<a href="javascript:saveScContact()"><i class="fa fa-save"></i></a>' +
        				'</li>' +
        				'<li title="Delete">' +
        					'<a href="javascript:removeSc(' + id + ', ' + isNew + ',' + isPrimary + ')"><i class="fa fa-trash"></i></a>' +
        				'</li>'	+
						makePrimaryButton +
					'</ul>' +
				'</div>' +
			'</div>' +
        '</div>';

    $("#contact-bodies").append(body);
    phoneInput('contact-' + id + '-phone1');
    phoneInput('contact-' + id + '-phone2');

    if (isPrimary)
        $("#" + id + '-panel').append('<input type="hidden" name="contact-action-change-primary" value="' + id + '" />');

    if(isNew)
        $('#' + id + '-panel').append('<input type="hidden" name="contact-action-add[]" value="' + id + '" />');
    else
    	$("#" + id + '-panel').append('<input type="hidden" name="contact-action-update[]" value="' + id + '" />');
}

function clearScForm() {
    $("#first-name").val('');
    $("#last-name").val('');
    $("#phone1").val('');
    $("#phone2").val('');
    $("#email1").val('');
    $("#email2").val('');
}

function removeSc(id, isNew, isPrimary) {
    $("#contact-tabs a[data-id='" + id + "']").parent().remove();
    $("#" + id + '-panel').remove();

    if (!isNew)
    	$("#contact-bodies").append('<input type="hidden" name="contact-action-delete[]" value="' + id + '" />');

    //Promote next contact in list to primary contact
    if (isPrimary) {
    	var next = $("a[onclick^='makePrimary']");
        makePrimary(next);
        var nextId = $(next).parent().parent().parent().parent().parent().find('input[data-contact-id="true"]').val();
        $('#' + nextId + '-panel li[title="Make Primary"]').remove();
        $('#' + nextId + '-panel li[title="Delete"] a').attr('href', 'javascript:removeSc(' + nextId + ', false, true)');
    }
}

function deleteInputs(element, type, id) {
    $(element).parent().parent().find('input[type="text"], input[type="tel"], input[type="email"]').each(function(index,input){
        $(input).val('');
        $(input).attr('disabled', 'disabled');
    });

    $(element).parent().parent().append('<input type="hidden" name="' + type + '-action-delete[]" value="' + id + '" />');
    $(element).removeClass('btn-danger').addClass('btn-success').attr('onclick', 'enableField(this, "' + type + '")');
    $(element).children('i').removeClass('fa-trash').addClass('fa-plus-square-o');
}

function enableField(element, type, contactId) {
    $(element).parent().parent().find('input[type="text"], input[type="tel"], input[type="email"]').each(function(index,input){
        $(input).removeAttr('disabled');
    });
    $(element).parent().parent().append('<input type="hidden" name="' + type + '-action-add-' + contactId + '" value="add" />');
    $(element).parent().remove();
}
