<?php

use chums\ui\WebUI2;
use chums\user\Groups;
use chums\ui\CSSOptions;

require_once ("autoload.inc.php");

$ui = new WebUI2([
    'requiredRoles' => [Groups::PRODUCTION],
    'title' => 'Work Ticket Shipping Manifest',
//    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php',
]);
$ui->addCSS('public/styles.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->addManifestJSON('public/js/manifest.json')
    ->render();
