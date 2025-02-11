<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Heatmap Chart')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>

            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Apexcharts', 'title' => 'Heatmap Chart')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Basic</h6>
                            <div id="basicHeatmap" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Multiple Colors</h6>
                            <div id="multipleColorsHeatmap" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-purple-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Color Range</h6>
                            <div id="ColorsRangeHeatmap" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-purple-500", "bg-orange-500", "bg-yellow-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Rounded (Range without Shades)</h6>
                            <div id="RoundedRangeHeatmap" class="apex-charts" data-chart-colors='["bg-sky-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                </div><!--end grid-->

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

<!-- apexcharts js -->
<script src="assets/libs/apexcharts/apexcharts.min.js"></script>

<!-- heatmap init js-->
<script src="assets/js/pages/apexcharts-heatmap.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>