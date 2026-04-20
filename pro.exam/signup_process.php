<?php
// ডাটাবেজ কানেকশন এখানে থাকবে...

if(isset($_POST['signup'])) {
    $username = $_POST['username'];
    $image_name = $_FILES['profile_image']['name'];
    $tmp_name = $_FILES['profile_image']['tmp_name'];
    $upload_folder = "uploads/" . $image_name; // 'uploads' নামে একটি ফোল্ডার বানিয়ে নিন

    // ফটোটি ফোল্ডারে পাঠানো হচ্ছে
    if(move_uploaded_file($tmp_name, $upload_folder)) {
        // ডাটাবেজে শুধু নাম সেভ করুন
        $sql = "INSERT INTO users (username, profile_pic) VALUES ('$username', '$image_name')";
        mysqli_query($conn, $sql);
        echo "সাইন আপ সফল!";
    } else {
        echo "ফটো আপলোড ব্যর্থ!";
    }
}
?>
