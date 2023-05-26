<?php 
include_once("parts/open.php"); 
?>
<body>
    <div class="flex-center">
        <div style="text-align: center;">
            <p><?php echo $page_message ?? "" ?></p>
            <a href='logout.php' class='button-quiet'>Uitloggen</a>
        </div>
    </div>
</body>
</html>