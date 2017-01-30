<?php
/**
 * The template part for displaying single posts
 *
 * @package WordPress
 * @subpackage Twenty_Sixteen
 * @since Twenty Sixteen 1.0
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

		<?php
			the_content(); ?>
			<div class="info">
			<?php
			twentysixteen_post_thumbnail();
			$pods = pods();
				echo '<div class="subjects"><h2>Subjects</h2><p class="subject">' . get_the_term_list( $post->ID, 'subject','',', ',''  ) . '</p></div>';
				echo '<div class="languages"><h2>Languages</h2><p class="languages">' . get_the_term_list( $post->ID, 'language','',', ',''  ) . '</p></div>';
				// echo '<h2>Target Ages</h2><p class="target-ages">' . get_the_term_list( $post->ID, 'target_ages','',', ','' ) . '</p>';
				// echo '<h2>Target Grades</h2><p class="target-grades">' . get_the_term_list( $post->ID, 'target_grade','',', ','' ) . '</p>';
				// echo '<h2>Category</h2><p class="category">'. get_the_category_list( '',', ',''  ) . '</p>';
				echo '<div class="tags"><h2>Tags</h2><p class="tags">' . get_the_tag_list('',', ','' ) . '</p></div>';
			?>
			</div>
			<div class="downloadable-resources">
			<h2>Downloadable Resources</h2>
			<?php

				//get Pods object for current post
				$pod = pods( 'concept', get_the_id() );
				$resources = $pod->field( 'resources' );

				//loop through related field
					//only if there is anything to loop through
					if ( ! empty( $resources ) ) {
						echo '<div class="associated-resources">';

									foreach ( $resources as $res ) { 
										// Get id for resource and put in variable $id
										$id = $res[ 'ID' ];
										
										// Get modality of resource
										$modalities = get_the_terms( $id, 'modality' );
										if ( $modalities && ! is_wp_error( $modalities ) ) :
												$modality_list = array();
										 	foreach ( $modalities as $modality ) {
										        $modality_list[] = $modality->name;
										    }

										    $the_modality_list = join( ", ", $modality_list );
										endif;
										


										echo '<div class="resource">';
										echo '<h3 class="resource-title">' . $the_modality_list .': '. get_the_title( $id ) . '</h2>';
										global $post;
										$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($id), 'medium'); 
										echo '<img src="' . $thumb[0] . '" alt="" class="resource-image" />';
										echo '<div class="resource-description">'. get_post_meta( $id, 'description', true ) . '</div>';

										// Citation
										echo '<div class="citation-block">';
										echo '<h4 class="screen-reader-text">Citation</h4>';
										echo '<div class="citation">'. get_post_meta( $id, 'citation', true ) . '</div>';
										echo '</div>';

										// Download Resource
										echo '<div class="download">';
										echo '<h4 class="screen-reader-text">Download</h4>';
										echo '<p><a class="button" href="' . get_post_meta( $id, 'download_link', true ) . '">Download<span class="screen-reader-text"> ' . get_the_title( $id ) . '</span></a>';

										// Get the source of the resource
										echo ' from <span class="source">' . get_post_meta( $id, 'source', true ) . '</span></p>';
										echo '</div>';

										// Close out individual resource div
										echo '</div>';

									} //end of foreach

								// Close out downloadable resource list div
								echo '</div>';

					} //endif ! empty ( $related )

			wp_link_pages( array(
				'before'      => '<div class="page-links"><span class="page-links-title">' . __( 'Pages:', 'twentysixteen' ) . '</span>',
				'after'       => '</div>',
				'link_before' => '<span>',
				'link_after'  => '</span>',
				'pagelink'    => '<span class="screen-reader-text">' . __( 'Page', 'twentysixteen' ) . ' </span>%',
				'separator'   => '<span class="screen-reader-text">, </span>',
			) );

			if ( '' !== get_the_author_meta( 'description' ) ) {
				get_template_part( 'template-parts/biography' );
			}
		?>

	<footer class="entry-footer">
		<?php twentysixteen_entry_meta(); ?>
		<?php
			edit_post_link(
				sprintf(
					/* translators: %s: Name of current post */
					__( 'Edit<span class="screen-reader-text"> "%s"</span>', 'twentysixteen' ),
					get_the_title()
				),
				'<span class="edit-link">',
				'</span>'
			);
		?>
	</footer><!-- .entry-footer -->
</article>