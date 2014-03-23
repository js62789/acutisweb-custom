$('#contactus form').submit(function(e){
  var $name = $(this).find('[name=name]');
  var $phone = $(this).find('[name=phone]');
  var $email = $(this).find('[name=email]');
  var $description = $(this).find('[name=description]');

  if (!$name.val() ||!$phone.val() ||!$email.val() ||!$description.val()) {
    $('.error').text('Please complete all fields before submitting your inquiry.');
    e.preventDefault();
  }
});
