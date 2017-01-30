<?php

/**
 * Fired during plugin activation
 *
 * @link       http://www.designsandcode.com
 * @since      1.0.0
 *
 * @package   
 * @subpackage 
 */

class Search_Filter_Helper {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public function __construct()
	{
		
		
	}	
	//Search_Filter_Helper::json_encode()
	public static function json_encode($obj)
	{
		if(function_exists('wp_json_encode'))
		{//introduced WP 4.1
			return wp_json_encode($obj);
		}
		else 
		{
			return json_encode($obj);
		}
		/*else
		{
			return false;
		}*/
		
	}
	
	public static function has_wpml()
	{
		//filter is for WPML v 3.5 and over
		//keep icl_object as a check for older WPML and also other plugins which declare the same functions for compatibility
		if((has_filter('wpml_object_id')||(function_exists('icl_object_id'))))
		{
			return true;			
		}
		
		return false;
	}
	
	public static function wpml_object_id($id = 0, $type = '', $return_original = '', $lang_code = '')
	{
		$lang_id = 0;
		
		if(has_filter('wpml_object_id'))
		{
			if($lang_code!="")
			{
				$lang_id = apply_filters( 'wpml_object_id', $id, $type, $return_original, $lang_code );
			}
			else
			{
				$lang_id = apply_filters( 'wpml_object_id', $id, $type, $return_original );
			}
		}
		else if(function_exists('icl_object_id'))
		{
			if($lang_code!="")
			{
				$lang_id = icl_object_id($id, $type, $return_original, $lang_code);
			}
			else
			{
				$lang_id = icl_object_id($id, $type, $return_original);
			}
		}
		
		return $lang_id;
	}
	public static function wpml_post_language_details($post_id = 0)
	{
		$lang_details = array();
		
		if(has_filter('wpml_post_language_details'))
		{
			$lang_details = apply_filters( 'wpml_post_language_details', NULL, $post_id );
		}
		else if(function_exists('wpml_get_language_information'))
		{
			$lang_details = wpml_get_language_information($post_id);
		}
		
		return $lang_details;
	}
	
	public static function wpml_post_language_code($post_id)
	{
		$lang_details = Search_Filter_Helper::wpml_post_language_details($post_id);
		if($lang_details)
		{
			return $lang_details['language_code'];
		}
		else
		{
			return "";
		}
	}
}
