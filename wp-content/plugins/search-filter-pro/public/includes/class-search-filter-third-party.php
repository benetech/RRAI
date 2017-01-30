<?php
/**
 * Search & Filter Pro
 *
 * @package   Search_Filter_Third_Party
 * @author    Ross Morsali
 * @link      http://www.designsandcode.com/
 * @copyright 2015 Designs & Code
 */

class Search_Filter_Third_Party
{
	private $plugin_slug = '';
	private $form_data = '';
	private $count_table;
	private $cache;
	private $relevanssi_result_ids = array();
	private $query;
	private $sfid = 0;

	function __construct($plugin_slug)
	{
		$this->plugin_slug = $plugin_slug;

		// -- woocommerce
		add_filter('sf_edit_query_args', array($this, 'sf_woocommerce_query_args'), 11, 2); //
		add_filter('sf_admin_filter_settings_save', array($this, 'sf_woocommerce_filter_settings_save'), 11, 2); //


    //add_filter('fes_save_field_after_save_frontend', array($this, 'sf_edd_fes_field_save_frontend'), 11, 3); //

    //add_action('fes_submission_form_edit_published', array($this, 'sf_edd_fes_submission_form_published'), 20, 1); 
    //add_action('fes_submission_form_new_published', array($this, 'sf_edd_fes_submission_form_published'), 20, 1);
    //add_action('fes_submission_form_edit_pending', array($this, 'sf_edd_fes_submission_form_published'), 20, 1); // this might not be necessary
    //add_action('fes_submission_form_new_pending', array($this, 'sf_edd_fes_submission_form_published'), 20, 1); // this might not be necessary


		// -- EDD
		//add_action( 'marketify_entry_before', array($this, 'marketify_entry_before_hook') );
		//add_filter('edd_downloads_query', array($this, 'edd_prep_downloads_sf_query'), 10, 2);
		//$searchform->query()->prep_query();

		// -- polylang
		//add_action('init', array($this, 'dump_stuff'));
		//add_filter('pll_the_language_link', array($this, 'my_link'), 10, 2);
		add_filter('pll_get_post_types', array($this, 'pll_sf_add_translations'));
		add_filter('sf_archive_results_url', array($this, 'pll_sf_archive_results_url'), 10, 3); //
		add_filter('sf_archive_slug_rewrite', array($this, 'pll_sf_archive_slug_rewrite'), 10, 3); //
		add_filter('sf_ajax_results_url', array($this, 'pll_sf_ajax_results_url'), 10, 2); //
		//add_filter('sf_pre_get_posts_admin_cache', array($this, 'sf_pre_get_posts_admin_cache'), 10, 3); //
		add_filter('sf_edit_cache_query_args', array($this, 'poly_lang_sf_edit_cache_query_args'), 10, 3); //

		// -- relevanssi
		add_filter( 'sf_edit_query_args_after_custom_filter', array( $this, 'relevanssi_filter_query_args' ), 12, 2);
		add_filter( 'sf_apply_custom_filter', array( $this, 'relevanssi_add_custom_filter' ), 10, 3);

		$this->init();
	}

	public function init()
	{

	}

	/* WooCommerce integration */


	public function sf_woocommerce_is_filtered()
	{
		return true;
	}
	public function sf_woocommerce_query_args($query_args,  $sfid)
	{
		global $searchandfilter;
		$sf_inst = $searchandfilter->get($sfid);

		//make sure this search form is tyring to use woocommerce
		if($sf_inst->settings("display_results_as")=="custom_woocommerce_store")
		{
			$sf_current_query  = $sf_inst->current_query();
			if($sf_current_query->is_filtered())
			{
				add_filter('woocommerce_is_filtered', array($this, 'sf_woocommerce_is_filtered'));
			}

			$del_val = "product_variation"; //always remove product variations from main query

			if(isset($query_args['post_type']))
			{
				if(is_array($query_args['post_type']))
				{
					if(($key = array_search($del_val, $query_args['post_type'])) !== false) {
						unset($query_args['post_type'][$key]);
					}
				}
			}

			return $query_args;
		}

		return $query_args;
	}

	//public function sf_edd_fes_field_save_frontend($field, $save_id, $value, $user_id)
	public function sf_edd_fes_field_save_frontend($field, $save_id, $value)
  {
    //FES has an issue where the same filter is used but with 3 args or 4 args
    //if the field is a digit, then actually this is the ID
    $post_id = 0;
    if(ctype_digit($field))
    {
      $post_id = $field;
    }
    else if(ctype_digit($save_id))
    {
      $post_id = $save_id;
    }


    if( true == SEARCH_FILTER_DEBUG )
    {
      sf_write_log("-------------------");
      sf_write_log("sf_edd_fes_field_save_frontend: ".$post_id);
      sf_write_log($post_id);
      sf_write_log($value);
      sf_write_log("-------------------");
    }

    //do_action('search_filter_update_post_cache', $save_id);
  }
	public function sf_edd_fes_submission_form_published($post_id)
  {
    do_action('search_filter_update_post_cache', $post_id);
  }
	public function sf_woocommerce_filter_settings_save($settings,  $sfid)
	{
		//make sure this search form is tyring to use woocommerce
		if(isset($settings['display_results_as']))
		{
			if($settings["display_results_as"]=="custom_woocommerce_store")
			{
				$settings['treat_child_posts_as_parent'] = 1;
			}
			else
			{
				$settings['treat_child_posts_as_parent'] = 0;
			}
		}

		return $settings;
	}

	/* EDD integration */

	public function edd_prep_downloads_sf_query($query, $atts) {

		return $query;
	}


	/* pollylang integration */

	function my_link($url, $slug) {
		echo "THE LINK: ".$url." | ".$slug."<br />";
		return $url === null ? home_url('?lang='.$slug) : $url;
	}

	public function pll_sf_add_translations($types) {
		return array_merge($types, array('search-filter-widget' => 'search-filter-widget'));
	}

	public function poly_lang_sf_edit_cache_query_args($query_args,  $sfid) {

		global $polylang;

		if(empty($polylang))
		{
			return $query_args;
		}

		/*$langs = array();

		foreach ($polylang->model->get_languages_list() as $term)
		{
			array_push($langs, $term->slug);
		}

		$query_args["lang"] = implode(",",$langs);*/

		return $query_args;
	}
	/*
	public function sf_pre_get_posts_admin_cache($query,  $sfid) {

		$query->set("lang", "all");

		return $query;
	}
	*/

	function add_url_args($url, $str)
	{
		$query_arg = '?';
		if (strpos($url,'?') !== false) {

			//url has a question mark
			$query_arg = '&';
		}

		return $url.$query_arg.$str;

	}
	public function pll_sf_archive_slug_rewrite($newrules,  $sfid, $page_slug) {

		if((function_exists('pll_home_url'))&&(function_exists('pll_current_language')))
		{
			//takes into account language prefix
			//$newrules = array();
			$newrules["([a-zA-Z0-9_-]+)/".$page_slug.'$'] = 'index.php?&sfid='.$sfid; //regular plain slug
		}

		return $newrules;
	}
	public function pll_sf_ajax_results_url($ajax_url,  $sfid) {

		if((function_exists('pll_home_url'))&&(function_exists('pll_current_language')))
		{
			if(get_option('permalink_structure'))
			{
				$home_url = trailingslashit(pll_home_url());

				$ajax_url = $this->add_url_args($home_url, "sfid=$sfid&sf_action=get_results");

			}
			else
			{
				$ajax_url = $this->add_url_args( pll_home_url(), "sfid=$sfid&sf_action=get_results");
			}
		}

		return $ajax_url;
	}
	public function pll_sf_archive_results_url($results_url,  $sfid, $page_slug) {


		if((function_exists('pll_home_url'))&&(function_exists('pll_current_language')))
		{
			$results_url = pll_home_url(pll_current_language());

			if(get_option('permalink_structure'))
			{
				if($page_slug!="")
				{
					$results_url = trailingslashit(trailingslashit($results_url).$page_slug);
				}
				else
				{
					$results_url = trailingslashit($results_url);
					$results_url = $this->add_url_args( $results_url, "sfid=$sfid");
				}
			}
			else
			{
				$results_url .= "&sfid=".$sfid;
			}
		}

		return $results_url;
	}




	/* Relevanssi integration */

	public function remove_relevanssi_defaults()
	{
		remove_filter('the_posts', 'relevanssi_query');
		remove_filter('posts_request', 'relevanssi_prevent_default_request', 9);
		remove_filter('posts_request', 'relevanssi_prevent_default_request');
		remove_filter('query_vars', 'relevanssi_query_vars');
	}

	public function relevanssi_filter_query_args($query_args, $sfid) {

		//always remove normal relevanssi behaviour
		$this->remove_relevanssi_defaults();

		global $searchandfilter;
		$sf_inst = $searchandfilter->get($sfid);

		if($sf_inst->settings("use_relevanssi")==1)
		{//ensure it is enabled in the admin

			if(isset($query_args['s']))
			{//only run if a search term has actually been set
				if(trim($query_args['s'])!="")
				{

					$search_term = $query_args['s'];
					$query_args['s'] = "";
				}
			}
		}

		return $query_args;
	}

	public function relevanssi_sort_result_ids($result_ids, $query_args, $sfid) {

		global $searchandfilter;
		$sf_inst = $searchandfilter->get($sfid);

		if(count($result_ids)==1)
		{
			if(isset($result_ids[0]))
			{
				if($result_ids[0]==0) //it means there were no search results so don't even bother trying to change the sorting
				{
					return $result_ids;
				}
			}
		}

		if(($sf_inst->settings("use_relevanssi")==1)&&($sf_inst->settings("use_relevanssi_sort")==1))
		{//ensure it is enabled in the admin

			if(isset($this->relevanssi_result_ids['sf-'.$sfid]))
			{
				$return_ids_ordered = array();

				$ordering_array = $this->relevanssi_result_ids['sf-'.$sfid];

				$ordering_array = array_flip($ordering_array);

				foreach ($result_ids as $result_id) {
					$return_ids_ordered[$ordering_array[$result_id]] = $result_id;
				}

				ksort($return_ids_ordered);

				return $return_ids_ordered;
			}
		}

		return $result_ids;
	}

	public function relevanssi_add_custom_filter($ids_array, $query_args, $sfid) {

		global $searchandfilter;
		$sf_inst = $searchandfilter->get($sfid);

		$this->remove_relevanssi_defaults();

		if($sf_inst->settings("use_relevanssi")==1)
		{//ensure it is enabled in the admin

			if(isset($query_args['s']))
			{//only run if a search term has actually been set

				if(trim($query_args['s'])!="")
				{
					//$search_term = $query_args['s'];

					if (function_exists('relevanssi_do_query'))
					{
						$expand_args = array(
						   'posts_per_page' 			=> -1,
						   'paged' 						=> 1,
						   'fields' 					=> "ids", //relevanssi only implemented support for this in 3.5 - before this, it would return the whole post object

						   //'orderby' 					=> "", //remove sorting
						   'meta_key' 					=> "",
						   //'order' 						=> "asc",

						   /* speed improvements */
						   'no_found_rows' 				=> true,
						   'update_post_meta_cache' 	=> false,
						   'update_post_term_cache' 	=> false

						);

						$query_args = array_merge($query_args, $expand_args);

						//$query_args['orderby'] = "relevance";
						//$query_args['order'] = "asc";
						unset($query_args['order']);
						unset($query_args['orderby']);

						// The Query
						$query_arr = new WP_Query( $query_args );
						relevanssi_do_query($query_arr);

						$ids_array = array();
						if ( $query_arr->have_posts() ){

							foreach($query_arr->posts as $post)
							{
								$postID = 0;

								if(is_numeric($post))
								{
									$postID = $post;
								}
								else if(is_object($post))
								{
									if(isset($post->ID))
									{
										$postID = $post->ID;
									}
								}

								if($postID!=0)
								{
									array_push($ids_array, $postID);
								}


							}
						}

						if($sf_inst->settings("use_relevanssi_sort")==1)
						{
							//keep a copy for ordering the results later
							$this->relevanssi_result_ids['sf-'.$sfid] = $ids_array;

							//now add the filter
							add_filter( 'sf_apply_filter_sort_post__in', array( $this, 'relevanssi_sort_result_ids' ), 10, 3);
						}

						return $ids_array;
					}
				}
			}
		}

		return array(false); //this tells S&F to ignore this custom filter
	}




}

?>
