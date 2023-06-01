<?php
session_start();

// Redirect if not logged in
if (!isset($_SESSION['user'])){
    header("Location:login.php");
    exit;
}

$page_title = "Kassa";
$relative_path = "..";
$page_css = array("checkout");
$page_js = array("checkout/checkout", "checkout/input");
include_once("../parts/open.php");
?>
<body>
    <div id="container" class="noselect">
        <div id="calculator">
            <input type="text" id="calc-input" autofocus></input>
            <table id="keypad">
                <tr>
                    <td class="keybutton">1</td>
                    <td class="keybutton">2</td>
                    <td class="keybutton">3</td>
                    <td class="keybutton"><</td>
                    <td></td>
                </tr>
                <tr>
                    <td class="keybutton">4</td>
                    <td class="keybutton">5</td>
                    <td class="keybutton">6</td>
                    <td class="keybutton">C</td>
                    <td></td>
                </tr>
                <tr>
                    <td class="keybutton">7</td>
                    <td class="keybutton">8</td>
                    <td class="keybutton">9</td>
                    <td class="keybutton">0</td>
                </tr>
            </table>
        </div>
        <div id="products">
            <div id="product-display">
                <h3>Producten</h3>
                <div id="table-container">
                    <table id="product-table">
                        <tr>
                            <th>Naam</th>
                            <th>Eenheid</th>
                            <th>Prijs</th>
                            <th>Aantal</th>
                        </tr>
                        <tbody id="product-content">
                            <tr>
                                <td>TestNaam</td>
                                <td>TestEenheid</td>
                                <td>TestPrijs</td>
                                <td>TestAantal</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h3 id="total-price">TotaalPrijs</h3>
            </div>
            <div id="product-actions">
                <div>
                    <input type="button" class="button-action" id="addbutton" value="+">
                    <input type="button" class="button-action" id="removebutton" value="-">
                </div>
                <div>
                    <input type="button" class="button-action" id="nextbutton" value="Afrekenen">
                </div>
            </div>
        </div>
    </div>
</body>
</html>