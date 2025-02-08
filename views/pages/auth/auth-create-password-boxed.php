<?php
// Include config file
require_once "partials/config.php";

// Define variables and initialize with empty values
$useremail = $username =  $password = $confirm_password = "";
$useremail_err = $username_err = $password_err = $confirm_password_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Validate useremail
    if (empty(trim($_POST["useremail"]))) {
        $useremail_err = "Please enter useremail.";
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
                    
                    $useremail = trim($_POST["useremail"]);
                } else {
                    $useremail_err = "Useremail something went wrong.";
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            mysqli_stmt_close($stmt);
            
        }
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


    //Validate confirm password

    $password = trim($_POST["password"]);
    if (empty($password)) {
        $confirm_password_err = "Please Confirm enter a password.";
    } elseif (!preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/', $password)) {
        $confirm_password_err = "Password must contain at least one digit, one lowercase letter, and one uppercase letter.";
    } else {
        $confirm_password = trim($_POST["confirm_password"]);
        if (empty($password_err) && ($password != $confirm_password)) {
            $confirm_password_err = "Password did not match.";
        }
    }
    

    // Check input errors before inserting in database
    if (empty($useremail_err) && empty($password_err) && empty($confirm_password_err)) {

        // Prepare an insert statement
        //$sql = "INSERT INTO user (useremail, username, password ,token) VALUES (?, ?, ?, ?)";
        $sql ="UPDATE users SET password = ? WHERE useremail = '$useremail'";

        if ($stmt = mysqli_prepare($link, $sql)) {
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s",  $param_password, );

            // Set parameters
            $param_useremail = $useremail;
            //$param_username = $username;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
            //$param_token = bin2hex(random_bytes(50));
            

            // Attempt to execute the prepared statement
            if (mysqli_stmt_execute($stmt)) {
                
                // Redirect to index page
                header("location: index.php");
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

    <?php includeFileWithVariables('partials/title-meta.php', array('title' => 'Sign In')); ?>

    <?php include 'partials/head-css.php'; ?>

</head>

<body class="flex items-center justify-center min-h-screen px-4 py-16 bg-cover bg-auth-pattern dark:bg-auth-pattern-dark dark:text-zink-100 font-public">

    <div class="mb-0 border-none shadow-none xl:w-2/3 card bg-white/70 dark:bg-zink-500/70">
        <div class="grid grid-cols-1 gap-0 lg:grid-cols-12">
            <div class="lg:col-span-5">
                <div class="!px-12 !py-12 card-body h-full flex flex-col">

                    <div class="my-auto">
                        <div class="text-center">
                            <h4 class="mb-2 text-custom-500 dark:text-custom-500">Set a New Password</h4>
                            <p class="mb-8 text-slate-500 dark:text-zink-200">Your new password should be distinct from any of your prior passwords</p>
                        </div>
                        
                        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                            <div class="mb-3 <?= !empty($useremail_err) ? 'has-error' : ''; ?>">
                                <label for="email-id-field" class="inline-block mb-2 text-base font-medium">Email ID<span class="font-medium text-red-500"><?php echo " *" ?></span></label>
                                <input type="email" id="useremail" name="useremail" name="useremail" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter email">
                                <span class="font-medium text-red-500"><?php echo $useremail_err; ?></span>
                            </div>
                            <div class="mb-3 <?= !empty($password_err) ? 'has-error' : ''; ?>">
                                <label for="passwordInput" class="inline-block mb-2 text-base font-medium">Password<span class="font-medium text-red-500"><?php echo " *" ?></span></label>
                                <input type="password" name="password" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"  placeholder="Password" id="passwordInput">
                                <span class="font-medium text-red-500"><?php echo $password_err; ?></span>
                            </div>
                            <div class="mb-3 <?= !empty($useremail_err) ? 'has-error' : ''; ?>">
                                <label for="passwordConfirmInput" class="inline-block mb-2 text-base font-medium">Confirm Password<span class="font-medium text-red-500"><?php echo " *" ?></span></label>
                                <input type="password" name="confirm_password" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"  placeholder="Confirm password" id="passwordConfirmInput">
                                <span class="font-medium text-red-500"><?php echo $confirm_password_err; ?></span>
                            </div>
                            <div class="flex items-center gap-2">
                                <input id="checkboxDefault1" class="size-4 border rounded-sm appearance-none bg-slate-100 border-slate-200 dark:bg-zink-600/50 dark:border-zink-500 checked:bg-custom-500 checked:border-custom-500 dark:checked:bg-custom-500 dark:checked:border-custom-500 checked:disabled:bg-custom-400 checked:disabled:border-custom-400" type="checkbox" value="">
                                <label for="checkboxDefault1" class="inline-block text-base font-medium align-middle cursor-pointer">Remember me</label>
                            </div>
                            <div class="mt-8">
                                <button type="submit" class="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Reset Password</button>
                            </div>
                            <div class="mt-4 text-center">
                                <p class="mb-0">Hold on, I've got my password... <a href="auth-login-boxed.php" class="underline fw-medium text-custom-500"> Click here </a> </p>
                            </div>
                        </form>
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