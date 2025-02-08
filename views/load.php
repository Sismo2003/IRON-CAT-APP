<?php
##### SESSION PHP #####
// Initialize the session
//session_start();

// Check if the user is logged in, if not then redirect him to login page
// if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
//      header("location: auth-login.php");
//     exit;
//  }

include './pages/engine/main.php';
$title = 'Dashboard';
?>



<!DOCTYPE html>
<html lang="en" class="light scroll-smooth group"  data-layout="vertical" data-sidebar="light" data-sidebar-size="lg" data-mode="light" data-topbar="light" data-skin="default" data-navbar="sticky" data-content="fluid" dir="ltr">

    <head>
        <meta charset="utf-8">
        <title><?= ($title) ? $title : '' ?> | Tailwick - Admin & Dashboard Template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <meta content="Minimal Admin & Dashboard Template" name="description">
        <meta content="Themesdesign" name="author">
        <!-- App favicon -->
        <link rel="shortcut icon" href="../assets/images/favicon.ico">

        <!-- Layout config Js -->
        <script src="../assets/js/layout.js"></script>
        <!-- Icons CSS -->
        <link rel="stylesheet" href="../assets/css/icons.css">
        <!-- Flatpickr -->
        <link rel="stylesheet" href="../assets/libs/flatpickr/flatpickr.min.css">
        <!--choices -->
        <link rel="stylesheet" href="../assets/libs/choices.js/public/assets/styles/choices.min.css">
        <!-- Tailwind CSS -->
        <link rel="stylesheet" href="../assets/css/tailwind2.css">


    </head>
    <body class="text-base bg-body-bg text-body font-public dark:text-zink-100
        dark:bg-zink-800 group-data-[skin=bordered]:bg-body-bordered group-data-[skin=bordered]:dark:bg-zink-700">

        <div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

            <?php include './pages/menu/sidebar.php'; ?>
            <?php include './pages/menu/topbar.php'; ?>

            <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

                <div class="group-data-[sidebar-size=lg]:ltr:md:ml-vertical-menu group-data-[sidebar-size=lg]:rtl:md:mr-vertical-menu group-data-[sidebar-size=md]:ltr:ml-vertical-menu-md group-data-[sidebar-size=md]:rtl:mr-vertical-menu-md group-data-[sidebar-size=sm]:ltr:ml-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:mr-vertical-menu-sm pt-[calc(theme('spacing.header')_*_1)] pb-[calc(theme('spacing.header')_*_0.8)] px-4 group-data-[navbar=bordered]:pt-[calc(theme('spacing.header')_*_1.3)] group-data-[navbar=hidden]:pt-0 group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl group-data-[layout=horizontal]:px-0 group-data-[layout=horizontal]:group-data-[sidebar-size=lg]:ltr:md:ml-auto group-data-[layout=horizontal]:group-data-[sidebar-size=lg]:rtl:md:mr-auto group-data-[layout=horizontal]:md:pt-[calc(theme('spacing.header')_*_1.6)] group-data-[layout=horizontal]:px-3 group-data-[layout=horizontal]:group-data-[navbar=hidden]:pt-[calc(theme('spacing.header')_*_0.9)]">
                    <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
                        <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Dashboards', 'title' => 'Ecommerce')); ?>


                        <!-- MAIN CONTEINER -->
                        <div class="m-2" id="mainConteiner">

                        </div>
                    </div>
                </div>
                <!-- container-fluid -->
            </div>
            <!-- End Page-content -->

            <!-- Footer -->
            <footer class="ltr:md:left-vertical-menu rtl:md:right-vertical-menu group-data-[sidebar-size=md]:ltr:md:left-vertical-menu-md group-data-[sidebar-size=md]:rtl:md:right-vertical-menu-md group-data-[sidebar-size=sm]:ltr:md:left-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:md:right-vertical-menu-sm absolute right-0 bottom-0 px-4 h-14 group-data-[layout=horizontal]:ltr:left-0  group-data-[layout=horizontal]:rtl:right-0 left-0 border-t py-3 flex items-center dark:border-zink-600">
                <div class="group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl w-full">
                    <div class="grid items-center grid-cols-1 text-center lg:grid-cols-2 text-slate-400 dark:text-zink-200 ltr:lg:text-left rtl:lg:text-right">
                        <div>
                            <script>document.write(new Date().getFullYear())</script> © Tailwick.
                        </div>
                        <div class="hidden lg:block">
                            <div class="ltr:text-right rtl:text-left">
                                Design & Develop by Themesdesign
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>

        <div id="loading-screen" class="fixed  top-0 left-0 w-full h-full bg-black bg-opacity-50 hidden items-center justify-center z-[9999]">
            <img width="150px" src="../assets/loader/loader1.gif" alt="Cargando...">
        </div>
    </body>


    <!--apexchart js-->
    <script src="../assets/libs/apexcharts/apexcharts.min.js"></script>

    <!--dashboard ecommerce init js-->
    <script src="../assets/js/pages/dashboards-ecommerce.init.js"></script>

    <!-- App js del template -->
    <script src="../assets/js/app.js"></script>

    <script src="./app.js"></script>



</html>