<?php

// Initialize the session
    session_start();

// Include config file
require_once "partials/config.php";

// Define variables and initialize with empty values
$useremail = $username =  $password = $confirm_password = "";
$useremail_err = $username_err = $password_err = $confirm_password_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validate useremail
    if (empty(trim($_POST["useremail"]))) {
        $useremail_err = "Please enter a useremail.";
    } elseif (!filter_var($_POST["useremail"], FILTER_VALIDATE_EMAIL)) {
        $useremail_err = "Invalid email format";
    } else {
        // Prepare a select statement
        $sql = "SELECT id FROM users WHERE useremail = ?";

        if ($stmt = mysqli_prepare($link, $sql)) {
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_useremail);

            // Set parameters
            $param_useremail = trim($_POST["useremail"]);

            // Attempt to execute the prepared statement
            if (mysqli_stmt_execute($stmt)) {
                /* store result */
                mysqli_stmt_store_result($stmt);

                if (mysqli_stmt_num_rows($stmt) == 1) {
                    $useremail_err = "This useremail is already taken.";
                } else {
                    $useremail = trim($_POST["useremail"]);
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

                // Close statement
                mysqli_stmt_close($stmt);
            
        }
    }

    // Validate username
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter a username.";
    } elseif(strlen(trim($_POST["username"])) >15 ){
        $username_err ="Enter valid username.";
    } else {
        $username = trim($_POST["username"]);
    }

    // Validate password
    $password = trim($_POST["password"]);
    if (empty($password)) {
        $password_err = "Please enter a password.";
    } elseif (!preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/', $password)) {
        $password_err = "Password must contain at least one digit, one lowercase letter, and one uppercase letter.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Check input errors before inserting in database
    if (empty($useremail_err) && empty($username_err) && empty($password_err) && empty($confirm_password_err)) {

        // Prepare an insert statement
        $sql = "INSERT INTO users (useremail, username, password, token) VALUES (?, ?, ?, ?)";

        if ($stmt = mysqli_prepare($link, $sql)) {
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ssss", $param_useremail, $param_username, $param_password , $param_token);

            // Set parameters
            $param_useremail = $useremail;
            $param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
            $param_token = bin2hex(random_bytes(50));

            // Attempt to execute the prepared statement
            if (mysqli_stmt_execute($stmt)) {
                // Redirect to index page
                header("location: auth-login-boxed.php");
            } else {
                echo "Something went wrong. Please try again later.";
            }

            // Close statement
            mysqli_stmt_close($stmt);
        }
    }

    // Close connection
    mysqli_close($link);
}
?>
<?php include 'partials/main.php'; ?>

<head>

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Register')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<body class="flex items-center justify-center min-h-screen px-4 py-16 bg-cover bg-auth-pattern dark:bg-auth-pattern-dark dark:text-zink-100 font-public">

    <div class="mb-0 border-none shadow-none xl:w-2/3 card bg-white/70 dark:bg-zink-500/70">
        <div class="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div class="lg:col-span-5">
                <div class="!px-10 !py-12 card-body">

                    <div class="lg:w-[25rem] mx-auto">
                        <ul class="flex flex-wrap w-full gap-2 text-sm font-medium text-center nav-tabs">
                            <li class="group grow active">
                                <a href="javascript:void(0);" data-tab-toggle data-target="emailTabs" class="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 bg-slate-100 dark:text-zink-200 dark:bg-zink-600 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><i data-lucide="mail" class="inline-block size-4 mr-1"></i> <span class="align-middle">Email</span></a>
                            </li>
                            <li class="group grow">
                                <a href="javascript:void(0);" data-tab-toggle data-target="phoneTabs" class="inline-block px-4 w-full py-2 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 bg-slate-100 dark:text-zink-200 dark:bg-zink-600 border border-transparent group-[.active]:bg-custom-500 dark:group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"><i data-lucide="smartphone" class="inline-block size-4 mr-1"></i> <span class="align-middle">Phone</span></a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <div class="mt-5 tab-content">
                            <div class="block tab-pane" id="emailTabs">
                                <form novalidate action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                                    <div class="mb-3 <?= !empty($useremail_err) ? 'has-error' : ''; ?>">
                                        <label for="email-id-field" class="inline-block mb-2 text-base font-medium">Email ID<span class="font-medium text-red-500"><?php echo " *" ?></span></label>
                                        <input type="email" id="useremail" name="useremail" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter email">
                                        <span class="font-medium text-red-500"><?php echo $useremail_err; ?></span>
                                    </div>
                                    <div class="mb-3 <?= !empty($username_err) ? 'has-error' : ''; ?>">
                                        <label for="username-field" class="inline-block mb-2 text-base font-medium">UserName<span class="font-medium text-red-500"><?php echo " *" ?></label>
                                        <input type="text" id="username" name="username" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter username">
                                        <span class="font-medium text-red-500"><?php echo $username_err; ?></span>
                                    </div>
                                    <div class="mb-3 <?= !empty($password_err) ? 'has-error' : ''; ?>">
                                        <label for="password" class="inline-block mb-2 text-base font-medium">Password<span class="font-medium text-red-500"><?php echo " *" ?></label>
                                        <input type="password" id="password" name="password" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter password">
                                        <span class="font-medium text-red-500"><?php echo $password_err; ?></span>
                                    </div>
                                    <p class="italic text-15 text-slate-500 dark:text-zink-200">By registering you agree to the Tailwick <a href="#!" class="underline">Terms of Use</a></p>
                                    <div class="mt-10">
                                        <button type="submit" class="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Sign Up</button>
                                    </div>
                                </form>
                            </div>
                            
                        </div>
                        <div class="relative text-center my-9 before:absolute before:top-3 before:left-0 before:right-0 before:border-t before:border-t-slate-200 dark:before:border-t-zink-500">
                            <h5 class="inline-block px-4 py-0.5 text-sm bg-white text-slate-500 dark:bg-zink-700 dark:text-zink-200 rounded relative">Create account with</h5>
                        </div>
                    
                        <div class="flex flex-wrap justify-center gap-2">
                            <button type="button" class="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 active:text-white active:bg-custom-600 active:border-custom-600"><i data-lucide="facebook" class="w-4 h-4"></i></button>
                            <button type="button" class="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-orange-500 border-orange-500 hover:text-white hover:bg-orange-600 hover:border-orange-600 focus:text-white focus:bg-orange-600 focus:border-orange-600 active:text-white active:bg-orange-600 active:border-orange-600"><i data-lucide="mail" class="w-4 h-4"></i></button>
                            <button type="button" class="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-sky-500 border-sky-500 hover:text-white hover:bg-sky-600 hover:border-sky-600 focus:text-white focus:bg-sky-600 focus:border-sky-600 active:text-white active:bg-sky-600 active:border-sky-600"><i data-lucide="twitter" class="w-4 h-4"></i></button>
                            <button type="button" class="flex items-center justify-center size-[37.5px] transition-all duration-200 ease-linear p-0 text-white btn bg-slate-500 border-slate-500 hover:text-white hover:bg-slate-600 hover:border-slate-600 focus:text-white focus:bg-slate-600 focus:border-slate-600 active:text-white active:bg-slate-600 active:border-slate-600"><i data-lucide="github" class="w-4 h-4"></i></button>
                        </div>
                    
                        <div class="mt-10 text-center">
                            <p class="mb-0 text-slate-500 dark:text-zink-200">Already have an account ? <a href="auth-login-boxed.php" class="font-semibold underline transition-all duration-150 ease-linear text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500">Login</a> </p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mx-2 mt-2 mb-2 border-none shadow-none lg:col-span-7 card bg-white/60 dark:bg-zink-500/60">
                <div class="!px-10 !pt-10 h-full !pb-0 card-body flex flex-col">
                    <div class="flex items-center justify-between gap-3">
                        <div class="grow">
                            <a href="index">
                                <img src="assets/images/logo-light.png" alt="" class="hidden h-6 dark:block">
                                <img src="assets/images/logo-dark.png" alt="" class="block h-6 dark:hidden">
                            </a>
                        </div>
                        <div class="shrink-0">
                            <div class="relative dropdown text-end">
                                <button type="button" class="inline-flex items-center gap-3 transition-all duration-200 ease-linear dropdown-toggle btn border-slate-200 dark:border-zink-400/60 group/items focus:border-custom-500 dark:focus:border-custom-500" id="dropdownMenuButton" data-bs-toggle="dropdown">
                                    <img src="assets/images/flags/us.svg" alt="" class="object-cover h-5 rounded-full">
                                    <h6 class="text-base font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">English</h6>
                                </button>
            
                                <div class="absolute z-50 hidden p-3 mt-1 text-left list-none bg-white rounded-md shadow-md dropdown-menu min-w-[9rem] flex flex-col gap-3 dark:bg-zink-600" aria-labelledby="dropdownMenuButton">
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/us.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">English</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/es.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Spanish</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/de.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">German</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/fr.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">French</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/jp.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Japanese</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/it.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Italian</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/ru.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Russian</h6>
                                    </a>
                                    <a href="#!" class="flex items-center gap-3 group/items">
                                        <img src="assets/images/flags/ae.svg" alt="" class="object-cover h-4 rounded-full">
                                        <h6 class="text-sm font-medium transition-all duration-200 ease-linear text-slate-600 group-hover/items:text-custom-500 dark:text-zink-200 dark:group-hover/items:text-custom-500">Arabic</h6>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-auto">
                        <img src="assets/images/auth/img-01.png" alt="" class="md:max-w-[32rem] mx-auto">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include 'partials/vendor-scripts.php'; ?>

</body>

</html>