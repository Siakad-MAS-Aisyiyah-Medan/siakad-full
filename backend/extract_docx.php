<?php
$file = 'D:\\Tugas Akhir\\Pengujian Black Box Sistem Informasi Akademik.docx';
$zip = new ZipArchive;
if ($zip->open($file) === TRUE) {
    $xml = $zip->getFromName('word/document.xml');
    $zip->close();
    $text = strip_tags($xml);
    $text = preg_replace('/\s+/', ' ', $text);
    file_put_contents('D:\\Tugas Akhir\\SIAKAD\\backend\\docx_output.txt', $text);
    echo "Saved to docx_output.txt, length: " . strlen($text);
} else {
    echo 'Failed to open docx file';
}
