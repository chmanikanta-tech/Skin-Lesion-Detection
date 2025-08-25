$(document).ready(function() {
    // Handle form submission
    $('#upload-form').on('submit', function(e) {
        e.preventDefault();
        
        const fileInput = $('#image-upload')[0];
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('Please select an image file.');
            return;
        }
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        // Show loader
        $('#loader').removeClass('d-none');
        $('#result-container').addClass('d-none');
        
        // Send AJAX request
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                displayResults(response);
            },
            error: function(xhr) {
                let errorMsg = 'An error occurred during processing.';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                alert(errorMsg);
                $('#loader').addClass('d-none');
            }
        });
    });
    
    // Display results
    function displayResults(data) {
        // Hide loader
        $('#loader').addClass('d-none');
        
        // Set image source
        $('#uploaded-image').attr('src', data.filepath);
        
        // Set prediction text
        $('#prediction-text').text(data.prediction);
        
        // Set confidence
        const confidencePercent = data.confidence.toFixed(2);
        $('#confidence-text').text(confidencePercent);
        
        // Update progress bar
        const confidenceBar = $('#confidence-bar');
        confidenceBar.css('width', confidencePercent + '%');
        confidenceBar.attr('aria-valuenow', confidencePercent);
        
        // Set color of progress bar based on confidence
        if (confidencePercent < 50) {
            confidenceBar.removeClass('bg-success bg-warning').addClass('bg-danger');
        } else if (confidencePercent < 75) {
            confidenceBar.removeClass('bg-success bg-danger').addClass('bg-warning');
        } else {
            confidenceBar.removeClass('bg-warning bg-danger').addClass('bg-success');
        }
        
        // Show result container
        $('#result-container').removeClass('d-none');
    }
});