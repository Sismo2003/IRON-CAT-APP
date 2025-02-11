<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Scroll Hint')); ?>

    <link rel="stylesheet" href="https://unpkg.com/scroll-hint@latest/css/scroll-hint.css">

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>

<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">

    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">

        <?php include 'partials/page-wrapper.php'; ?>
        
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'Plugins', 'title' => 'Scroll Hint')); ?>

                <div>
                    <div class="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
                        <div class="card">
                            <div class="card-body">
                                <h6 class="mb-4 text-15">Simple Scroll Hint</h6>
                                <div class="overflow-x-auto js-scrollable">
                                    <table class="w-full flex-nowrap">
                                        <thead class="ltr:text-left rtl:text-right">
                                            <tr>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">ID</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Name</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Position</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Office</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Age</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Start date</th>
                                                <th class="px-3.5 py-2.5 whitespace-nowrap font-semibold border-b border-slate-200 dark:border-zink-500">Salary</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">1</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Tiger Nixon</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">System Architect</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Edinburgh</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">61</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2011-04-25</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$320,800</td>
                                            </tr>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Garrett Winters</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Accountant</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Tokyo</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">63</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2011-07-25</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$170,750</td>
                                            </tr>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">3</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Ashton Cox</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Junior Technical Author</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">San Francisco</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">66</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2009-01-12</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$86,000</td>
                                            </tr>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">4</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Cedric Kelly</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Senior Javascript Developer</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Edinburgh</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">22</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2012-03-29</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$433,060</td>
                                            </tr>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">5</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Airi Satou</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Accountant</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Tokyo</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">33</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2008-11-28</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$162,700</td>
                                            </tr>
                                            <tr>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">6</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Brielle Williamson</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">Integration Specialist</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">New York</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">61</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">2012-12-02</td>
                                                <td class="px-3.5 py-2.5 whitespace-nowrap border-y border-slate-200 dark:border-zink-500">$372,000</td>
                                            </tr>
                                        </tbody>
                                    </table>
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
<script src="assets/libs/scroll-hint/js/scroll-hint.min.js"></script>
<script src="assets/js/pages/plugins-scroll-hint.init.js"></script>

<!-- App js -->
<script src="assets/js/app.js"></script>
    
</body>

</html>