<?php
/**
 * Search & Filter Pro
 * 
 * @package   Search_Filter_Field_Post_Meta_Choice
 * @author    Ross Morsali
 * @link      http://www.designsandcode.com/
 * @copyright 2015 Designs & Code
 */

class Search_Filter_Field_Post_Meta_Choice {
	
	public function __construct($plugin_slug, $sfid) {

		$this->plugin_slug = $plugin_slug;
		$this->sfid = $sfid;
		$this->create_input = new Search_Filter_Generate_Input($this->plugin_slug, $sfid);
		
		global $wpdb;
		$this->cache_table_name = $wpdb->prefix . 'search_filter_cache';
		$this->term_results_table_name = $wpdb->prefix . 'search_filter_term_results';
	}
	
	public function get($field_name, $args, $fields_defaults)
	{
		if(count($fields_defaults)==0)
		{
			$fields_defaults = array("");
		}
		
		$returnvar = "";
		
		$meta_options = array();
		
		$input_args = array(
			'name'			=> $field_name,
			'defaults'		=> $fields_defaults,
			'attributes'	=> array(),
			'options'		=> array()
		);
		
		$args['show_count_format_sf'] = "inline";
		$args['show_default_option_sf'] = false;
		$args['name_sf'] = $field_name;
		
		if($args['choice_input_type']=="select")
		{
			//setup any custom attributes
			$attributes = array();
			if($args['combo_box']==1)
			{
				$attributes['data-combobox'] = '1';
			}
			
			$args['show_default_option_sf'] = true;
			
			$input_args['options'] = $this->get_options($args);
			$input_args['attributes'] = $attributes;
			$input_args['accessibility_label'] = $args['choice_accessibility_label'];
			
			$returnvar .= $this->create_input->select($input_args);
			
		}
		if($args['choice_input_type']=="checkbox")
		{
			$attributes = array();
			$attributes['data-operator'] = $args['operator'];
			
			$args['show_count_format_sf'] = "html";
			
			$input_args['options'] = $this->get_options($args);
			$input_args['attributes'] = $attributes;
			
			$returnvar .= $this->create_input->checkbox($input_args);
		}
		else if($args['choice_input_type']=="radio")
		{
			$attributes = array();
			
			$args['show_default_option_sf'] = true;
			$args['show_count_format_sf'] = "html";
			
			$input_args['options'] = $this->get_options($args);
			$input_args['attributes'] = $attributes;
			
			$returnvar .= $this->create_input->radio($input_args);
		}
		else if($args['choice_input_type']=="multiselect")
		{
			//setup any custom attributes
			$attributes = array();
			
			$attributes['data-operator'] = $args['operator'];
			
			if($args['combo_box']==1)
			{
				$attributes['data-combobox'] = '1';
				$attributes['data-placeholder'] = $args['show_option_all_sf'];
			}			
			$attributes['multiple'] = "multiple";
			
			//finalise input args object
			$input_args['options'] = $this->get_options($args);
			$input_args['attributes'] = $attributes;
			$input_args['accessibility_label'] = $args['choice_accessibility_label'];
			
			$returnvar .= $this->create_input->select($input_args);
		}
		
		return $returnvar;
	}
	
	private function get_options_manual($args)
	{
		$options = array();
		
		$name = $args['name_sf'];
		$show_option_all_sf = $args['show_option_all_sf'];
		$show_default_option_sf = $args['show_default_option_sf'];
		$show_count = $args['show_count'];
		$show_count_format_sf = $args['show_count_format_sf'];
		$hide_empty = $args['hide_empty'];
		
		global $searchandfilter;
		$searchform = $searchandfilter->get($this->sfid);
		$this->auto_count = $searchform->settings("enable_auto_count");
		$this->auto_count_deselect_emtpy = $searchform->settings("auto_count_deselect_emtpy");
		
		if((isset($show_option_all_sf))&&($show_default_option_sf==true))
		{
			$default_option = new stdClass();
			$default_option->label = $show_option_all_sf;
			$default_option->attributes = array(
				'class' => SF_CLASS_PRE.'level-0 '.SF_ITEM_CLASS_PRE.'0'
			);
			$default_option->value = "";
			
			array_push($options, $default_option);
		}
		
		if(isset($args['meta_options']))
		{
			if(is_array($args['meta_options']))
			{
				$meta_options = array();
				
				foreach ($args['meta_options'] as $meta_option)
				{
					if($this->auto_count==1)
					{	
						$option_count = $searchandfilter->get($this->sfid)->get_count_var($name, ($meta_option['option_value']));
					}
					else
					{
						$option_count = 0;
					}
					
					if((intval($hide_empty)!=1)||($option_count!=0))
					{
						$option = new stdClass();
						$option->label = $meta_option['option_label'];
						$option->count = $option_count;
						$option->attributes = array(
							'class' => SF_CLASS_PRE.'level-0 '
						);
						$option->value = $meta_option['option_value'];
						
						if($show_count==1)
						{
							if($show_count_format_sf=="inline")
							{
								$option->label .= '&nbsp;&nbsp;(' . number_format_i18n($option_count) . ')';
							}
							else if($show_count_format_sf=="html")
							{
								$option->label .= '<span class="sf-count">(' . number_format_i18n($option_count) . ')</span>';
							}
						}
						
						array_push($options, $option);
					}
				}
			}
		}
		
		return $options;
	}
	private function get_options($args)
	{
		if($args['choice_get_option_mode']=="manual")
		{
			return $this->get_options_manual($args);
		}
		else if($args['choice_get_option_mode']=="auto")
		{
			return $this->get_options_auto($args);
		}
	}
	
	private function get_options_auto($args)
	{
		$options = array();
		
		$name = $args['name_sf'];
		$show_option_all_sf = $args['show_option_all_sf'];
		$show_default_option_sf = $args['show_default_option_sf'];
		$show_count = $args['show_count'];
		$show_count_format_sf = $args['show_count_format_sf'];
		$hide_empty = $args['hide_empty'];
		
		global $searchandfilter;
		$searchform = $searchandfilter->get($this->sfid);
		$this->auto_count = $searchform->settings("enable_auto_count");
		$this->auto_count_deselect_emtpy = $searchform->settings("auto_count_deselect_emtpy");
		
		if((isset($show_option_all_sf))&&($show_default_option_sf==true))
		{
			$default_option = new stdClass();
			$default_option->label = $show_option_all_sf;
			$default_option->attributes = array(
				'class' => SF_CLASS_PRE.'level-0 '.SF_ITEM_CLASS_PRE.'0'
			);
			$default_option->value = "";
			
			array_push($options, $default_option);
		}
		
		
		$is_acf = $args['choice_is_acf'];
		$acf_options = array();
		if($is_acf==1)
		{
			$acf_options = $this->get_acf_options($args);
			$options = array_merge($options, $acf_options);
			
		}
		
		if(($is_acf!=1)||(empty($acf_options)))
		{
			//now check the DB for the options in this field and build options
			global $wpdb;
			
			$order_type = $args['choice_order_option_type'];
			$order_dir = $args['choice_order_option_dir'];
			
			
			if($order_type=="numeric")
			{
				$order_by =  "cast(field_value AS UNSIGNED) $order_dir";
			}
			else
			{
				$order_by =  "field_value $order_dir";
			}
			
			$field_options = $wpdb->get_results( 
				"
				SELECT field_value
				FROM $this->term_results_table_name
				WHERE field_name = '$name' AND field_value != ''
				ORDER BY $order_by
				"
			);
			
			foreach($field_options as $field_option)
			{
				if($this->auto_count==1)
				{	
					$option_count = $searchandfilter->get($this->sfid)->get_count_var($name, ($field_option->field_value));
				}
				else
				{
					$option_count = 0;
				}
				
				if((intval($hide_empty)!=1)||($option_count!=0))
				{
					$option = new stdClass();
					$option->label = $field_option->field_value;
					$option->count = $option_count;
					$option->attributes = array(
						'class' => SF_CLASS_PRE.'level-0 '
					);
					$option->value = $field_option->field_value;
					
					if($show_count==1)
					{
						if($show_count_format_sf=="inline")
						{
							$option->label .= '&nbsp;&nbsp;(' . number_format_i18n($option_count) . ')';
						}
						else if($show_count_format_sf=="html")
						{
							$option->label .= '<span class="sf-count">(' . number_format_i18n($option_count) . ')</span>';
						}
					}
					
					array_push($options, $option);
				}
			}
		
		}
		
		return $options;
	}
	
	private function find_post_id_with_field($field_name)
	{
		global $wpdb;
		
		$field_options = $wpdb->get_results( 
			"
			SELECT field_value, result_ids
			FROM $this->term_results_table_name
			WHERE field_name = '$field_name' LIMIT 0,1
			"
		);
		
		foreach($field_options as $field_option)
		{
			
			$post_ids = explode(",", $field_option->result_ids);
			
			if(isset($post_ids[0]))
			{
				return $post_ids[0];
			}
		}
		
		return 0;
	}
	private function get_acf_options($args)
	{
		$options = array();
		
		if(!function_exists('get_field_object'))
		{
			return $options;
		}
		
		$name = $args['name_sf'];
		$show_option_all_sf = $args['show_option_all_sf'];
		$show_default_option_sf = $args['show_default_option_sf'];
		$show_count = $args['show_count'];
		$show_count_format_sf = $args['show_count_format_sf'];
		$hide_empty = $args['hide_empty'];
		
		
		$post_id = $this->find_post_id_with_field($name); //acf needs to have at least 1 post id with the post meta attached in order to lookup the rest of the field
		$field = get_field_object($args['meta_key'], $post_id);
		
		
		if(isset($field['choices']))
		{
			$choices = $field['choices'];
			
			$order_type = $args['choice_order_option_type'];
			$order_dir = $args['choice_order_option_dir'];
			$order_by = $args['choice_order_option_by'];
			
			if($order_by == "value")
			{
				if($order_type=="numeric")
				{
					ksort($choices, SORT_NUMERIC);
				}
				else
				{
					ksort($choices, SORT_STRING);
				}
				
				
			}
			else if($order_by == "label")
			{
				if($order_type=="numeric")
				{
					asort($choices, SORT_NUMERIC);
				}
				else
				{
					asort($choices, SORT_STRING);
				}
			}
			
			if($order_dir=="desc")
			{
				$choices = array_reverse($choices);
			}
			
			foreach( $choices as $value => $label )
			{			
				if($this->auto_count==1)
				{
					global $searchandfilter;
					$option_count = $searchandfilter->get($this->sfid)->get_count_var($name, ($value));
				}
				else
				{
					$option_count = 0;
				}
				
				if((intval($hide_empty)!=1)||($option_count!=0))
				{
					$option = new stdClass();
					$option->label = $label;
					$option->count = $option_count;
					$option->attributes = array(
						'class' => SF_CLASS_PRE.'level-0 '
					);
					$option->value = $value;
					
					if($show_count==1)
					{
						if($show_count_format_sf=="inline")
						{
							$option->label .= '&nbsp;&nbsp;(' . number_format_i18n($option_count) . ')';
						}
						else if($show_count_format_sf=="html")
						{
							$option->label .= '<span class="sf-count">(' . number_format_i18n($option_count) . ')</span>';
						}
					}
					
					array_push($options, $option);
				}
				
			}
		}
		
		return $options;
		
	}
}
