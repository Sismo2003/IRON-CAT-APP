<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Candlstick Charts')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>
        
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Apexcharts', 'title' => 'Candlstick Charts')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Simple</h6>
                            <div id="basicChart" class="apex-charts" data-chart-colors='["bg-green-500", "bg-red-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Candlestick Synced with Brush Chart (Combo)</h6>
                            <div>
                                <div id="combo_candlestick" data-chart-colors='["bg-sky-500", "bg-orange-500"]' class="apex-charts" dir="ltr"></div>
                                <div id="combo_candlestick_chart" data-chart-colors='["bg-yellow-500", "bg-red-500"]' class="apex-charts" dir="ltr"></div>
                            </div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Category x-axis</h6>
                            <div id="categoryCandlestick" class="apex-charts" data-chart-colors='["bg-green-500", "bg-red-500", "bg-sky-500"]' dir="ltr"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Candlestick with Line</h6>
                            <div id="candlestickWithLine" class="apex-charts" data-chart-colors='["bg-green-500", "bg-red-500"]' dir="ltr"></div>
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

<script src="https://apexcharts.com/samples/assets/ohlc.js"></script>
<!-- for Category x-axis chart -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.8.17/dayjs.min.js"></script>

<!-- candlstick init js-->
<script src="assets/js/pages/apexcharts-candlstick.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>