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

	<?php twentysixteen_post_thumbnail(); ?>

	<div class="entry-content">

		<?php
			the_content(); ?>
			<div class="info">
			<?php
			$pods = pods();
				echo '<h2>Authors</h2><p class="authors">' . $pods->display( 'authors' ) . '</p>';
				echo '<h2>ISBN</h2><p class="isbn">' . $pods->display( 'ISBN' ) . '</p>';
				echo '<h2>Publisher</h2><p class="publisher">' . $pods->display( 'publisher' ) . '</p>';
				echo '<h2>Subject</h2><p class="subject">' . get_the_term_list( $post->ID, 'subject','',', ','' ) . '</p>';
				echo '<h2>Languages</h2><p class="language">' . get_the_term_list( $post->ID, 'language','',', ',''  ) . '</p>';
				echo '<h2>Target Ages</h2><p class="target-ages">' . get_the_term_list( $post->ID, 'target_ages','',', ','' ) . '</p>';
				echo '<h2>Target Grades</h2><p class="target-grades">' . get_the_term_list( $post->ID, 'target_grade','',', ','' ) . '</p>';
				echo '<h2>Category</h2><p class="category">'. get_the_category_list('',', ','' ) . '</p>';
				echo '<h2>Tags</h2><p class="tags">' . get_the_tag_list('',', ','' ) . '</p>';
								echo '<h2>Downloadable Resources</h2>';

				//get Pods object for current post
				$pod = pods( 'book', get_the_id() );
				$resources = $pod->field( 'resources' );

				//loop through related field
					//only if there is anything to loop through
					if ( ! empty( $resources ) ) {
						echo '<ul class="associated-resources">';

									foreach ( $resources as $res ) { 
										// Get id for resource and put in variable $id
										$id = $res[ 'ID' ];
										
										// Each resource generates a row
										echo '<li>';
										
										// Get modality of resource
										$modalities = get_the_terms( $id, 'modality' );
										if ( $modalities && ! is_wp_error( $modalities ) ) :
												$modality_list = array();
										 	foreach ( $modalities as $modality ) {
										        $modality_list[] = $modality->name;
										    }

										    $the_modality_list = join( ", ", $modality_list );
										endif;
										
										global $post;
										$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($id), 'thumbnail'); 
										echo '<img src="' . $thumb[0] . '" alt="" />';

										echo '<span class="modality">' . $the_modality_list . ': </span>';

										// Get title of resource
										echo '<span class="title"><a href="' . get_post_meta( $id, 'download_link', true ) . '">' . get_the_title( $id ) . '</a> </span>';

										// Get the source of the resource
										echo 'from <span class="source">' . get_post_meta( $id, 'source', true ) . '</span>';
										
										// Close out the row
										echo '</li>';

									} //end of foreach
						echo '</ul>';
					} //endif ! empty ( $related )
					?>

				<h2>Associated Concepts</h2>
					
					<?php
					//get Pods object for current post
					$pod = pods( 'book', get_the_id() );

					//get the value for the relationship field
					$related = $pod->field( 'concepts' );

					//loop through related field, creating links to their own pages
					//only if there is anything to loop through
					if ( ! empty( $related ) ) {
						echo '<ul class="associated-concepts">';
						foreach ( $related as $rel ) { 
							//get id for related post and put in ID
							//for advanced content types use $id = $rel[ 'id' ];
							$id = $rel[ 'ID' ];
							//show the related post name as link
							echo '<li><a href="'. esc_url( get_permalink( $id ) ) . '">' . get_the_title( $id ) . '</a></li>';
						} //end of foreach
						echo '</ul>';
					} //endif ! empty ( $related )
					?>

			<?php

			
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
	</div><!-- .entry-content -->

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
</article><!-- #post-## -->
