<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Leaflet')); ?>

    <!-- leaflet Css -->
    <link href="assets/libs/leaflet/leaflet.css" rel="stylesheet" type="text/css">

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>

            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Maps', 'title' => 'Leaflet')); ?>

                <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Example</h6>
                            <div id="leaflet-map" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Markers, Circles and Polygons</h6>
                            <div id="leaflet-map-marker" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Working with Popups</h6>
                            <div id="leaflet-map-popup" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Markers with Custom Icons</h6>
                            <div id="leaflet-map-custom-icons" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Interactive Choropleth Map</h6>
                            <div id="leaflet-map-interactive-map" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-gray-800 text-15 dark:text-white">Layer Groups and Layers Control</h6>
                            <div id="leaflet-map-group-control" class="leaflet-map"></div>
                        </div>
                    </div><!--end card-->
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

<!-- leaflet plugin -->
<script src="assets/libs/leaflet/leaflet.js"></script>

<!-- leaflet map.init -->
<script src="assets/js/pages/leaflet-us-states.js"></script>
<script src="assets/js/pages/leaflet-map.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>

</body>

</html>