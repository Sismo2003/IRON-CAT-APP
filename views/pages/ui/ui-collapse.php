<?php include 'partials/session.php'; ?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Collapse')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<?php include 'partials/body.php'; ?>


<div class="group-data-[sidebar-size=sm]:min-h-sm group-data-[sidebar-size=sm]:relative">
    
    <?php include 'partials/menu.php'; ?>

    <div class="relative min-h-screen group-data-[sidebar-size=sm]:min-h-sm">
    
        <?php include 'partials/page-wrapper.php'; ?>
            
            <div class="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">

                <?php includeFileWithVariables('partials/page-title.php', array('pagetitle' => 'UI Elements', 'title' => 'Collapse')); ?>

                <div>
                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Default</h6>

                            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div class="collapsible">
                                    <button class="flex text-white collapsible-header group/item btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                        Collapsible Button
                                        <div class="ltr:ml-2 rtl:mr-2 shrink-0">
                                            <i data-lucide="chevron-down" class="hidden size-4 group-[.show]/item:inline-block"></i>
                                            <i data-lucide="chevron-up" class="inline-block size-4 group-[.show]/item:hidden"></i>
                                        </div>
                                    </button>
                                    <div class="hidden mt-2 mb-0 collapsible-content card">
                                        <div class="card-body">
                                            <p>For that very reason, I went on a quest and spoke to many different professional graphic designers and asked them what graphic design tips they live. You've probably heard that opposites attract. The same is true for fonts. Don't be afraid to combine font styles that are different but complementary, like sans serif with serif, short with tall, or decorative with simple. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco.</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="collapsible">
                                    <button class="flex text-white collapsible-header group/item btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
                                        Collapsible Button
                                        <div class="ltr:ml-2 rtl:mr-2 shrink-0">
                                            <i data-lucide="chevron-down" class="hidden size-4 group-[.show]/item:inline-block"></i>
                                            <i data-lucide="chevron-up" class="inline-block size-4 group-[.show]/item:hidden"></i>
                                        </div>
                                    </button>
                                    <div class="hidden mt-2 mb-0 collapsible-content card">
                                        <div class="card-body">
                                            <p>For that very reason, I went on a quest and spoke to many different professional graphic designers and asked them what graphic design tips they live. You've probably heard that opposites attract. The same is true for fonts. Don't be afraid to combine font styles that are different but complementary, like sans serif with serif, short with tall, or decorative with simple. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!--end card-->

                    <div class="card">
                        <div class="card-body">
                            <h6 class="mb-4 text-15">Link Collapse</h6>
                            <div class="collapsible">
                                <a href="#!" class="flex bg-white border-white collapsible-header group/item text-custom-500 btn hover:text-custom-700 focus:text-custom-700 active:text-custom-700 dark:bg-zink-700 dark:border-zink-700">
                                    Collapsible Link
                                </a>
                                <div class="hidden mt-2 mb-0 collapsible-content card">
                                    <div class="card-body">
                                        <p>For that very reason, I went on a quest and spoke to many different professional graphic designers and asked them what graphic design tips they live. You've probably heard that opposites attract. The same is true for fonts. Don't be afraid to combine font styles that are different but complementary, like sans serif with serif, short with tall, or decorative with simple. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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