<form action="signup_process.php" method="POST" enctype="multipart/form-data">
    <input type="text" name="username" placeholder="আপনার নাম" required>
    
    <label>প্রোফাইল ফটো সিলেক্ট করুন:</label>
    <input type="file" name="profile_image" accept="image/*" required>
    
    <button type="submit" name="signup">সাইন আপ</button>
</form>
