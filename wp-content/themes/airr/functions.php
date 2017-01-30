<?php

define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );

function my_theme_enqueue_styles() {

    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );


    wp_enqueue_style( 'child-style', get_stylesheet_directory_uri() . '/style.css',

        array( $parent_style ),

        wp_get_theme()->get('Version')

    );

}

add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

// Add upload support for different file types
 function add_mime_types($mime_types){

	$mime_types['svg'] = 'image/svg+xml'; // Adding svg support
	$mime_types['epub'] = 'application/epub+zip'; // Adding epub support
	$mime_types['mobi'] = 'application/x-mobipocket-ebook'; // Adding mobi support
	$mime_types['cad'] = 'application/epub+zip'; // Adding cad support
	$mime_types['prn'] = 'text/plain'; // Adding prn support
	$mime_types['stl'] = 'application/sla'; // Adding stl support

	return $mime_types;
}
add_filter('upload_mimes', 'add_mime_types', 1, 1);

// Make sure custom post types display in category and tag pages
function show_cpt_archives( $query ) {
 if( is_category() || is_tag() || is_author() || is_tax() && empty( $query->query_vars['suppress_filters'] ) ) {
 	$query->set( 'post_type', array(
 		'post', 'book', 'concept'
 ));
 return $query;
 }
}
add_filter( 'pre_get_posts', 'show_cpt_archives' );

// Add footer widget
function custom_widgets_init() {

	register_sidebar( array(
		'name'          => 'Footer Widget',
		'id'            => 'footer_widget',
		'before_widget' => '<div class="footer-widget">',
		'after_widget'  => '</div>',
		'before_title'  => '<h2>',
		'after_title'   => '</h2>',
	) );

}
add_action( 'widgets_init', 'custom_widgets_init' );

// Calculate book and concept modalities from their associated resources
$RECURSIVE_SAVE_FLAG = false;
function recalculateBookModalities($book) {
global $RECURSIVE_SAVE_FLAG;
//error_log("recalculateBookModalities: $RECURSIVE_SAVE_FLAG");
if($RECURSIVE_SAVE_FLAG)
return;

wp_set_object_terms($book->id(), '', 'modality', false);
$concepts = $book->field('concepts');

if($concepts) {
foreach($concepts as $concept) {
//error_log("gettype(book.concept) = ".gettype($concept));
$terms = termsToIDs(get_the_terms((int)$concept['ID'], 'modality'));
wp_set_object_terms($book->id(), $terms ? $terms : "", 'modality', true);
}
}

$resources = $book->field('resources');
if($resources) {
foreach($resources as $resource) {
//error_log("gettype(book.resource) = ".gettype($resource));
$terms = termsToIDs(get_the_terms((int)$resource['ID'], 'modality'));
wp_set_object_terms($book->id(), $terms ? $terms : "", 'modality', true);
}
}

$RECURSIVE_SAVE_FLAG = true;
$book->save();
$RECURSIVE_SAVE_FLAG = false;
}

function recalculateConceptModalities($concept, $delete=false) {
global $RECURSIVE_SAVE_FLAG;
error_log("recalculateConceptModalities: $RECURSIVE_SAVE_FLAG $delete");

if($RECURSIVE_SAVE_FLAG)
return;

if(!$delete) {
wp_set_object_terms($concept->id(), '', 'modality', false);
$description = "";
$sources = "";

$resources = $concept->field('resources');
if($resources) {
foreach($resources as $resource) {
//error_log("gettype(concept.resource) = ".gettype($resource));
$terms = termsToIDs(get_the_terms((int)$resource['ID'], 'modality'));
wp_set_object_terms($concept->id(), $terms ? $terms : "", 'modality', true);
$description .= get_post_meta($resource['ID'], 'description', true)." ";
$sources .= get_post_meta($resource['ID'], 'source', true)." ";
}
}
}

$books = null;
if($delete)
$books = $concept->fields['books'];
else
$books = $concept->field('books');

if($books) {
foreach($books as $book) {
//error_log("gettype(concept.book) = ".gettype($book));
recalculateBookModalities(pods('book', (int)$book['ID']));
}
}

if(!$delete) {
$RECURSIVE_SAVE_FLAG = true;
//error_log("description = $description ...");
$concept->save(array('description' => $description, 'sources' => $sources));
$RECURSIVE_SAVE_FLAG = false;
}
}

function recalculateResourceModalities($resource, $delete=false) {
error_log("recalculateResourceModalities: $delete");

$concepts = null;
if($delete)
$concepts = $resource->fields['concepts'];
else
$concepts = $resource->field('concepts');

error_log("concepts: $concepts");

if($concepts) {
foreach($concepts as $concept) {
error_log("gettype(resource.concept) = ".gettype($concept));
recalculateConceptModalities(pods('concept', (int)$concept['ID']));
}
}

$books = null;
if($delete)
$books = $resource->fields['books'];
else
$books = $resource->field('books');

if($books) {
foreach($books as $book) {
//error_log("gettype(resource.book) = ".gettype($book));
recalculateBookModalities(pods('book', (int)$book['ID']));
}
}
}

function termsToIDs($terms) {
if(!$terms)
return false;

$ids = [];
foreach($terms as $term) {
$ids[] = $term->term_id;
}
//error_log("returning ids: ".join('|', $ids));
return $ids;
}

add_filter('pods_api_post_save_pod_item', 'recalculateModalities', 10, 3);
function recalculateModalities($pieces, $is_new_item, $id) { 
$type = $pieces['params']->pod;
if ($type == 'book') { 
recalculateBookModalities(pods('book', $id));
}
elseif ($type == 'concept') { 
recalculateConceptModalities(pods('concept', $id));
}
elseif ($type == 'resource') { 
recalculateResourceModalities(pods('resource', $id));
}
return true;
}

add_filter('pods_api_post_delete_pod_item', 'recalculateModalitiesOnDelete', 10, 2);
function recalculateModalitiesOnDelete($params, $pod) {
$type = $params->pod;

if ($type == 'concept') {
recalculateConceptModalities($pod, true);
}
elseif($type == 'resource') {
recalculateResourceModalities($pod, true);
}

return true;
}
