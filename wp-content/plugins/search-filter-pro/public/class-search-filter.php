<?php
/**
 * Search & Filter Pro
 * 
 * @package   Search_Filter
 * @author    Ross Morsali
 * @link      http://www.designsandcode.com/
 * @copyright 2015 Designs & Code
 */
global $searchandfilter;

class Search_Filter {

	/**
	 * Plugin version, used for cache-busting of style and script file references.
	 *
	 * @since   1.0.0
	 *
	 * @var     string
	 */
	const VERSION = SEARCH_FILTER_VERSION;
	
	/**
	 * @TODO - Rename "plugin-name" to the name your your plugin
	 *
	 * Unique identifier for your plugin.
	 *
	 *
	 * The variable name is used as the text domain when internationalizing strings
	 * of text. Its value should match the Text Domain file header in the main
	 * plugin file.
	 *
	 * @since    1.0.0
	 *
	 * @var      string
	 */
	protected $plugin_slug = 'search-filter';

	/**
	 * Instance of this class.
	 *
	 * @since    1.0.0
	 *
	 * @var      object
	 */
	protected static $instance = null;
	private $all_search_form_ids = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     1.0.0
	 */
	private function __construct()
	{		
		global $searchandfilter;
		$searchandfilter = new Search_Filter_Global($this->plugin_slug);
		
		// Load plugin text domain
		add_action( 'init', array( $this, 'load_plugin_textdomain' ) );

		// Activate plugin when new blog is added
		add_action( 'wpmu_new_blog', array( $this, 'activate_new_site' ) );

		// Load public-facing style sheet and JavaScript.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		
		// Ajax
		
		add_action( 'init', array( $this, 'create_custom_post_types' ) );
		add_action( 'init', array($this, 'get_results'), 200 );
		
		
		if(!is_admin())
		{
			//add_action( 'pre_get_posts', array( $this, 'wp_init' ) );
			add_action( 'parse_request', array( $this, 'archive_query_init' ), 10 );
			add_action( 'pre_get_posts', array($this, 'custom_query_init'), 100 );
			add_action( 'pre_get_posts', array($this, 'archive_query_init_later') );
			//add_action( 'pre_get_posts', array($this, 'archive_query_init_later'), -100 );
			
			//load SF Template - set high priority to override other plugins...
			add_action('template_include', array($this, 'handle_template'), 100, 3);
		}
		
		$this->display_shortcode = new Search_Filter_Display_Shortcode($this->plugin_slug);
		$this->third_party = new Search_Filter_Third_Party($this->plugin_slug);
		
		add_action('widgets_init', array($this, 'init_widget'));
		
		add_filter('rewrite_rules_array', array($this, 'sf_rewrite_rules'));
		
		
		
	}
	
	function custom_query_init($query)
	{
		if(!isset($query->query_vars['search_filter_id']))
		//||(!isset($query->query_vars['search_filter_query'])))
		{
			return;
		}
		
		
		if(isset($query->query_vars['search_filter_override']))
		{
			if($query->query_vars['search_filter_override']==false)
			{
				return;
			}
		}
		
		if($query->query_vars['search_filter_id']!=0)
		{
			global $searchandfilter;
			$searchandfilter->get($query->query_vars['search_filter_id'])->query->setup_custom_query($query);
		}
		
		return;
	}
	
	function archive_query_init_later($query)
	{
		global $searchandfilter;
		global $wp_query;
		
		if(!$query->is_main_query())
		{
			return;
		}
		
		if(function_exists("is_shop"))
		{
			if(is_shop())
			{
				//then see if there are any search forms set to be woocommerce
				
				foreach($this->all_search_form_ids as $search_form_id)
				{
					$meta_key = '_search-filter-settings';
					
					//as we only want to update "enabled", then load all settings and update only this key
					$search_form_settings = (get_post_meta( $search_form_id, $meta_key, true ));
					
					if(isset($search_form_settings['display_results_as']))
					{
						if($search_form_settings['display_results_as']=="custom_woocommerce_store")
						{
							$searchandfilter->set_active_sfid($search_form_id);
							$searchandfilter->get($search_form_id)->query->setup_archive_query($query);
							
							return;
						}
					}
					
				}
			}
		}
		
		
		
		if(is_post_type_archive()||is_home())
		{//then we know its a post type archive, see if any of our search forms
			
			foreach($this->all_search_form_ids as $search_form_id)
			{
				$meta_key = '_search-filter-settings';
				
				//as we only want to update "enabled", then load all settings and update only this key
				$search_form_settings = (get_post_meta( $search_form_id, $meta_key, true ));
				
				if(isset($search_form_settings['display_results_as']))
				{
					if($search_form_settings['display_results_as']=="post_type_archive")
					{
						if(isset($search_form_settings['post_types']))
						{
							$post_types = array_keys($search_form_settings['post_types']);
							
							if(isset($post_types[0]))
							{
								$post_type = $post_types[0];
								
								if(is_post_type_archive($post_type))
								{	
									$searchandfilter->set_active_sfid($search_form_id);
									$searchandfilter->get($search_form_id)->query->setup_archive_query($query);
									return;
								}
								else if(($post_type=="post")&&(is_home()))
								{//this then works on the blog page (is_home) set in `settings -> reading -> "a static page" -> posts page
									$searchandfilter->set_active_sfid($search_form_id);
									
									$searchandfilter->get($search_form_id)->query->hook_setup_archive_query();
									return;
								}
							}
						}
						
					}
				}
				
			}
		}
		
	}
	
	function archive_query_init($wp)
	{//here we test to see if we have an ID set - which if it is, then this means a user is on a results page, using archive method
		
		global $searchandfilter;
		global $wp_query;
		
		if(!is_admin())
		{
			if(isset($wp->query_vars['sfid']))
			{
				$sfid = (int)$wp->query_vars['sfid'];
				$searchandfilter->set_active_sfid($sfid);
				$searchandfilter->set($sfid);
			}
			else
			{//we also want to run this on woocommerce shop pages
				
			}
			
			//extra stuff
			//grab any search forms before woocommerce had a chance to modify the query
			$search_form_query = new WP_Query('post_type=search-filter-widget&fields=ids&post_status=publish&posts_per_page=-1');
			$this->all_search_form_ids = $search_form_query->get_posts();
			
			
		}
	}
	
	function get_results()
	{
		
		//$this->hard_remove_filters();
		if((isset($_GET['sfid']))&&(isset($_GET['sf_action'])))
		{
			//get_form
			
			$sf_action = esc_attr($_GET['sf_action']);
			
			if((esc_attr($_GET['sfid'])!="")&&(($sf_action=="get_results")||($sf_action=="get_form")))
			{
				global $searchandfilter;
				
				$sfid = (int)($_GET['sfid']);
				$sf_inst = $searchandfilter->get($sfid);
				
				
				if($sf_action=="get_results")
				{
					if($sf_inst->settings("display_results_as")=="shortcode")
					{
						$results = array();
						
						$results['form'] = $this->display_shortcode->display_shortcode(array("id" => $sfid));
						$results['results'] = $sf_inst->query()->the_results();
						
						echo Search_Filter_Helper::json_encode($results);
						exit;
					}
				}
				else if($sf_action=="get_form")
				{
					$results = array();					
					$results['form'] = $this->display_shortcode->display_shortcode(array("id" => $sfid));
					
					echo Search_Filter_Helper::json_encode($results);
					exit;
				}
				
			}
		}
		
	}
	
	function sf_rewrite_rules( $rules )
	{
		global $searchandfilter;
		$newrules = array();
		
		$args = array(
			 'posts_per_page' => -1,
			 'post_type' => $this->plugin_slug."-widget",
			 'post_status' => 'publish'
		);
		
		$all_search_forms = get_posts( $args );
		foreach ($all_search_forms as $search_form)
		{
			$settings = get_post_meta( $search_form->ID , '_search-filter-settings' , true );
			
			if(isset($settings['page_slug']))
			{
				if($settings['page_slug']!="")
				{
					$base_id = $search_form->ID;
					
					//$newrules[$settings['page_slug'].'/page/([0-9]+)/([0-9]+)$'] = 'index.php?&sfid='.$base_id.'&paged=$matches[2]&lang=$matches[1]'; //pagination & lang rule
					//$newrules[$settings['page_slug'].'/page/([0-9]+)$'] = 'index.php?&sfid='.$base_id.'&paged=$matches[1]'; //pagination rule
					//$newrules[$settings['page_slug'].'/page/([0-9]+)$'] = 'index.php?&sfid='.$base_id.'&paged=$matches[1]'; //pagination rule
					
					$use_rewrite = true;
					if(isset($settings['display_results_as']))
					{
						//if(($settings['display_results_as']=="post_type_archive")||($settings['display_results_as']=="shortcode")||($settings['display_results_as']=="custom_woocommerce_store")||($settings['display_results_as']=="custom_edd_store"))
						if($settings['display_results_as']!="archive")
						{
							$use_rewrite = false;
						}
					}
					
					if($use_rewrite==true)
					{
						$newrules[$settings['page_slug'].'$'] = 'index.php?&sfid='.$base_id; //regular plain slug
						
						if(has_filter('sf_archive_slug_rewrite')) {
							
							$newrules = apply_filters('sf_archive_slug_rewrite', $newrules, $base_id, $settings['page_slug']);
						}
					}
					
				}
			}			
		}
		
		return $newrules + $rules;
	}
	
	function init_widget()
	{
		register_widget( 'Search_Filter_Register_Widget' );
	}
	
	public function handle_template($original_template)
	{
		global $searchandfilter;
		global $wp_query;
		
		$sfid = 0;
		
		if(isset($wp_query->query_vars['sfid']))
		{
			$sfid = $wp_query->query_vars['sfid'];
		}
		else
		{
			return $original_template;
		}
		
		if(($searchandfilter->get($sfid)->settings("display_results_as")=="custom_woocommerce_store")||($searchandfilter->get($sfid)->settings("display_results_as")=="custom_edd_store")||($searchandfilter->get($sfid)->settings("display_results_as")=="post_type_archive"))
		{
			return $original_template;
		}
		
		if($searchandfilter->get($sfid)->is_valid_form())
		{//then we are doing a search
			$sfpaged = 1;
			if(isset($_GET['sf_paged']))
			{
				$sfpaged = (int)$_GET['sf_paged'];
			}
			global $paged;
			$paged = $sfpaged;
			
		
		
			$template_file_name = $searchandfilter->get($sfid)->get_template_name();
			
			if($template_file_name)
			{
				$located = locate_template( $template_file_name );
				
				if ( !empty( $located ) )
				{
					$this->display_shortcode->set_is_template(true);
					return ($located);
				}
			}		
		}
		
		return $original_template;
	}
	
	/**
	 * Return the plugin slug.
	 *
	 * @since    1.0.0
	 *
	 * @return    Plugin slug variable.
	 */
	public function get_plugin_slug() {
		return $this->plugin_slug;
	}
	
	

	/**
	 * Return an instance of this class.
	 *
	 * @since     1.0.0
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		}

		return self::$instance;
	}

	/**
	 * Fired when the plugin is activated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Activate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       activated on an individual blog.
	 */
	public static function activate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide  ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_activate();
				}

				restore_current_blog();

			} else {
				self::single_activate();
			}

		} else {
			self::single_activate();
		}

	}

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 *
	 * @param    boolean    $network_wide    True if WPMU superadmin uses
	 *                                       "Network Deactivate" action, false if
	 *                                       WPMU is disabled or plugin is
	 *                                       deactivated on an individual blog.
	 */
	public static function deactivate( $network_wide ) {

		if ( function_exists( 'is_multisite' ) && is_multisite() ) {

			if ( $network_wide ) {

				// Get all blog ids
				$blog_ids = self::get_blog_ids();

				foreach ( $blog_ids as $blog_id ) {

					switch_to_blog( $blog_id );
					self::single_deactivate();

				}

				restore_current_blog();

			} else {
				self::single_deactivate();
			}

		} else {
			self::single_deactivate();
		}

	}

	/**
	 * Fired when a new site is activated with a WPMU environment.
	 *
	 * @since    1.0.0
	 *
	 * @param    int    $blog_id    ID of the new blog.
	 */
	public function activate_new_site( $blog_id ) {

		if ( 1 !== did_action( 'wpmu_new_blog' ) ) {
			return;
		}

		switch_to_blog( $blog_id );
		self::single_activate();
		restore_current_blog();

	}

	/**
	 * Get all blog ids of blogs in the current network that are:
	 * - not archived
	 * - not spam
	 * - not deleted
	 *
	 * @since    1.0.0
	 *
	 * @return   array|false    The blog ids, false if no matches.
	 */
	private static function get_blog_ids() {

		global $wpdb;

		// get an array of blog ids
		$sql = "SELECT blog_id FROM $wpdb->blogs
			WHERE archived = '0' AND spam = '0'
			AND deleted = '0'";

		return $wpdb->get_col( $sql );

	}

	/**
	 * Fired for each blog when the plugin is activated.
	 *
	 * @since    1.0.0
	 */
	private static function single_activate() {
		// @TODO: Define activation functionality here
		
	}

	/**
	 * Fired for each blog when the plugin is deactivated.
	 *
	 * @since    1.0.0
	 */
	private static function single_deactivate() {
		// @TODO: Define deactivation functionality here
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		$domain = $this->plugin_slug;
		$locale = apply_filters( 'plugin_locale', get_locale(), $domain );

		load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . $domain . '/' . $domain . '-' . $locale . '.mo' );
		load_plugin_textdomain( $domain, FALSE, basename( plugin_dir_path( dirname( __FILE__ ) ) ) . '/languages/' );

	}

	/**
	 * Register and enqueue public-facing style sheet.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{
		$file_ext = '.min.css';
		if(SEARCH_FILTER_DEBUG==true)
		{
			$file_ext = '.css';
		}
		
		$load_js_css	= get_option( 'search_filter_load_js_css' );
		
		if($load_js_css===false)
		{
			$load_js_css = 1;
			
		}
		
		if($load_js_css == 1)
		{
			wp_enqueue_style( $this->plugin_slug . '-plugin-styles', plugins_url( 'assets/css/search-filter'.$file_ext, __FILE__ ), array(), self::VERSION );
		}
	}
	
	/**
	 * Register and enqueues public-facing JavaScript files.
	 *
	 * @since    1.0.0
	 */
	public function register_scripts() {
		
		global $searchandfilter;
		
		$file_ext = '.min.js';
		if(SEARCH_FILTER_DEBUG==true)
		{
			$file_ext = '.js';
		}
		
		wp_register_script( $this->plugin_slug . '-plugin-build', plugins_url( 'assets/js/search-filter-build'.$file_ext, __FILE__ ), array('jquery'), self::VERSION );
		wp_register_script( $this->plugin_slug . '-plugin-chosen', plugins_url( 'assets/js/chosen.jquery'.$file_ext, __FILE__ ), array('jquery'), self::VERSION );
		wp_register_script( $this->plugin_slug . '-plugin-select2', plugins_url( 'assets/js/select2'.$file_ext, __FILE__ ), array('jquery'), self::VERSION );
		wp_register_script( $this->plugin_slug . '-plugin-jquery-i18n', '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/i18n/jquery-ui-i18n'.$file_ext, array('jquery'), self::VERSION );
		//wp_register_script( $this->plugin_slug . '-plugin-jquery-i18n', '//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/i18n/datepicker-nl.js', array('jquery'), self::VERSION );
		wp_localize_script($this->plugin_slug . '-plugin-build', 'SF_LDATA', array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'home_url' => (home_url('/')) ));
		
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
		
		if(($lazy_load_js!=1)&&($load_js_css==1))
		{
			$this->enqueue_scripts();
		}
		
		
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

	/**
	 * NOTE:  Actions are points in the execution of a page or process
	 *        lifecycle that WordPress fires.
	 *
	 *        Actions:    http://codex.wordpress.org/Plugin_API#Actions
	 *        Reference:  http://codex.wordpress.org/Plugin_API/Action_Reference
	 *
	 * @since    1.0.0
	 */
	public function create_custom_post_types() {
		// @TODO: Define your action hook callback here
		
		$labels = array(
		    'name'					=>	__( 'Search &amp; Filter', $this->plugin_slug ),
			'singular_name'			=>	__( 'Search Form', $this->plugin_slug ),
		    'add_new'				=>	__( 'Add New Search Form', $this->plugin_slug ),
		    'add_new_item'			=>	__( 'Add New Search Form', $this->plugin_slug ),
		    'edit_item'				=>	__( 'Edit Search Form', $this->plugin_slug ),
		    'new_item'				=>	__( 'New Search Form', $this->plugin_slug ),
		    'view_item'				=>	__( 'View Search Form', $this->plugin_slug ),
		    'search_items'			=>	__( 'Search \'Search Forms\'', $this->plugin_slug ),
		    'not_found'				=>	__( 'No Search Forms found', $this->plugin_slug ),
		    'not_found_in_trash'	=>	__( 'No Search Forms found in Trash', $this->plugin_slug ),
		);
		
		register_post_type($this->plugin_slug.'-widget' , array(
			'labels'			=> $labels,
			'public'			=> false,
			'show_ui'			=> true,
			'_builtin'			=> false,
			'capability_type'	=> 'page',
			'hierarchical'		=> true,
			'rewrite'			=> false,
			'supports'			=> array('title'),
			'show_in_menu'		=> false
			/*'has_archive' => true,*/
		));
	}
}


if ( ! class_exists( 'Search_Filter_Display_Shortcode' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-display-shortcode.php' );
}

if ( ! class_exists( 'Search_Filter_Third_Party' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-third-party.php' );
}

if ( ! class_exists( 'Search_Filter_Query' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-query.php' );
}

if ( ! class_exists( 'Search_Filter_Active_Query' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-active-query.php' );
}

if ( ! class_exists( 'Search_Filter_Cache' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-cache.php' );
}

if ( ! class_exists( 'Search_Filter_Config' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-config.php' );
}

if ( ! class_exists( 'Search_Filter_Global' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-global.php' );
}

if ( ! class_exists( 'Search_Filter_Cache' ) )
{
	require_once( plugin_dir_path( __FILE__ ) . 'includes/class-search-filter-cache.php' );
}
