<?php
/**
 * Search & Filter Pro
 * 
 * @package   Search_Filter_Post_Data
 * @author    Ross Morsali
 * @link      http://www.designsandcode.com/
 * @copyright 2015 Designs & Code
 */
 
class Search_Filter_Global
{
	private $plugin_slug = '';
	private $form_data = '';
	private $active_sfid = 0;
	private $count_table;
	private $results_ids = array();
	private $sf_queries;
	private $post_cache;
	private $pagination_init;
	private $queried_object;
	
	private $data;
	
	function __construct($plugin_slug)
	{
		$this->plugin_slug = $plugin_slug;
		$this->post_cache = new Search_Filter_Post_Cache();
		$this->pagination_init = false;
		
		add_action('search_filter_prep_query', array($this, 'set'), 10);
		add_action('search_filter_archive_query', array($this, 'query_posts'), 10); //legacy
		add_action('search_filter_do_query', array($this, 'query_posts'), 10); //legacy
		add_action('search_filter_query_posts', array($this, 'query_posts'), 10);
		add_action('search_filter_setup_pagination', array($this, 'setup_pagination'), 10);
		add_action('search_filter_update_post_cache', array($this, 'update_cache'), 10);
		add_action('search_filter_pagination_init', array($this, 'set_pagination_init'), 10);
		add_action('wp', array($this, 'set_queried_object'), 10);
		
		$this->data = new stdClass();
	}
	
	public function set($sfid)
	{
		//$this->active_sfid = $sfid;
		if(!isset($this->data->$sfid))
		{
			$this->data->$sfid = new Search_Filter_Config($this->plugin_slug, $sfid);
		}
	}
	
	
	public function setup_pagination($sfid)
	{
		if(!isset($this->data->$sfid))
		{
			$this->data->$sfid = new Search_Filter_Config($this->plugin_slug, $sfid);
		}
		
		$this->data->$sfid->query->setup_pagination();
	}
	
	public function query_posts($sfid)
	{
		//$this->active_sfid = $sfid;
		$this->get($sfid)->query()->do_main_query();
	}
	
	public function get($sfid)
	{
		//$this->active_sfid = $sfid;
		if(!isset($this->data->$sfid))
		{
			$this->data->$sfid = new Search_Filter_Config($this->plugin_slug, $sfid);
		}
		
		return $this->data->$sfid;
	}
	
	public function set_active_sfid($sfid)
	{
		$this->active_sfid = $sfid;
	}
	public function active_sfid()
	{
		return $this->active_sfid;
	}
	
	public function is_search_form($sfid)
	{
		return $this->get($sfid)->is_valid_form();
	}
	
	public function update_cache($postID)
	{		
		$this->post_cache->update_post_cache($postID);
	}
	
	public function set_pagination_init()
	{		
		$this->pagination_init = true;
	}
	
	public function has_pagination_init()
	{		
		return $this->pagination_init;
	}
	public function set_queried_object()
	{
		$this->queried_object =	get_queried_object();		
	}
	public function get_queried_object()
	{
		if((!isset($this->queried_object))||(empty($this->queried_object)))
		{
			$this->set_queried_object();
		}
		
		return $this->queried_object;
		
	}
}


?>