(function ( $ ) {
	"use strict";

	$(function () {
	
		var meta_prefs_action_name = "meta_prefs_set";

		// Place your administration-specific JavaScript here
		var $metabox_prefs = $('#screen-meta #screen-options-wrap .metabox-prefs');
		var $screen_options_link = $('#screen-options-link-wrap');
		var $screen_options_wrap = $('#screen-options-wrap');
		
		//then metabox not found
		if($metabox_prefs.length==0)
		{
			$metabox_prefs = $('#screen-meta #screen-options-wrap h5').after('<div class="metabox-prefs"><label for="welcome-hide" class="handle-custom-prefs"><input data-target="#search-filter-welcome-panel" name="welcome-hide" type="checkbox" id="welcome-hide" value="welcome">Welcome</label><br class="clear" /></div>');
		}
		
		$metabox_prefs.find("legend").after('<label for="welcome-hide" class="handle-custom-prefs"><input  data-target="#search-filter-welcome-panel" name="welcome-hide" type="checkbox" id="welcome-hide" value="welcome">Welcome</label>');
		
		//initialise checked state by seeing if the target has hidden class
		$metabox_prefs.find('.handle-custom-prefs input[type="checkbox"]').each(function()
		{
			var $this = $(this);
			var hide_element = $(this).attr('data-target');
			
			if(!$(hide_element).hasClass("hidden"))
			{
				$this.attr("checked", "checked");
			}
		
		});
		
		//
		$metabox_prefs.find('.handle-custom-prefs input[type="checkbox"]').off("change"); //remove existing handlers
		$metabox_prefs.find('.handle-custom-prefs input[type="checkbox"]').change(function()
		{
			var hide_element = $(this).attr('data-target');
			var show_option_value = 0;
			
			if(this.checked) {
				$(hide_element).removeClass("hidden");
				show_option_value = 1;
			}
			else
			{
				$(hide_element).addClass("hidden");
			}
			
			//run ajax to set option
			$.post( ajaxurl, {show: show_option_value, action: meta_prefs_action_name});/*.done(function(data)
			{//don't do anything
				
				if(data)
				{
					
				}
			});*/
			
		});
		
		$(".handle-dismiss-button").click(function()
		{
			var hide_element = $(this).attr('data-target');
			var show_option_value = 0;
			
			//hide element
			$(hide_element).addClass("hidden");
			
			//uncheck checkbox
			$metabox_prefs.find('.handle-custom-prefs input[type="checkbox"][data-target="'+hide_element+'"]').removeAttr("checked");
			
			//add user feedback that the element has been hidden and can be shown again by adding flicker effect to the screen options button 
			//$screen_options_link.css('background-color', '#f00');
			/*if($screen_options_wrap.css("display")=="none")
			{//don't run if the screen options are open
			
				$screen_options_link.delay(200).queue(function(next){
					$(this).addClass('highlight');
					next();
				}).delay(600).queue(function(next){
					$(this).removeClass('highlight');
					next();
				});
			}*/
				
			//run ajax to set option
			$.post( ajaxurl, {show: "0", action: meta_prefs_action_name});
		});
		
		
		var $cache_view = {};
		
		var $cache_views = $('#search-filter-cache .cache-metabox');
		$cache_view['disabled'] = $('#search-filter-cache .status-disabled');
		$cache_view['inprogress'] = $('#search-filter-cache .status-inprogress');
		$cache_view['error'] = $('#search-filter-cache .status-error');
		$cache_view['ready'] = $('#search-filter-cache .status-ready');
		$cache_view['finished'] = $('#search-filter-cache .status-finished')
		$cache_view['restart'] = $('#search-filter-cache .status-restart')
		$cache_view['termcache'] = $('#search-filter-cache .status-termcache')
		
		var last_cache_update_request = null;
		var has_restart_submit = false;
		var $rc_spinner = $("#search-filter-cache .rebuild-cache-spinner");
		var $rc_button = $("#search-filter-cache .button.rebuild-cache");
		var has_rc_error = false;
		
		/* check progress of caching */
		setInterval( function() {
			
			get_cache_progress();
			
		}, 15000);
		
		function get_cache_progress()
		{
			if(has_restart_submit==false)
			{
				var sfid = $(this).data("sfid");
				var cache_action = "cache_progress";
				
				if(last_cache_update_request)
				{
					last_cache_update_request.abort();
				}
				
				last_cache_update_request = $.post( ajaxurl, {action: cache_action}, function(){}, 'json').done(function(data)
				{//don't do anything
					
					handleAjaxUpdate(data);
				});
			}
		}
		get_cache_progress();
		
		function handleAjaxUpdate(data)
		{
			last_cache_update_request = null;
			
			$rc_spinner.css("visibility", "hidden");
			$rc_button.removeClass("disabled");
						
			if(data)
			{
				
				//console.log(data);
				if(data.status!="")
				{
					$cache_views.hide();
					
					$('#cache-info .notice-rc-error').hide();
					$('#cache-info .cache-metabox .notice-please-wait').hide();
					
					if((data.restart==true)&&(data.status!="ready"))
					{
						$cache_view["restart"].show();
						$('#cache-info .notice-rc-error').hide();
						$('#cache-info .cache-metabox .notice-please-wait').show();
					}
					else
					{
						$cache_view[data.status].show();
						
						if(data.status == "inprogress")
						{
							if(typeof(data.progress_percent)!="undefined")
							{
								
								$('#cache-info .cache-metabox .progress-percent').html(data.progress_percent);
								$('#cache-info .cache-metabox .progress-current').html(data.current_post_index);
								$('#cache-info .cache-metabox .progress-total').html(data.total_post_index);
								
								$('#cache-info .cache-metabox .media-progress-bar div').css("width", data.progress_percent+"%");
							}
							else
							{
								
							}
						}
						if(data.error_count==0)
						{
							$('#cache-info .cache-metabox .notice-stalled').hide();
							$('#cache-info .cache-metabox .notice-building').show();
						}
						else
						{
							$('#cache-info .cache-metabox .notice-stalled').show();
							$('#cache-info .cache-metabox .notice-building').hide();
						}
					}
										
					if(data.rc_status!="connect_success")
					{//then this install can't initiate a remote connection
						has_rc_error = true;
						
						if(((data.status == "inprogress")||(data.status == "termcache"))&& (!data.restart))
						{
							//console.log(data);
							$('#cache-info .notice-rc-error').show();
						}
						else if((data.restart==true)&&(data.status!="ready"))
						{
							$('#cache-info .cache-metabox .notice-please-wait').show();
						}
					}
					else
					{
						has_rc_error = false;
					}
				}
				
			}
		}
		
		function initCacheButton()
		{
			
			$rc_button.on("click", function(){
				
				if($(this).hasClass("disabled"))
				{
					return false;
				}
				
				var sfid = $(this).data("sfid");
				var cache_action = "cache_restart";
				
				
				if(last_cache_update_request)
				{
					last_cache_update_request.abort();
				}
				
				has_restart_submit = true;
				
				$rc_spinner.css("visibility", "visible");
				$(this).addClass("disabled");
				
				last_cache_update_request = $.post( ajaxurl, {action: cache_action}, function(){}, 'json').done(function(data)
				{//don't do anything
					has_restart_submit = false;
					handleAjaxUpdate(data);
				
				});
			});
		}
		initCacheButton();
		
	});

}(jQuery));