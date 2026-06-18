
document.getElementById('ajouter').addEventListener('click', function(event) {
  event.preventDefault(); 
  var id_user = this.getAttribute('data-commentaireid'); 
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'insert_relation.php?id=' + id_user);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
    }
  };
  xhr.send();
});

    $(document).ready(function(){
        loadComments();
    });

    function loadComments() {
        var commentaireId = $('#ajouter').data('commentaireid');
        $.ajax({
            url: 'load_likes.php?comment_id=' + commentaireId,
            type: 'GET',
            success: function(data) {
                $('#likeCount').html(data);
            }
        });
    }

    setInterval(function(){ loadComments(); }, 1);
