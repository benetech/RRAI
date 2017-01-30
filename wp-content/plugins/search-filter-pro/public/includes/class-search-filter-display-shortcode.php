<?php
/**
 * Search & Filter Pro
 * 
 * @package   Search_Filter_Display_Shortcode
 * @author    Ross Morsali
 * @link      http://www.designsandcode.com/
 * @copyright 2015 Designs & Code
 */

//form prefix
if (!defined('SF_FPRE'))
{
    define('SF_FPRE', '_sf_'); 
}
if (!defined('SF_TAX_PRE'))
{
    define('SF_TAX_PRE', '_sft_'); 
}
if (!defined('SF_META_PRE'))
{
    define('SF_META_PRE', '_sfm_'); 
}
if (!defined('SF_CLASS_PRE'))
{
    define('SF_CLASS_PRE', 'sf-'); 
}
if (!defined('SF_INPUT_ID_PRE'))
{
    define('SF_INPUT_ID_PRE', 'sf');
}
if (!defined('SF_FIELD_CLASS_PRE'))
{
    define('SF_FIELD_CLASS_PRE', SF_CLASS_PRE."field-"); 
}
if (!defined('SF_ITEM_CLASS_PRE'))
{
    define('SF_ITEM_CLASS_PRE', SF_CLASS_PRE."item-"); 
}
class Search_Filter_Display_Shortcode {
		
	public function __construct($plugin_slug)
	{
		$this->plugin_slug = $plugin_slug;
		
		// Add shortcode support for widgets
		add_shortcode('searchandfilter', array($this, 'display_shortcode'));
		add_filter('widget_text', 'do_shortcode');
		
		//add query vars
		add_filter('query_vars', array($this,'add_queryvars') );
		
		$this->is_form_using_template = false; //if the user has selected to use a template with this form
		
		//if the current page is using the defined template - the search form can display anywhere on the site so sometimes where it is displayed may not be a results page
		$this->is_template_loaded = false; 
		
		$this->display_results = new Search_Filter_Display_Results($plugin_slug);
	}
		
	public function set_is_template($is_template)
	{
		$this->is_template_loaded = $is_template;
	}
	
	public function set_defaults($sfid)
	{
		global $searchandfilter;
		global $wp_query;
		
		$searchform = $searchandfilter->get($sfid);

		//try to detect any info from current page/archive and set defaults
		//$this->set_inherited_defaults($searchform);

		//$current_query = $searchform->current_query()->get_array();
		
		//var_dump($current_query);
		
		//give priority to user selections by setting them up after
			
		/*$categories = array();
		
		if(isset($wp_query->query['category_name']))
		{
			$category_params = (preg_split("/[,\+ ]/", esc_attr($wp_query->query['category_name']))); //explode with 2 delims
							
			//$category_params = explode("+",esc_attr($wp_query->query['category_name']));
			
			foreach($category_params as $category_param)
			{
				$category = get_category_by_slug( $category_param );
				if(isset($category->cat_ID))
				{
					$categories[] = $category->cat_ID;
				}
			}
		}

		if((count($categories)>0)||(!isset($this->defaults[SF_TAX_PRE.'category'])))
		{
			$this->defaults[SF_FPRE.'category'] = $categories;
		}
		*/
		//grab search term for prefilling search input
		/*if(isset($_GET['_sf_s']))
		{	
			$this->defaults['search'] = esc_attr(trim(stripslashes($_GET['_sf_s'])));
		}*/

		//check to see if tag is set

		/*$tags = array();
		
		if(isset($wp_query->query['tag']))
		{
			$tag_params = (preg_split("/[,\+ ]/", esc_attr($wp_query->query['tag']))); //explode with 2 delims
			
			foreach($tag_params as $tag_param)
			{
				$tag = get_term_by("slug",$tag_param, "post_tag");
				if(isset($tag->term_id))
				{
					$tags[] = $tag->term_id;
				}
			}
		}
		
		if((count($tags)>0)||(!isset($this->defaults[SF_TAX_PRE.'post_tag'])))
		{
			$this->defaults[SF_FPRE.'post_tag'] = $tags;
		}*/

		
		/*$taxonomies_list = get_taxonomies('','names');
		
		
		$taxs = array();
		
		//loop through all the query vars
		if(isset($_GET))
		{
			foreach($_GET as $key=>$val)
			{
				$taxs = array();
				if (strpos($key, SF_TAX_PRE) === 0)
				{
					$key = substr($key, strlen(SF_TAX_PRE));
					
					$taxslug = ($val);
					//$tax_params = explode("+",esc_attr($taxslug));
					
					$tax_params = array();
					
					$tax_params = (preg_split("/[,\+ ]/", esc_attr($taxslug))); //explode with 2 delims

					foreach($tax_params as $tax_param)
					{
						$tax = get_term_by("slug",$tax_param, $key);

						if(isset($tax->term_id))
						{
							$taxs[] = $tax->term_id;
						}
					}

					if((count($taxs)>0)||(!isset($this->defaults[SF_TAX_PRE.$key])))
					{
						$this->defaults[SF_TAX_PRE.$key] = $taxs;
					}
					
					
				}
				else if (strpos($key, SF_META_PRE) === 0)
				{
					$key = substr($key, strlen(SF_META_PRE));
					
					$meta_data = array("","");
					
					if(isset($_GET[SF_META_PRE.$key]))
					{
						//get meta field options
						$meta_field_data = $searchform->get_field_by_key(SF_META_PRE.$key);
						
						if($meta_field_data['meta_type']=="number")
						{
							$meta_data = array("","");
							if(isset($_GET[SF_META_PRE.$key]))
							{
								$meta_data = (preg_split("/[,\+ ]/", esc_attr(($_GET[SF_META_PRE.$key])))); //explode with 2 delims
								
								if(count($meta_data)==1)
								{
									$meta_data[1] = "";
								}
							}
							
							$this->defaults[SF_FPRE.$key] = $meta_data;	
						}
						else if($meta_field_data['meta_type']=="choice")
						{
							$getval = $_GET[SF_META_PRE.$key];
							
							if($meta_field_data["operator"]=="or")
							{
								$ochar = "-,-";
							}
							else
							{
								$ochar = "-+-";
								$replacechar = "- -";
								$getval = str_replace($replacechar, $ochar, $getval);
							}
							
							$meta_data = explode($ochar, esc_attr($getval));
							
							if(count($meta_data)==1)
							{
								$meta_data[1] = "";
							}
						}
						else if($meta_field_data['meta_type']=="date")
						{
							$meta_data = array("","");
							if(isset($_GET[SF_META_PRE.$key]))
							{
								$meta_data = array_map('urldecode', explode("+", esc_attr(urlencode($_GET[SF_META_PRE.$key]))));
								if(count($meta_data)==1)
								{
									$meta_data[1] = "";
								}
							}
						}
					}
					
					$this->defaults[SF_META_PRE.$key] = $meta_data;					
					
				}
			}
		}
		
		$post_date = array("","");
		if(isset($_GET['post_date']))
		{
			$post_date = array_map('urldecode', explode("+", esc_attr(urlencode($_GET['post_date']))));
			if(count($post_date)==1)
			{
				$post_date[1] = "";
			}
		}
		$this->defaults[SF_FPRE.'post_date'] = $post_date;
		
		
		$post_types = array();
		if(isset($_GET['post_types']))
		{
			$post_types = explode(",",esc_attr($_GET['post_types']));
		}

		if((count($post_types)>0)||(!isset($this->defaults[SF_FPRE.'post_type'])))
		{
			$this->defaults[SF_FPRE.'post_type'] = $post_types;
		}
		
		
		
		$sort_order = array();
		if(isset($_GET['sort_order']))
		{
			$sort_order = explode(",",esc_attr(urlencode($_GET['sort_order'])));
		}
		$this->defaults[SF_FPRE.'sort_order'] = $sort_order;
		
		$authors = array();
		if(isset($_GET['authors']))
		{
			$authors = explode(",",esc_attr($_GET['authors']));
		}
		
		if((count($authors)>0)||(!isset($this->defaults[SF_FPRE.'author'])))
		{
			$this->defaults[SF_FPRE.'author'] = $authors;
		}*/
		
	}

	
	
	public function enqueue_scripts()
	{
		$load_jquery_i18n = get_option( 'search_filter_load_jquery_i18n' );
		$combobox_script = get_option( 'search_filter_combobox_script' );
		if($combobox_script=="")
		{
			$combobox_script = "chosen";
		}
		
		wp_enqueue_script( $this->plugin_slug . '-plugin-build' );
		wp_enqueue_script( $this->plugin_slug . '-plugin-'.$combobox_script );
		wp_enqueue_script( 'jquery-ui-datepicker' ); 
				
		if($load_jquery_i18n==1)
		{
			wp_enqueue_script( $this->plugin_slug . '-plugin-jquery-i18n' );
		}
	}
	
	public function display_shortcode($atts, $content = null)
	{
		$lazy_load_js 				= get_option( 'search_filter_lazy_load_js' );
		$load_js_css 				= get_option( 'search_filter_load_js_css' );
		
		if($lazy_load_js===false)
		{
			$lazy_load_js = 0;
		}
		if($load_js_css===false)
		{
			$load_js_css = 1;
		}
		
		if(($lazy_load_js==1)&&($load_js_css==1))
		{
			$this->enqueue_scripts();
		}
		
		// extract the attributes into variables
		extract(shortcode_atts(array(
		
			'id' => '',
			'slug' => '',
			'show' => 'form',
			'action' => ''
			
		), $atts));
		
		$returnvar = "";
		
		//make sure its set
		if(($id!=="")||($slug!==""))
		{
			if($id=="")
			{	
				if ( $post = get_page_by_path( esc_attr($slug), OBJECT, 'search-filter-widget' ) )
				{
					$id = $post->ID;
				}
			}
			
			$base_form_id = (int)$id;
			if(Search_Filter_Helper::has_wpml())
			{
				$base_form_id = Search_Filter_Helper::wpml_object_id($id, 'search-filter-widget', true, ICL_LANGUAGE_CODE);
			}
			
			
			if(get_post_status($base_form_id)!="publish")
			{
				return;				
			}
			
			$fields = get_post_meta( $base_form_id , '_search-filter-fields' , true );
			$settings = get_post_meta( $base_form_id , '_search-filter-settings' , true );
			$addclass = "";
			
			global $searchandfilter;
			
			$searchform = $searchandfilter->get($base_form_id);
			
			$this->set_defaults($base_form_id);
			
			if($action=="prep_query")
			{
				return $returnvar;
			}
			else if($action=="do_archive_query")
			{
				do_action("search_filter_archive_query", $base_form_id);//legacy
				do_action("search_filter_do_query", $base_form_id);
				return $returnvar;
			}
			else if($action=="setup_pagination")
			{
				//$searchform->query()->prep_query();
				$searchform->query()->setup_pagination();
				return $returnvar;
			}
			else if($show=="form")
			{
				
				/* TODO  set auto count somewhere else */
				
				//make sure there are fields
				if(isset($fields))
				{
					//make sure fields are in array format as expected
					if(is_array($fields))
					{
						$use_ajax = isset($settings['use_ajax_toggle']) ? (bool)$settings['use_ajax_toggle'] : false;
						$use_history_api = true;
						$ajax_target = isset($settings['ajax_target']) ? esc_attr($settings['ajax_target']) : '';
						$results_url = isset($settings['results_url']) ? esc_attr($settings['results_url']) : '';
						$page_slug = isset($settings['page_slug']) ? esc_attr($settings['page_slug']) : '';
						$ajax_links_selector = isset($settings['ajax_links_selector']) ? esc_attr($settings['ajax_links_selector']) : '';
						$ajax_auto_submit = isset($settings['auto_submit']) ? (int)$settings['auto_submit'] : '';
						$auto_count = isset($settings['enable_auto_count']) ? (int)$settings['enable_auto_count'] : '';
						$auto_count_refresh_mode = isset($settings['auto_count_refresh_mode']) ? (int)$settings['auto_count_refresh_mode'] : '';
						$use_results_shortcode = isset($settings['use_results_shortcode']) ? (int)$settings['use_results_shortcode'] : ''; /* legacy */
						$display_results_as = isset($settings['display_results_as']) ? esc_attr($settings['display_results_as']) : 'shortcode';
						$update_ajax_url = isset($settings['update_ajax_url']) ? (int)$settings['update_ajax_url'] : 1;
						$only_results_ajax = isset($settings['only_results_ajax']) ? (int)$settings['only_results_ajax'] : '';
						$scroll_to_pos = isset($settings['scroll_to_pos']) ? esc_attr($settings['scroll_to_pos']) : '';
						$scroll_on_action = isset($settings['scroll_on_action']) ? esc_attr($settings['scroll_on_action']) : '';
						$custom_scroll_to = isset($settings['custom_scroll_to']) ? esc_html($settings['custom_scroll_to']) : '';
						//$is_woocommerce = isset($settings['is_woocommerce']) ? esc_html($settings['is_woocommerce']) : '';
						
						/* legacy */
						if(isset($settings['use_results_shortcode']))
						{
							if($settings['use_results_shortcode']==1)
							{
								$display_results_as = "shortcode";
								
							}
							else
							{
								$display_results_as = "archive";
							}
						}
						/* end legacy */
						
						//if($display_results_as=="shortcode")
						//{
							//prep the query so we can get the counts for the items in the search form - should not really be loaded here - needs to run before page load
							$searchform->query()->prep_query();
						//}
						
					
						if($display_results_as=="shortcode")
						{//if we're using a shortcode, grab the selector automatically from the id
							$ajax_target = "#search-filter-results-".$base_form_id;
						}
						
						$post_types = isset($settings['post_types']) ? $settings['post_types'] : '';
						
						
						//url
						/*$ajax_url = "";
						$start_url = home_url();
						$full_url = $this->get_current_URL();
						if(substr($full_url, 0, strlen($start_url)) == $start_url)
						{
							$ajax_url = substr($full_url, strlen($start_url));
						}*/
						
						
						$form_attr = ' data-sf-form-id="'.$base_form_id.'" data-is-rtl="'.(int)is_rtl().'"';
						
						$ajax_url = "";
						
						/* figure out the ajax/results urls */
						
						if($display_results_as=="archive")
						{
							//get search & filter results url respecting permalink settings
							
							$results_url = home_url("?sfid=".$base_form_id);
							
							//$results_url = add_query_arg(array('sfid' => $base_form_id), pll_home_url());
							
							
							if(get_option('permalink_structure'))
							{
								$page_slug = $settings['page_slug'];
								
								if($page_slug!="")
								{
									$results_url = trailingslashit(home_url($page_slug));
								}
							}
							
							if(has_filter('sf_archive_results_url')) {
			
								$results_url = apply_filters('sf_archive_results_url', $results_url, $base_form_id, $page_slug);
							}
							
						}
						else if($display_results_as=="post_type_archive")
						{
							//get the post type for this form (should only be one set)
							//then find out the proper url for the archive page according to permalink option
							if(isset($settings['post_types']))
							{
								$post_types = array_keys($settings['post_types']);
								if(isset($post_types[0]))
								{
									$post_type = $post_types[0];
									
									if($post_type=="post")
									{
										if( get_option( 'show_on_front' ) == 'page' )
										{
											$results_url = get_permalink( get_option( 'page_for_posts' ) );
										}
										else
										{
											$results_url = home_url('/');
										}
									}
									else 
									{
										$results_url = get_post_type_archive_link( $post_type );
									}
									
								}
							}
						}
						else if($display_results_as=="shortcode")
						{//use the results_url defined by the user
							$ajax_url = home_url("?sfid=".$base_form_id."&sf_action=get_results");
						}
						else if($display_results_as=="custom_edd_store")
						{//use the results_url defined by the user
							
						}
						else if(($display_results_as=="custom_woocommerce_store")&&(function_exists('woocommerce_get_page_id')))
						{//find woocommerce shop page
							$results_url = home_url("?post_type=product");
							
							$searchform->query()->remove_permalink_filters();
							if(get_option('permalink_structure'))
							{
								$results_url = get_permalink( woocommerce_get_page_id( 'shop' ));
							}
							$searchform->query()->add_permalink_filters();
						}
						
						if($results_url!="")
						{
							if(has_filter('sf_results_url')) {
			
								$results_url = apply_filters('sf_results_url', $results_url, $base_form_id);
							}
							
							$form_attr.=' data-results-url="'.$results_url.'"';
						}
						
						if(($use_ajax)&&($ajax_url!=""))
						{					
							if(has_filter('sf_ajax_results_url')) {
			
								$ajax_url = apply_filters('sf_ajax_results_url', $ajax_url, $base_form_id);
							}
							
							$form_attr.=' data-ajax-url="'.$ajax_url.'"';
						}
						
						
						$ajax_form_url = home_url("?sfid=".$base_form_id."&sf_action=get_form");
						
						if($ajax_form_url!="")
						{
							if(has_filter('sf_ajax_form_url')) {
			
								$ajax_form_url = apply_filters('sf_ajax_form_url', $ajax_form_url, $base_form_id);
							}
							
							$form_attr.=' data-ajax-form-url="'.$ajax_form_url.'"';
						}
						
						
						
						$form_attr .= ' data-use-history-api="'.(int)$use_history_api.'"';
						$form_attr .= ' data-template-loaded="'.(int)$this->is_template_loaded.'"';
						
						$lang_code = "";
						
						if(Search_Filter_Helper::has_wpml())
						{
							$lang_code = ICL_LANGUAGE_CODE;							
						}
						
						$form_attr .= ' data-lang-code="'.$lang_code.'"';
						
						$form_attr.=' data-ajax="'.(int)$use_ajax.'"';
						
						if($use_ajax)
						{
							if($ajax_target!="")
							{
								$form_attr.=' data-ajax-target="'.$ajax_target.'"';
							}
							
							if($ajax_links_selector!="")
							{
								$form_attr.=' data-ajax-links-selector="'.$ajax_links_selector.'"';
							}
							
							if($update_ajax_url!="")
							{
								$form_attr.=' data-update-ajax-url="'.$update_ajax_url.'"';
							}
							if($only_results_ajax!="")
							{
								$form_attr.=' data-only-results-ajax="'.$only_results_ajax.'"';
							}
							
							if($scroll_to_pos!="")
							{
								$form_attr.=' data-scroll-to-pos="'.$scroll_to_pos.'"';
								
								if($scroll_to_pos=="custom")
								{
									if($custom_scroll_to!="")
									{
										$form_attr.=' data-custom-scroll-to="'.$custom_scroll_to.'"';
									}
								}
							}
							
							if($scroll_on_action!="")
							{
								$form_attr.=' data-scroll-on-action="'.$scroll_on_action.'"';
							}
						}
												
						$form_attr.=' data-auto-update="'.$ajax_auto_submit.'"';
						
						if($auto_count==1)
						{
							$form_attr.=' data-auto-count="'.esc_attr($auto_count).'"';
							
							if($auto_count_refresh_mode==1)
							{
								$form_attr.=' data-auto-count-refresh-mode="'.esc_attr($auto_count_refresh_mode).'"';
							}
						}
						
						$returnvar .= '<form action="'.$results_url.'" method="post" class="searchandfilter'.$addclass.'"'.$form_attr.' id="search-filter-form-'.$base_form_id.'" autocomplete="off">';
						$returnvar .= "<ul>";
						
						$this->fields = new Search_Filter_Fields($this->plugin_slug, $base_form_id);
						
						//loop through each field and grab html
						foreach ($fields as $field)
						{
							$returnvar .= $this->get_field($field, $post_types, $base_form_id);
						}
						
						$returnvar .= "</ul>";
						$returnvar .= "</form>";
						
						
					}
				}
			}
			else if($show=="results")
			{
				/* legacy */
				if($searchform->settings('use_results_shortcode')==1)
				{
					$display_results_as = "shortcode";
				}
				else
				{
					$display_results_as = "archive";
				}
				/* end legacy */
				
				if($searchform->settings('display_results_as')!="")
				{
					$display_results_as = $searchform->settings('display_results_as');
				}
				
				
				if($display_results_as=="shortcode")
				{
					$returnvar = $this->display_results->output_results($base_form_id, $settings);
				}
				else
				{
					if (current_user_can('edit_posts'))
					{
						$returnvar = __("<p><strong>Notice:</strong> This Search Form has not been configured to use a shortcode. <a href='".get_edit_post_link($base_form_id)."'>Edit settings</a>.</p>", $this->plugin_slug);
					}
				}
			}
						
		}
		
		return $returnvar;
	}
	
	//switch for different field types
	private function get_field($field_data, $post_types, $search_form_id)
	{
		$returnvar = "";
				
		$field_class = "";
		$field_name = "";
		if($field_data['type'] == "category")
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_TAX_PRE."category";
		}
		else if($field_data['type'] == "tag")
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_TAX_PRE."post_tag";
		}
		else if($field_data['type'] == "taxonomy")
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type']."-".($field_data['taxonomy_name']);
			$field_name = SF_TAX_PRE.$field_data['taxonomy_name'];
		}
		else if($field_data['type'] == "post_meta")
		{
			$field_class = SF_FIELD_CLASS_PRE.'post-meta'."-".($field_data['meta_key']);
			$field_name = SF_META_PRE.$field_data['meta_key'];
		}
		else if($field_data['type'] == 'post_type')
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_FPRE.$field_data['type'];
		}
		else if($field_data['type'] == 'sort_order')
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_FPRE.$field_data['type'];
		}
		else if($field_data['type'] == 'author')
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_FPRE.$field_data['type'];
		}
		else if($field_data['type'] == 'post_date')
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = SF_FPRE.$field_data['type'];
		}
		else
		{
			$field_class = SF_FIELD_CLASS_PRE.$field_data['type'];
			$field_name = $field_data['type'];
		}
		
		$field_class = sanitize_html_class($field_class);
		
		$input_type = "";
		if(isset($field_data['input_type']))
		{
			$input_type = $field_data['input_type'];
		}
		
		$addAttributes = "";
		
		//check if is combobox
		if(($input_type=="select")||($input_type=="multiselect"))
		{
			if(isset($field_data['combo_box']))
			{
				if($field_data['combo_box']==1)
				{
					$addAttributes .= ' data-sf-combobox="1"';
				}
			}
		}
		
		if($field_data['type']=="post_meta")
		{
			$addAttributes .= ' data-sf-meta-type="'.$field_data['meta_type'].'"';
			if($field_data['meta_type']=="number")
			{
				$input_type = $field_data['number_input_type'];
			}
			else if($field_data['meta_type']=="choice")
			{
				$input_type = $field_data['choice_input_type'];
				
				if($field_data['combo_box']==1)
				{
					$addAttributes .= ' data-sf-combobox="1"';
				}
			}
			else if($field_data['meta_type']=="date")
			{
				$input_type = $field_data['date_input_type'];
			}
		}
		
		$display_field = true;
		
		if(has_filter('sf_display_field')) {
			$display_field = apply_filters('sf_display_field', $display_field, $search_form_id, $field_name);
		}
		
		if($display_field==false)
		{
			return $returnvar;
		}
		
		$returnvar .= "<li class=\"$field_class\" data-sf-field-name=\"$field_name\" data-sf-field-type=\"".$field_data['type']."\" data-sf-field-input-type=\"".$input_type."\"".$addAttributes.">";
		
		//display a heading? (available to all field types)
		if(isset($field_data['heading']))
		{
			if($field_data['heading']!="")
			{
				$returnvar .= "<h4>".esc_html($field_data['heading'])."</h4>";
			}
		}
		
		
		if($field_data['type']=="search")
		{
			$returnvar .= $this->fields->search->get($field_data);
		}
		else if(($field_data['type']=="tag")||($field_data['type']=="category")||($field_data['type']=="taxonomy"))
		{
			$returnvar .= $this->fields->taxonomy->get($field_data);
		}
		else if($field_data['type']=="post_type")
		{
			$returnvar .= $this->fields->post_type->get($field_data);
		}
		else if($field_data['type']=="post_date")
		{
			$returnvar .= $this->fields->post_date->get($field_data);
		}
		else if($field_data['type']=="post_meta")
		{
			$returnvar .= $this->fields->post_meta->get($field_data);
		}
		else if($field_data['type']=="sort_order")
		{
			$returnvar .= $this->fields->sort_order->get($field_data);
		}
		else if($field_data['type']=="posts_per_page")
		{
			$returnvar .= $this->fields->posts_per_page->get($field_data);
		}
		else if($field_data['type']=="author")
		{
			$returnvar .= $this->fields->author->get($field_data);
		}
		else if($field_data['type']=="submit")
		{
			$returnvar .= $this->fields->submit->get($field_data);
		}
		else if($field_data['type']=="reset")
		{
			$returnvar .= $this->fields->reset->get($field_data, $search_form_id);
		}
		
		$returnvar .= "</li>";
		
		return $returnvar;
	}
	
	function add_queryvars( $qvars )
	{
		/*$qvars[] = 'post_types';
		$qvars[] = 'post_date';
		$qvars[] = 'sort_order';
		$qvars[] = 'authors';
		$qvars[] = '_sf_s';*/
		$qvars[] = 'sfid'; //search filter template
		
		//we need to add in any meta keys
		/*foreach($_GET as $key=>$val)
		{
			$key = sanitize_text_field($key);
			
			if(($this->is_meta_value($key))||($this->is_taxonomy_key($key)))
			{
				$qvars[] = $key;
			}
		}*/
		
		return $qvars;
	}
	
	public function is_meta_value($key)
	{
		if(substr( $key, 0, 5 )===SF_META_PRE)
		{
			return true;
		}
		return false;
	}
	public function is_taxonomy_key($key)
	{
		if(substr( $key, 0, 5 )===SF_TAX_PRE)
		{
			return true;
		}
		return false;
	}
}

if ( ! class_exists( 'Search_Filter_Generate_Input' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'class-search-filter-generate-input.php' );
}

if ( ! class_exists( 'Search_Filter_Display_Results' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'class-search-filter-display-results.php' );
}

if ( ! class_exists( 'Search_Filter_Fields' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'class-search-filter-fields.php' );
}


