<?php
// Capturamos la categoría de la URL
$categoria = isset($_GET['categoria']) ? $_GET['categoria'] : '';

if ($categoria != '') {
    // Si hay una categoría, filtramos en la base de datos
    $sql = "SELECT * FROM vacantes WHERE categoria = '$categoria'";
} else {
    // Si no hay categoría, mostramos todas
    $sql = "SELECT * FROM vacantes";
}
// ... luego ejecutas la consulta y muestras los resultados