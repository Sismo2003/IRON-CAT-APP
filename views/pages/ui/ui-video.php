<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Video')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>
        
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'UI Elements', 'title' => 'Video')); ?>
            
                <div class="grid grid-cols-1 gap-x-4 xl:grid-cols-2">
                    <div>
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Basic</h6>
                                <iframe class="w-full rounded-md aspect-video" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Square</h6>
                                <iframe class="w-full rounded-md aspect-square" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Video - 1/1</h6>
                                <iframe class="w-full rounded-md aspect-1/1" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                    </div>
                    <div>
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Auto</h6>
                                <iframe class="w-full rounded-md aspect-auto" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Video - 4/3</h6>
                                <iframe class="w-full rounded-md aspect-4/3" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Video - 16/9</h6>
                                <iframe class="w-full rounded-md aspect-16/9" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Video - 16/9</h6>
                                <iframe class="w-full rounded-md aspect-21/9" src="https://www.youtube.com/embed/1y_kfWUCFDQ"></iframe>
                            </div>
                        </div><!--end card-->
                    </div>
                </div>
            </div>
            <!-- container-fluid -->
        </div>
        <!-- End Page-wrapper -->

        <?php include 'partials/footer.php'; ?>

    </div>
        
</div>
<!-- end main content -->

<?php include 'partials/customizer.php'; ?>

<?php include 'partials/vendor-scripts.php'; ?>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>