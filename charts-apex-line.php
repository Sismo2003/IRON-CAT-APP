<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Apexcharts')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>

            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Apexcharts', 'title' => 'Apexcharts')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Basic</h6>
                            <div id="chartLine" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Line with Data Labels</h6>
                            <div id="lineWithDataLabel" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Zoomable Timeseries</h6>
                            <div id="zoomableTimeseries" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Line Chart with Annotations</h6>
                            <div id="lineWithAnnotations" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Brush Chart</h6>
                            <div>
                                <div id="brushChartLine" class="apex-charts" data-chart-colors='["bg-slate-600"]' dir="ltr"></div>
                                <div id="brushChartLine2" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                            </div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Stepline</h6>
                            <div id="chartStepline" class="apex-charts" data-chart-colors='["bg-yellow-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Gradient Charts</h6>
                            <div id="gradientCharts" class="apex-charts" data-chart-colors='["bg-purple-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Missing / Null Values</h6>
                            <div id="missingCharts" class="apex-charts" data-chart-colors='["bg-green-500", "bg-sky-500", "bg-yellow-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Dashed Charts</h6>
                            <div id="dashedCharts" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Realtime Charts</h6>
                            <div id="realtimeCharts" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
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

<script src="assets/libs/apexcharts/apexcharts.min.js"></script>

<script src="https://apexcharts.com/samples/assets/stock-prices.js"></script>

<script src="assets/js/pages/apexcharts-line.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>