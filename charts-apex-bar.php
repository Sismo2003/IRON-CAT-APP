<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Bar Charts')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>
        
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Apexcharts', 'title' => 'Bar Charts')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Basic</h6>
                            <div id="basicBar" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Grouped Chart</h6>
                            <div id="GroupedChart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Stacked Bar</h6>
                            <div id="stackedChart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500", "bg-orange-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Stacked Bars 100</h6>
                            <div id="stackedBar100Chart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500", "bg-orange-500", "bg-yellow-500", "bg-purple-500", "bg-red-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Grouped Stacked Bars</h6>
                            <div id="groupedStackedChart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500", "bg-custom-300", "bg-green-300"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Bar with Negative Values</h6>
                            <div id="negativeValuesChart" class="apex-charts" data-chart-colors='["bg-red-500", "bg-sky-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Bar with Markers</h6>
                            <div id="markersChart" class="apex-charts" data-chart-colors='["bg-green-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Reversed Bar Chart</h6>
                            <div id="reversedChart" class="apex-charts" data-chart-colors='["bg-custom-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Custom DataLabels Bar</h6>
                            <div id="customDataLabelsChart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-sky-500", "bg-yellow-500", "bg-red-500", "bg-purple-500", "bg-slate-300", "bg-slate-800", "bg-emerald-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Patterned Bar</h6>
                            <div id="patternedChart" class="apex-charts" data-chart-colors='["bg-custom-500", "bg-green-500", "bg-orange-500", "bg-yellow-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Bar with Images</h6>
                            <div id="barWithImagesChart" class="apex-charts" dir="ltr"></div>
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

<!-- barcharts init js-->
<script src="assets/js/pages/apexcharts-bar.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>