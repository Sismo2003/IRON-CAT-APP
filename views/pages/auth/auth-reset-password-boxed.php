<?php
// Include config file
require_once "partials/config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/phpmailer/src/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/src/SMTP.php';

$useremail_err = $msg = "";

// passing true in constructor enables exceptions in PHPMailer
$mail = new PHPMailer(true);
$uri_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri_segments = explode('/', $uri_path);
$actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/$uri_segments[1]";
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $useremail = mysqli_real_escape_string($link, $_POST['useremail']);

    $sql = "SELECT * FROM users WHERE useremail = '$useremail'";
    $query = mysqli_query($link, $sql);
    $emailcount = mysqli_num_rows($query);

    if(empty(trim($_POST["useremail"]))) {
        $useremail_err = "Please enter useremail.";
    }elseif (!filter_var($_POST["useremail"], FILTER_VALIDATE_EMAIL)) {
        $useremail_err = "Invalid email format";
    }elseif ($emailcount) {
        $userdata = mysqli_fetch_array($query);
        $username = $userdata['username'];
        $token = $userdata['token'];

        $subject = "Password Reset";
        $body = "Hi, $username. Click here to reset your password: <br><a href=\"$actual_link/auth-create-password-boxed.php?token=$token\">$actual_link/auth-create-password-boxed.php?token=$token</a>";
        $sender_email = "From: $gmailid";

        try {
            // Server settings
            // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // for detailed debug output
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->Username = $gmailid;
            $mail->Password = $gmailpassword;

            // Sender and recipient settings
            $mail->setFrom($gmailid, $gmailusername);
            $mail->addAddress($useremail, $username);
            $mail->addReplyTo($gmailid, $gmailusername); // to set the reply to

            // Setting the email content
            $mail->IsHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $body;

            $mail->send();
            $msg = "We have emailed your password reset link!";
            // header("location:auth-login.php");
        } catch (Exception $e) {
            $useremail_err =  "Error in sending email. Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        $useremail_err = "No Email Found";
    }
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
                            <h4 class="mb-2 text-custom-500 dark:text-custom-500">Forgot Password?</h4>
                            <p class="mb-8 text-slate-500 dark:text-zink-200">Reset your Tailwick password</p>
                        </div>
                        
                        <?php if (empty($msg)) { ?>
                            <div class="px-4 py-3 mb-6 text-sm text-yellow-500 border border-transparent rounded-md bg-yellow-50 dark:bg-yellow-400/20">
                                Provide your email address, and instructions will be sent to you
                            </div>
                        <?php } ?>

                        <?php if ($msg) { ?>
                            <div class="px-4 py-3 mb-6 text-sm text-green-500 border border-transparent rounded-md bg-green-50 dark:bg-green-400/20">
                                <?php echo $msg; ?>
                            </div>
                        <?php } ?>

                        <form action="<?php echo htmlentities($_SERVER["PHP_SELF"]); ?>" method="post">
                            <div <?= !empty($useremail_err) ? 'has-error' : ''; ?>>
                                <label for="emailInput" class="inline-block mb-2 text-base font-medium">Email<span class="font-medium text-red-500"><?php echo " *" ?></label>
                                <input type="text" name="useremail" class="form-input dark:bg-zink-600/50 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200" placeholder="Enter email" id="emailInput">
                                <span class="font-medium text-red-500"><?php echo $useremail_err; ?></span>
                            </div>
                            <div class="mt-8">
                                <button type="submit" class="w-full text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">Send Reset Link</button>
                            </div>
                            <div class="mt-4 text-center">
                                <p class="mb-0">Wait, I remember my password... <a href="auth-login-boxed.php" class="underline fw-medium text-custom-500"> Click here </a> </p>
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