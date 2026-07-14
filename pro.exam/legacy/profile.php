<?php
// ডাটাবেজ কানেকশন
$conn = mysqli_connect("localhost", "username", "password", "database_name");

// ধরি ইউজার আইডি ১ এর প্রোফাইল দেখাবো
$sql = "SELECT * FROM users WHERE id = 1"; 
$result = mysqli_query($conn, $sql);
$user = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html>
<body>
    <h1>আপনার প্রোফাইল</h1>
    <p>নাম: <?php echo $user['username']; ?></p>
    
    <img src="uploads/<?php echo $user['profile_pic']; ?>" width="200" alt="Profile Photo">
</body>
</html>
