<?php
$sf_current_query = $searchandfilter->get(532)->current_query();

if ( $query->have_posts() )
{
	?>
	
<h2 aria-live="assertive" aria-atomic="true" aria-relevant="all" class="results-number"><?php echo $query->found_posts; ?> Results Found</h2><br />
	
	
	<?php
		/* example code for using the wp_pagenavi plugin */
		if (function_exists('wp_pagenavi'))
		{
			echo '<div class="pagination">';
			wp_pagenavi( array( 'query' => $query ) );
			echo '</div>';
		}
	?>
	
<table>
<thead>
<tr>
<th>
Title
</th>

<th>
Modality
</th>

<th>
Tags
</th>
</tr>
</thead>

<tbody>
	<?php
	while ($query->have_posts())
	{
		$query->the_post();
		
		?>
		<tr>
			
<td class="title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			<?php 
				if ( has_post_thumbnail() ) {
					the_post_thumbnail("small");
				}
			?>
</td>

<td>
	<?php 
	$modalities = get_the_terms( get_the_ID(), 'modality' );
    if ( $modalities && ! is_wp_error( $modalities ) ) :
    	echo '<ul class="modality">';
	 	foreach ( $modalities as $modality ) {
	        echo "<li>". $modality->name ."</li>";
	    }
	    echo '</ul>';
    endif;
    ?>
</td>

<td>
	<?php the_tags('', ', ', ''); ?>
</td>
			
		</tr>

		
		<?php
	}
	?>
</tbody>
</table>	
	<div class="pagination">
		<?php
			/* example code for using the wp_pagenavi plugin */
			if (function_exists('wp_pagenavi'))
			{
				wp_pagenavi( array( 'query' => $query ) );
			}
		?>
	</div>
	<?php
}
else
{
	echo '<h2 aria-live="assertive" aria-atomic="true" aria-relevant="all">No Results Found</h2>';
}

?>