<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Video Player')); ?>

    <link rel="stylesheet" href="assets/libs/plyr/plyr.css">

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>

            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Plugins', 'title' => 'Video Player')); ?>

                <div>
                    <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Preview Video Player</h6>
                            
                                <div class="plyr__video-embed" id="player">
                                    <iframe src="https://www.youtube.com/embed/qYgogv4R8zg?si=_YxUDmc2fDgHyPae" allowfullscreen allowtransparency allow="autoplay"></iframe>
                                </div>
                            </div>
                        </div><!--end card-->
                    </div><!--end grid-->
                </div>
            </div>
            <!-- container-fluid -->
        </div>
        <!-- End Page-content -->

        <?php include 'partials/footer.php'; ?>

    </div>

</div>
<!-- end main content -->

<?php include 'partials/customizer.php'; ?>

<?php include 'partials/vendor-scripts.php'; ?>


<script src="assets/libs/plyr/plyr.min.js"></script>
<script src="assets/js/pages/plugins-video-player.init.js"></script>
<!-- App js -->
<script src="assets/js/app.js"></script>
    
</body>

</html>