<?php
$file = 'counter.txt';

// Create the file if it doesn't exist
if (!file_exists($file)) {
    file_put_contents($file, '0');
}

// Read current count
$count = (int) file_get_contents($file);

// Increment
$count++;

// Write back new count
file_put_contents($file, $count);

// Return it to browser
echo $count;
?>
