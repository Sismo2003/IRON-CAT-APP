<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Scatter Charts')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>

            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Apexcharts', 'title' => 'Scatter Charts')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Basic</h6>
                            <div id="basicScatter" class="apex-charts" data-chart-colors='["bg-custom-500","bg-green-500", "bg-yellow-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Scatter – Datetime</h6>
                            <div id="scatterDatetime" class="apex-charts" data-chart-colors='["bg-custom-500","bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Scatter – Images</h6>
                            <div id="scatterImages" class="apex-charts" data-chart-colors='["bg-custom-500","bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                </div><!--end grid-->

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

<!-- apexcharts js -->
<script src="assets/libs/apexcharts/apexcharts.min.js"></script>

<!-- Scatter init js-->
<script src="assets/js/pages/apexcharts-scatter.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>